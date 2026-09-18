from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Literal
from datetime import datetime

# Base Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_token: str
    user_id: str
    expires_at: datetime
    created_at: datetime

class Address(BaseModel):
    model_config = ConfigDict(extra="ignore")
    address_id: str
    user_id: str
    label: str
    street: str
    city: str
    postal_code: str
    phone: str
    is_default: bool = False
    created_at: datetime

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    product_id: str
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None
    is_available: bool = True
    is_featured: bool = False
    created_at: datetime

class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int

class DeliveryAddress(BaseModel):
    street: str
    city: str
    postal_code: str
    phone: str

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    order_id: str
    user_id: Optional[str] = None
    guest_email: Optional[EmailStr] = None
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None
    items: List[OrderItem]
    subtotal: float
    delivery_fee: float
    discount_amount: float
    total: float
    delivery_type: Literal["delivery", "pickup"]
    delivery_address: Optional[DeliveryAddress] = None
    status: Literal["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"] = "pending"
    payment_status: Literal["pending", "paid", "failed", "refunded"] = "pending"
    stripe_session_id: Optional[str] = None
    discount_code_used: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class Favorite(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    product_id: str
    created_at: datetime

class FavoriteOrderItem(BaseModel):
    product_id: str
    quantity: int

class FavoriteOrder(BaseModel):
    model_config = ConfigDict(extra="ignore")
    favorite_order_id: str
    user_id: str
    name: str
    items: List[FavoriteOrderItem]
    created_at: datetime

class DiscountCode(BaseModel):
    model_config = ConfigDict(extra="ignore")
    code: str
    discount_type: Literal["percentage", "fixed"]
    discount_value: float
    min_order_amount: float
    max_uses: int
    current_uses: int = 0
    valid_from: datetime
    valid_until: datetime
    is_active: bool = True

# Request/Response Models
class SessionRequest(BaseModel):
    session_id: str

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

class AddressRequest(BaseModel):
    label: str
    street: str
    city: str
    postal_code: str
    phone: str
    is_default: bool = False

class CreateOrderRequest(BaseModel):
    items: List[OrderItem]
    delivery_type: Literal["delivery", "pickup"]
    delivery_address: Optional[DeliveryAddress] = None
    discount_code: Optional[str] = None
    notes: Optional[str] = None
    guest_email: Optional[EmailStr] = None
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None

class CheckoutRequest(BaseModel):
    order_id: str
    origin_url: str

class CalculateDeliveryRequest(BaseModel):
    postal_code: str

class SaveFavoriteOrderRequest(BaseModel):
    name: str
    items: List[FavoriteOrderItem]

class UpdateOrderStatusRequest(BaseModel):
    status: Literal["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"]

class ProductRequest(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None
    is_available: bool = True
    is_featured: bool = False

class DiscountCodeRequest(BaseModel):
    code: str
    discount_type: Literal["percentage", "fixed"]
    discount_value: float
    min_order_amount: float = 0
    max_uses: int
    valid_from: datetime
    valid_until: datetime
    is_active: bool = True