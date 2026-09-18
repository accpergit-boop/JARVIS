from fastapi import FastAPI, APIRouter, HTTPException, Request, File, UploadFile, Response, Query, Header
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timezone, timedelta
import os
import logging
import uuid
import stripe
import urllib.request
import json
from typing import Optional, List

from models import (
    User, Address, Product, Order, OrderItem, Favorite, FavoriteOrder,
    SessionRequest, UpdateProfileRequest, AddressRequest, CreateOrderRequest,
    CheckoutRequest, CalculateDeliveryRequest, SaveFavoriteOrderRequest,
    UpdateOrderStatusRequest, ProductRequest, DiscountCodeRequest, DeliveryAddress
)
from auth import get_current_user, get_current_user_optional, require_admin
from storage import init_storage, put_object, get_object, APP_NAME
from notifications import send_order_confirmation_email, send_new_order_sms

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe setup
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_emergent')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# ==================== AUTH ROUTES ====================
@api_router.post("/auth/session")
async def create_session(request: SessionRequest):
    """Exchange session_id for session_token and user data."""
    try:
        # Call Emergent Auth API
        auth_url = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
        req = urllib.request.Request(
            auth_url,
            headers={"X-Session-ID": request.session_id}
        )
        
        with urllib.request.urlopen(req) as response:
            auth_data = json.loads(response.read().decode())
        
        # Create or update user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        existing_user = await db.users.find_one({"email": auth_data["email"]}, {"_id": 0})
        
        if existing_user:
            user_id = existing_user["user_id"]
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {
                    "name": auth_data["name"],
                    "picture": auth_data.get("picture"),
                    "updated_at": datetime.now(timezone.utc)
                }}
            )
        else:
            await db.users.insert_one({
                "user_id": user_id,
                "email": auth_data["email"],
                "name": auth_data["name"],
                "picture": auth_data.get("picture"),
                "phone": None,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            })
        
        # Create session
        session_token = auth_data["session_token"]
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        
        await db.user_sessions.insert_one({
            "session_token": session_token,
            "user_id": user_id,
            "expires_at": expires_at,
            "created_at": datetime.now(timezone.utc)
        })
        
        user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
        
        return {
            "session_token": session_token,
            "user": user_doc
        }
    except Exception as e:
        logger.error(f"Session creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current user info."""
    user = await get_current_user(request, db)
    return user

@api_router.post("/auth/logout")
async def logout(request: Request):
    """Logout current user."""
    try:
        user = await get_current_user(request, db)
        session_token = request.cookies.get("session_token")
        
        if session_token:
            await db.user_sessions.delete_one({"session_token": session_token})
        
        return {"message": "Logged out successfully"}
    except:
        return {"message": "Logged out"}

# ==================== MENU ROUTES ====================
@api_router.get("/menu/categories")
async def get_categories():
    """Get all menu categories with product count."""
    categories = [
        {"id": "signature_dishes", "name": "Signature Dishes", "icon": "utensils"},
        {"id": "bbq_grill", "name": "BBQ & Grill", "icon": "flame"},
        {"id": "curries", "name": "Curries", "icon": "bowl-rice"},
        {"id": "bread", "name": "Fresh Bread", "icon": "bread-slice"},
        {"id": "starters", "name": "Starters", "icon": "leaf"},
        {"id": "desserts", "name": "Desserts", "icon": "ice-cream"},
        {"id": "drinks", "name": "Drinks", "icon": "glass-water"},
        {"id": "sa_favourites", "name": "South African Favourites", "icon": "star"}
    ]
    
    # Add product counts
    for category in categories:
        count = await db.products.count_documents({"category": category["id"], "is_available": True})
        category["count"] = count
    
    return categories

@api_router.get("/menu/products")
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None
):
    """Get all products with filters."""
    query = {"is_available": True}
    
    if category:
        query["category"] = category
    
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    
    if featured is not None:
        query["is_featured"] = featured
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/menu/products/{product_id}")
async def get_product(product_id: str):
    """Get product details."""
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# ==================== ORDER ROUTES ====================
@api_router.post("/orders")
async def create_order(order_request: CreateOrderRequest, request: Request):
    """Create a new order (authenticated or guest)."""
    user = await get_current_user_optional(request, db)
    
    if not order_request.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")
    
    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in order_request.items)
    
    # Calculate delivery fee
    delivery_fee = 0
    if order_request.delivery_type == "delivery":
        if order_request.delivery_address:
            delivery_fee = await calculate_delivery_fee(order_request.delivery_address.postal_code)
        else:
            raise HTTPException(status_code=400, detail="Delivery address required for delivery orders")
    
    # Apply discount code
    discount_amount = 0
    if order_request.discount_code:
        discount_doc = await db.discount_codes.find_one(
            {"code": order_request.discount_code, "is_active": True},
            {"_id": 0}
        )
        
        if discount_doc:
            now = datetime.now(timezone.utc)
            valid_from = discount_doc["valid_from"]
            valid_until = discount_doc["valid_until"]
            
            if isinstance(valid_from, str):
                valid_from = datetime.fromisoformat(valid_from)
            if isinstance(valid_until, str):
                valid_until = datetime.fromisoformat(valid_until)
            
            if valid_from.tzinfo is None:
                valid_from = valid_from.replace(tzinfo=timezone.utc)
            if valid_until.tzinfo is None:
                valid_until = valid_until.replace(tzinfo=timezone.utc)
            
            if valid_from <= now <= valid_until:
                if subtotal >= discount_doc["min_order_amount"]:
                    if discount_doc["current_uses"] < discount_doc["max_uses"]:
                        if discount_doc["discount_type"] == "percentage":
                            discount_amount = subtotal * (discount_doc["discount_value"] / 100)
                        else:
                            discount_amount = discount_doc["discount_value"]
                        
                        # Update usage count
                        await db.discount_codes.update_one(
                            {"code": order_request.discount_code},
                            {"$inc": {"current_uses": 1}}
                        )
    
    total = subtotal + delivery_fee - discount_amount
    
    # Create order
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    order_data = {
        "order_id": order_id,
        "user_id": user["user_id"] if user else None,
        "guest_email": order_request.guest_email if not user else None,
        "guest_name": order_request.guest_name if not user else None,
        "guest_phone": order_request.guest_phone if not user else None,
        "items": [item.model_dump() for item in order_request.items],
        "subtotal": subtotal,
        "delivery_fee": delivery_fee,
        "discount_amount": discount_amount,
        "total": total,
        "delivery_type": order_request.delivery_type,
        "delivery_address": order_request.delivery_address.model_dump() if order_request.delivery_address else None,
        "status": "pending",
        "payment_status": "pending",
        "discount_code_used": order_request.discount_code,
        "notes": order_request.notes,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    await db.orders.insert_one(order_data)
    
    return await db.orders.find_one({"order_id": order_id}, {"_id": 0})

@api_router.get("/orders")
async def get_user_orders(request: Request):
    """Get user's order history."""
    user = await get_current_user(request, db)
    orders = await db.orders.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return orders

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, request: Request):
    """Get order details."""
    user = await get_current_user_optional(request, db)
    
    query = {"order_id": order_id}
    if user:
        query["user_id"] = user["user_id"]
    
    order = await db.orders.find_one(query, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@api_router.post("/orders/{order_id}/reorder")
async def reorder(order_id: str, request: Request):
    """Reorder from previous order."""
    user = await get_current_user(request, db)
    
    original_order = await db.orders.find_one(
        {"order_id": order_id, "user_id": user["user_id"]},
        {"_id": 0}
    )
    
    if not original_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Create new order with same items
    new_order_id = f"order_{uuid.uuid4().hex[:12]}"
    new_order = {
        "order_id": new_order_id,
        "user_id": user["user_id"],
        "items": original_order["items"],
        "subtotal": original_order["subtotal"],
        "delivery_fee": 0,
        "discount_amount": 0,
        "total": original_order["subtotal"],
        "delivery_type": "pickup",
        "delivery_address": None,
        "status": "pending",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    await db.orders.insert_one(new_order)
    return await db.orders.find_one({"order_id": new_order_id}, {"_id": 0})

@api_router.get("/orders/{order_id}/track")
async def track_order(order_id: str):
    """Track order status (public endpoint)."""
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {
        "order_id": order["order_id"],
        "status": order["status"],
        "payment_status": order["payment_status"],
        "delivery_type": order["delivery_type"],
        "created_at": order["created_at"],
        "updated_at": order["updated_at"]
    }

# ==================== FAVORITES ROUTES ====================
@api_router.get("/favorites/products")
async def get_favorite_products(request: Request):
    """Get user's favorite products."""
    user = await get_current_user(request, db)
    
    favorites = await db.favorites.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).to_list(100)
    
    product_ids = [f["product_id"] for f in favorites]
    products = await db.products.find(
        {"product_id": {"$in": product_ids}},
        {"_id": 0}
    ).to_list(100)
    
    return products

@api_router.post("/favorites/products/{product_id}")
async def add_favorite_product(product_id: str, request: Request):
    """Add product to favorites."""
    user = await get_current_user(request, db)
    
    existing = await db.favorites.find_one({
        "user_id": user["user_id"],
        "product_id": product_id
    })
    
    if existing:
        return {"message": "Already in favorites"}
    
    await db.favorites.insert_one({
        "user_id": user["user_id"],
        "product_id": product_id,
        "created_at": datetime.now(timezone.utc)
    })
    
    return {"message": "Added to favorites"}

@api_router.delete("/favorites/products/{product_id}")
async def remove_favorite_product(product_id: str, request: Request):
    """Remove product from favorites."""
    user = await get_current_user(request, db)
    
    await db.favorites.delete_one({
        "user_id": user["user_id"],
        "product_id": product_id
    })
    
    return {"message": "Removed from favorites"}

@api_router.get("/favorites/orders")
async def get_favorite_orders(request: Request):
    """Get user's saved orders."""
    user = await get_current_user(request, db)
    
    favorite_orders = await db.favorite_orders.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).to_list(100)
    
    return favorite_orders

@api_router.post("/favorites/orders")
async def save_favorite_order(order_request: SaveFavoriteOrderRequest, request: Request):
    """Save an order as favorite."""
    user = await get_current_user(request, db)
    
    favorite_order_id = f"fav_{uuid.uuid4().hex[:12]}"
    
    await db.favorite_orders.insert_one({
        "favorite_order_id": favorite_order_id,
        "user_id": user["user_id"],
        "name": order_request.name,
        "items": [item.model_dump() for item in order_request.items],
        "created_at": datetime.now(timezone.utc)
    })
    
    return await db.favorite_orders.find_one({"favorite_order_id": favorite_order_id}, {"_id": 0})

@api_router.delete("/favorites/orders/{favorite_order_id}")
async def delete_favorite_order(favorite_order_id: str, request: Request):
    """Delete a saved order."""
    user = await get_current_user(request, db)
    
    await db.favorite_orders.delete_one({
        "favorite_order_id": favorite_order_id,
        "user_id": user["user_id"]
    })
    
    return {"message": "Favorite order deleted"}

# ==================== ADDRESSES ROUTES ====================
@api_router.get("/addresses")
async def get_addresses(request: Request):
    """Get user's saved addresses."""
    user = await get_current_user(request, db)
    addresses = await db.addresses.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).to_list(100)
    return addresses

@api_router.post("/addresses")
async def create_address(address_request: AddressRequest, request: Request):
    """Add a new address."""
    user = await get_current_user(request, db)
    
    # If this is set as default, unset others
    if address_request.is_default:
        await db.addresses.update_many(
            {"user_id": user["user_id"]},
            {"$set": {"is_default": False}}
        )
    
    address_id = f"addr_{uuid.uuid4().hex[:12]}"
    
    await db.addresses.insert_one({
        "address_id": address_id,
        "user_id": user["user_id"],
        "label": address_request.label,
        "street": address_request.street,
        "city": address_request.city,
        "postal_code": address_request.postal_code,
        "phone": address_request.phone,
        "is_default": address_request.is_default,
        "created_at": datetime.now(timezone.utc)
    })
    
    return await db.addresses.find_one({"address_id": address_id}, {"_id": 0})

@api_router.put("/addresses/{address_id}")
async def update_address(address_id: str, address_request: AddressRequest, request: Request):
    """Update an address."""
    user = await get_current_user(request, db)
    
    # If this is set as default, unset others
    if address_request.is_default:
        await db.addresses.update_many(
            {"user_id": user["user_id"]},
            {"$set": {"is_default": False}}
        )
    
    await db.addresses.update_one(
        {"address_id": address_id, "user_id": user["user_id"]},
        {"$set": {
            "label": address_request.label,
            "street": address_request.street,
            "city": address_request.city,
            "postal_code": address_request.postal_code,
            "phone": address_request.phone,
            "is_default": address_request.is_default
        }}
    )
    
    return await db.addresses.find_one({"address_id": address_id}, {"_id": 0})

@api_router.delete("/addresses/{address_id}")
async def delete_address(address_id: str, request: Request):
    """Delete an address."""
    user = await get_current_user(request, db)
    
    await db.addresses.delete_one({
        "address_id": address_id,
        "user_id": user["user_id"]
    })
    
    return {"message": "Address deleted"}

# ==================== DELIVERY ROUTES ====================
async def calculate_delivery_fee(postal_code: str) -> float:
    """Calculate delivery fee based on postal code."""
    # Simple logic: base fee + distance-based fee
    base_fee = 20.0
    
    # In production, use actual distance calculation
    # For now, simple postal code-based logic
    try:
        code_num = int(postal_code[:4]) if postal_code else 0
        # Pietermaritzburg postal codes: 3200-3299
        if 3200 <= code_num <= 3299:
            return base_fee
        else:
            # Outside area - higher fee
            return base_fee + 30.0
    except:
        return base_fee

@api_router.post("/delivery/calculate")
async def calculate_delivery(delivery_request: CalculateDeliveryRequest):
    """Calculate delivery fee."""
    fee = await calculate_delivery_fee(delivery_request.postal_code)
    return {"delivery_fee": fee}

# ==================== PAYMENT ROUTES ====================
@api_router.post("/payments/checkout")
async def create_checkout(checkout_request: CheckoutRequest, request: Request):
    """Create Stripe checkout session."""
    user = await get_current_user_optional(request, db)
    
    # Get order
    order = await db.orders.find_one({"order_id": checkout_request.order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Verify order ownership
    if user:
        if order.get("user_id") != user["user_id"]:
            raise HTTPException(status_code=403, detail="Access denied")
    
    try:
        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "zar",
                    "unit_amount": int(order["total"] * 100),
                    "product_data": {
                        "name": f"ZAIQA Order #{order['order_id'][:8]}",
                        "description": f"{len(order['items'])} items"
                    }
                },
                "quantity": 1
            }],
            mode="payment",
            success_url=f"{checkout_request.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{checkout_request.origin_url}/payment/cancel",
            metadata={
                "order_id": order["order_id"],
                "user_id": user["user_id"] if user else ""
            }
        )
        
        # Update order with session ID
        await db.orders.update_one(
            {"order_id": order["order_id"]},
            {"$set": {
                "stripe_session_id": session.id,
                "updated_at": datetime.now(timezone.utc)
            }}
        )
        
        # Store payment transaction
        await db.payment_transactions.insert_one({
            "session_id": session.id,
            "order_id": order["order_id"],
            "user_id": user["user_id"] if user else None,
            "amount": order["total"],
            "currency": "zar",
            "status": "initiated",
            "payment_status": "pending",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        })
        
        return {
            "checkout_url": session.url,
            "session_id": session.id
        }
    except Exception as e:
        logger.error(f"Checkout creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str):
    """Get payment status."""
    transaction = await db.payment_transactions.find_one(
        {"session_id": session_id},
        {"_id": 0}
    )
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Webhook fallback: check Stripe directly if still pending
    if transaction.get("payment_status") != "paid":
        try:
            stripe_session = stripe.checkout.Session.retrieve(session_id)
            if stripe_session.payment_status == "paid" or stripe_session.status == "complete":
                # Update transaction
                await db.payment_transactions.update_one(
                    {"session_id": session_id, "payment_status": {"$ne": "paid"}},
                    {"$set": {
                        "status": "completed",
                        "payment_status": "paid",
                        "updated_at": datetime.now(timezone.utc)
                    }}
                )
                
                # Update order
                order_id = transaction["order_id"]
                await db.orders.update_one(
                    {"order_id": order_id},
                    {"$set": {
                        "payment_status": "paid",
                        "status": "confirmed",
                        "updated_at": datetime.now(timezone.utc)
                    }}
                )
                
                # Send notifications
                order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
                if order:
                    # Get user email if authenticated order
                    if order.get("user_id"):
                        user = await db.users.find_one({"user_id": order["user_id"]}, {"_id": 0})
                        order["user_email"] = user["email"] if user else None
                    
                    await send_order_confirmation_email(order)
                    await send_new_order_sms(order)
                
                # Refresh transaction
                transaction = await db.payment_transactions.find_one(
                    {"session_id": session_id},
                    {"_id": 0}
                )
        except Exception as e:
            logger.error(f"Payment status check failed: {e}")
    
    return {
        "session_id": transaction["session_id"],
        "status": transaction["status"],
        "payment_status": transaction["payment_status"]
    }

@api_router.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")
    webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
    
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except Exception as e:
        logger.error(f"Webhook signature verification failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    event_type = event["type"]
    event_obj = event["data"]["object"]
    
    if event_type == "checkout.session.completed":
        session_id = event_obj["id"]
        order_id = event_obj["metadata"].get("order_id")
        
        # Update transaction
        await db.payment_transactions.update_one(
            {"session_id": session_id, "payment_status": {"$ne": "paid"}},
            {"$set": {
                "status": "completed",
                "payment_status": "paid",
                "updated_at": datetime.now(timezone.utc)
            }}
        )
        
        # Update order
        if order_id:
            await db.orders.update_one(
                {"order_id": order_id},
                {"$set": {
                    "payment_status": "paid",
                    "status": "confirmed",
                    "updated_at": datetime.now(timezone.utc)
                }}
            )
            
            # Send notifications
            order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
            if order:
                # Get user email if authenticated order
                if order.get("user_id"):
                    user = await db.users.find_one({"user_id": order["user_id"]}, {"_id": 0})
                    order["user_email"] = user["email"] if user else None
                
                await send_order_confirmation_email(order)
                await send_new_order_sms(order)
    
    return {"status": "ok"}

# ==================== USER ROUTES ====================
@api_router.get("/users/profile")
async def get_profile(request: Request):
    """Get user profile."""
    user = await get_current_user(request, db)
    return user

@api_router.put("/users/profile")
async def update_profile(profile_request: UpdateProfileRequest, request: Request):
    """Update user profile."""
    user = await get_current_user(request, db)
    
    update_fields = {}
    if profile_request.name:
        update_fields["name"] = profile_request.name
    if profile_request.phone:
        update_fields["phone"] = profile_request.phone
    
    if update_fields:
        update_fields["updated_at"] = datetime.now(timezone.utc)
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {"$set": update_fields}
        )
    
    return await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0})

# ==================== ADMIN ROUTES ====================
@api_router.get("/admin/orders")
async def admin_get_orders(
    request: Request,
    status: Optional[str] = None,
    payment_status: Optional[str] = None
):
    """Get all orders (admin only)."""
    await require_admin(request, db)
    
    query = {}
    if status:
        query["status"] = status
    if payment_status:
        query["payment_status"] = payment_status
    
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return orders

@api_router.put("/admin/orders/{order_id}/status")
async def admin_update_order_status(
    order_id: str,
    status_request: UpdateOrderStatusRequest,
    request: Request
):
    """Update order status (admin only)."""
    await require_admin(request, db)
    
    await db.orders.update_one(
        {"order_id": order_id},
        {"$set": {
            "status": status_request.status,
            "updated_at": datetime.now(timezone.utc)
        }}
    )
    
    return await db.orders.find_one({"order_id": order_id}, {"_id": 0})

@api_router.get("/admin/stats")
async def admin_get_stats(request: Request):
    """Get dashboard statistics (admin only)."""
    await require_admin(request, db)
    
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "pending"})
    confirmed_orders = await db.orders.count_documents({"status": "confirmed"})
    preparing_orders = await db.orders.count_documents({"status": "preparing"})
    
    # Calculate total revenue
    pipeline = [
        {"$match": {"payment_status": "paid"}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    total_users = await db.users.count_documents({})
    
    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "confirmed_orders": confirmed_orders,
        "preparing_orders": preparing_orders,
        "total_revenue": total_revenue,
        "total_users": total_users
    }

@api_router.post("/admin/products")
async def admin_create_product(product_request: ProductRequest, request: Request):
    """Create a new product (admin only)."""
    await require_admin(request, db)
    
    product_id = f"prod_{uuid.uuid4().hex[:12]}"
    
    await db.products.insert_one({
        "product_id": product_id,
        "name": product_request.name,
        "description": product_request.description,
        "price": product_request.price,
        "category": product_request.category,
        "image_url": product_request.image_url,
        "is_available": product_request.is_available,
        "is_featured": product_request.is_featured,
        "created_at": datetime.now(timezone.utc)
    })
    
    return await db.products.find_one({"product_id": product_id}, {"_id": 0})

@api_router.put("/admin/products/{product_id}")
async def admin_update_product(product_id: str, product_request: ProductRequest, request: Request):
    """Update a product (admin only)."""
    await require_admin(request, db)
    
    await db.products.update_one(
        {"product_id": product_id},
        {"$set": {
            "name": product_request.name,
            "description": product_request.description,
            "price": product_request.price,
            "category": product_request.category,
            "image_url": product_request.image_url,
            "is_available": product_request.is_available,
            "is_featured": product_request.is_featured
        }}
    )
    
    return await db.products.find_one({"product_id": product_id}, {"_id": 0})

@api_router.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, request: Request):
    """Delete a product (admin only)."""
    await require_admin(request, db)
    
    await db.products.update_one(
        {"product_id": product_id},
        {"$set": {"is_available": False}}
    )
    
    return {"message": "Product deleted"}

@api_router.get("/admin/discount-codes")
async def admin_get_discount_codes(request: Request):
    """Get all discount codes (admin only)."""
    await require_admin(request, db)
    
    codes = await db.discount_codes.find({}, {"_id": 0}).to_list(1000)
    return codes

@api_router.post("/admin/discount-codes")
async def admin_create_discount_code(code_request: DiscountCodeRequest, request: Request):
    """Create a discount code (admin only)."""
    await require_admin(request, db)
    
    # Check if code already exists
    existing = await db.discount_codes.find_one({"code": code_request.code.upper()})
    if existing:
        raise HTTPException(status_code=400, detail="Code already exists")
    
    await db.discount_codes.insert_one({
        "code": code_request.code.upper(),
        "discount_type": code_request.discount_type,
        "discount_value": code_request.discount_value,
        "min_order_amount": code_request.min_order_amount,
        "max_uses": code_request.max_uses,
        "current_uses": 0,
        "valid_from": code_request.valid_from,
        "valid_until": code_request.valid_until,
        "is_active": code_request.is_active
    })
    
    return await db.discount_codes.find_one({"code": code_request.code.upper()}, {"_id": 0})

# ==================== STORAGE ROUTES ====================
@api_router.post("/storage/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload file to object storage."""
    try:
        ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
        path = f"{APP_NAME}/uploads/{uuid.uuid4()}.{ext}"
        data = await file.read()
        result = put_object(path, data, file.content_type or "application/octet-stream")
        
        return {
            "path": result["path"],
            "url": f"/api/storage/files/{result['path']}"
        }
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/storage/files/{path:path}")
async def get_file(path: str):
    """Serve file from object storage."""
    try:
        data, content_type = get_object(path)
        return Response(content=data, media_type=content_type)
    except Exception as e:
        logger.error(f"File retrieval failed: {e}")
        raise HTTPException(status_code=404, detail="File not found")

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage initialization failed: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)