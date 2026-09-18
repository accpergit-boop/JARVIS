import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

MENU_DATA = [
    # Signature Dishes
    {"product_id": "prod_biryani_chicken", "name": "Chicken Biryani", "description": "Aromatic basmati rice layered with tender chicken, fragrant spices, and saffron. A Pakistani classic.", "price": 95.00, "category": "signature_dishes", "is_featured": True},
    {"product_id": "prod_biryani_beef", "name": "Beef Biryani", "description": "Rich and flavorful beef biryani with perfectly cooked rice and aromatic spices.", "price": 110.00, "category": "signature_dishes", "is_featured": True},
    {"product_id": "prod_biryani_mutton", "name": "Mutton Biryani", "description": "Traditional mutton biryani with succulent meat and fragrant long-grain rice.", "price": 120.00, "category": "signature_dishes", "is_featured": True},
    {"product_id": "prod_karahi_chicken", "name": "Chicken Karahi", "description": "Spicy chicken curry cooked in a traditional karahi with tomatoes, ginger, and green chilies.", "price": 85.00, "category": "signature_dishes"},
    {"product_id": "prod_karahi_mutton", "name": "Mutton Karahi", "description": "Tender mutton pieces in a rich, spicy karahi curry with authentic Pakistani flavors.", "price": 105.00, "category": "signature_dishes"},
    {"product_id": "prod_butter_chicken", "name": "Butter Chicken", "description": "Creamy tomato-based curry with tender chicken pieces. A crowd favorite.", "price": 90.00, "category": "signature_dishes", "is_featured": True},
    {"product_id": "prod_nihari_beef", "name": "Beef Nihari", "description": "Slow-cooked beef in a rich, aromatic gravy. A Pakistani breakfast delicacy.", "price": 115.00, "category": "signature_dishes"},
    {"product_id": "prod_handi_chicken", "name": "Chicken Handi", "description": "Creamy chicken curry cooked in traditional handi style with cashews and cream.", "price": 88.00, "category": "signature_dishes"},
    {"product_id": "prod_haleem", "name": "Haleem", "description": "Slow-cooked lentils and meat blended into a rich, hearty stew. Comfort food at its best.", "price": 95.00, "category": "signature_dishes"},
    {"product_id": "prod_pulao_chicken", "name": "Chicken Pulao", "description": "Fragrant rice dish with tender chicken, whole spices, and caramelized onions.", "price": 75.00, "category": "signature_dishes"},
    
    # BBQ & Grill
    {"product_id": "prod_tikka_chicken", "name": "Chicken Tikka", "description": "Marinated chicken chunks grilled to perfection with traditional spices.", "price": 80.00, "category": "bbq_grill", "is_featured": True},
    {"product_id": "prod_tikka_leg", "name": "Chicken Tikka Leg", "description": "Whole chicken leg marinated and grilled with aromatic spices.", "price": 70.00, "category": "bbq_grill"},
    {"product_id": "prod_malai_tikka", "name": "Chicken Malai Tikka", "description": "Creamy, mild chicken tikka marinated in yogurt and cream. Perfectly tender.", "price": 85.00, "category": "bbq_grill"},
    {"product_id": "prod_malai_boti", "name": "Malai Boti", "description": "Succulent beef chunks in a creamy marinade, grilled to perfection.", "price": 95.00, "category": "bbq_grill"},
    {"product_id": "prod_seekh_kebab", "name": "Seekh Kebab", "description": "Minced chicken seasoned with herbs and spices, grilled on skewers.", "price": 65.00, "category": "bbq_grill"},
    {"product_id": "prod_seekh_beef", "name": "Beef Seekh Kebab", "description": "Spiced beef mince kebabs grilled to smoky perfection.", "price": 75.00, "category": "bbq_grill"},
    {"product_id": "prod_lamb_chops", "name": "Lamb Chops", "description": "Tender lamb chops marinated in special spices and char-grilled.", "price": 150.00, "category": "bbq_grill", "is_featured": True},
    
    # Curries
    {"product_id": "prod_korma_chicken", "name": "Chicken Korma", "description": "Mild, creamy curry with tender chicken in a rich yogurt and nut sauce.", "price": 82.00, "category": "curries"},
    {"product_id": "prod_korma_beef", "name": "Beef Korma", "description": "Slow-cooked beef in a fragrant korma sauce with aromatic spices.", "price": 92.00, "category": "curries"},
    {"product_id": "prod_jalfrezi", "name": "Chicken Jalfrezi", "description": "Spicy stir-fried chicken with bell peppers, onions, and tomatoes.", "price": 80.00, "category": "curries"},
    {"product_id": "prod_palak_gosht", "name": "Palak Gosht", "description": "Tender meat cooked with fresh spinach and aromatic spices.", "price": 88.00, "category": "curries"},
    {"product_id": "prod_daal_fry", "name": "Daal Fry", "description": "Lentils tempered with spices, onions, and tomatoes. Comfort in a bowl.", "price": 55.00, "category": "curries"},
    {"product_id": "prod_chana_masala", "name": "Chana Masala", "description": "Chickpeas in a tangy tomato and spice curry. Vegetarian delight.", "price": 60.00, "category": "curries"},
    
    # Fresh Bread
    {"product_id": "prod_naan_plain", "name": "Plain Naan", "description": "Soft, fluffy tandoori bread baked fresh in our clay oven.", "price": 15.00, "category": "bread"},
    {"product_id": "prod_naan_butter", "name": "Butter Naan", "description": "Plain naan brushed with melted butter for extra richness.", "price": 18.00, "category": "bread"},
    {"product_id": "prod_naan_garlic", "name": "Garlic Naan", "description": "Naan topped with fresh garlic and herbs. Absolutely irresistible.", "price": 20.00, "category": "bread"},
    {"product_id": "prod_naan_cheese", "name": "Cheese Naan", "description": "Naan stuffed with melted cheese. A customer favorite.", "price": 25.00, "category": "bread"},
    {"product_id": "prod_roti", "name": "Tandoori Roti", "description": "Whole wheat flatbread baked in the tandoor. Healthy and delicious.", "price": 12.00, "category": "bread"},
    
    # Starters
    {"product_id": "prod_samosa", "name": "Samosa", "description": "Crispy pastry filled with spiced potatoes and peas. Classic street food. (2 pcs)", "price": 25.00, "category": "starters"},
    {"product_id": "prod_pakora", "name": "Pakora", "description": "Mixed vegetable fritters in chickpea batter, deep-fried until golden.", "price": 30.00, "category": "starters"},
    {"product_id": "prod_roll_chicken", "name": "Chicken Roll", "description": "Grilled chicken wrapped in paratha with fresh vegetables and chutney.", "price": 45.00, "category": "starters"},
    {"product_id": "prod_roll_beef", "name": "Beef Roll", "description": "Spiced beef wrapped in warm paratha with onions and mint sauce.", "price": 50.00, "category": "starters"},
    {"product_id": "prod_chaat", "name": "Chaat", "description": "Tangy street food with chickpeas, potatoes, yogurt, and tamarind chutney.", "price": 35.00, "category": "starters"},
    
    # Desserts
    {"product_id": "prod_gulab_jamun", "name": "Gulab Jamun", "description": "Soft milk dumplings soaked in sweet rose-flavored syrup. (3 pcs)", "price": 30.00, "category": "desserts"},
    {"product_id": "prod_kheer", "name": "Kheer", "description": "Creamy rice pudding flavored with cardamom, saffron, and nuts.", "price": 35.00, "category": "desserts"},
    {"product_id": "prod_ras_malai", "name": "Ras Malai", "description": "Soft cheese patties in sweet, creamy milk flavored with cardamom. (2 pcs)", "price": 40.00, "category": "desserts"},
    {"product_id": "prod_kulfi", "name": "Kulfi", "description": "Traditional Pakistani ice cream with pistachios and cardamom.", "price": 32.00, "category": "desserts"},
    
    # Drinks
    {"product_id": "prod_lassi_mango", "name": "Mango Lassi", "description": "Creamy yogurt drink blended with sweet mango. Refreshing and delicious.", "price": 35.00, "category": "drinks"},
    {"product_id": "prod_lassi_sweet", "name": "Sweet Lassi", "description": "Traditional sweetened yogurt drink, cool and refreshing.", "price": 30.00, "category": "drinks"},
    {"product_id": "prod_chai", "name": "Masala Chai", "description": "Aromatic tea brewed with milk and traditional spices.", "price": 20.00, "category": "drinks"},
    {"product_id": "prod_juice", "name": "Fresh Juices", "description": "Freshly squeezed fruit juices. Ask for today's selection.", "price": 28.00, "category": "drinks"},
    {"product_id": "prod_soft_drinks", "name": "Soft Drinks", "description": "Coca-Cola, Fanta, Sprite, or Stoney.", "price": 15.00, "category": "drinks"},
    {"product_id": "prod_water", "name": "Mineral Water", "description": "500ml bottled water.", "price": 10.00, "category": "drinks"},
    {"product_id": "prod_milkshake", "name": "Milkshakes", "description": "Thick and creamy milkshakes. Choose from vanilla, chocolate, or strawberry.", "price": 38.00, "category": "drinks"},
    
    # South African Favourites
    {"product_id": "prod_bunny_chow_chicken", "name": "Bunny Chow (Chicken)", "description": "Hollowed-out bread filled with spicy chicken curry. A Durban classic!", "price": 65.00, "category": "sa_favourites", "is_featured": True},
    {"product_id": "prod_bunny_chow_mutton", "name": "Bunny Chow (Mutton)", "description": "Hollowed-out bread filled with spicy mutton curry. True South African fusion.", "price": 75.00, "category": "sa_favourites", "is_featured": True},
    {"product_id": "prod_braai_chicken", "name": "Braai Chicken", "description": "South African style grilled chicken with peri-peri spices.", "price": 78.00, "category": "sa_favourites"},
    {"product_id": "prod_bbq_ribs", "name": "BBQ Beef Ribs", "description": "Tender beef ribs with sticky BBQ glaze. Fall-off-the-bone goodness.", "price": 135.00, "category": "sa_favourites"},
    {"product_id": "prod_boerewors_pap", "name": "Boerewors with Pap", "description": "Traditional South African sausage served with maize porridge.", "price": 70.00, "category": "sa_favourites"},
    {"product_id": "prod_pap_chakalaka", "name": "Pap & Chakalaka", "description": "Maize porridge with spicy vegetable relish. Vegetarian option.", "price": 45.00, "category": "sa_favourites"},
    {"product_id": "prod_vetkoek", "name": "Vetkoek with Spiced Beef", "description": "Deep-fried dough filled with spiced minced beef. A South African favorite.", "price": 55.00, "category": "sa_favourites"},
]

async def seed_database():
    """Seed the database with initial data."""
    print("Starting database seeding...")
    
    # Seed products
    print("Seeding menu items...")
    for item in MENU_DATA:
        existing = await db.products.find_one({"product_id": item["product_id"]})
        if not existing:
            product_data = {
                **item,
                "image_url": None,
                "is_available": True,
                "is_featured": item.get("is_featured", False),
                "created_at": datetime.now(timezone.utc)
            }
            await db.products.insert_one(product_data)
            print(f"  Added: {item['name']}")
    
    print(f"\nSeeded {len(MENU_DATA)} menu items")
    
    # Seed admin user
    print("\nSeeding admin user...")
    admin_email = "2j2skp87z8@privaterelay.appleid.com"
    existing_admin = await db.admin_users.find_one({"email": admin_email})
    
    if not existing_admin:
        admin_data = {
            "admin_id": f"admin_{os.urandom(6).hex()}",
            "email": admin_email,
            "role": "owner",
            "created_at": datetime.now(timezone.utc)
        }
        await db.admin_users.insert_one(admin_data)
        print(f"  Admin user created: {admin_email}")
    else:
        print(f"  Admin user already exists: {admin_email}")
    
    # Create sample discount code
    print("\nSeeding discount codes...")
    discount_code = "WELCOME10"
    existing_code = await db.discount_codes.find_one({"code": discount_code})
    
    if not existing_code:
        code_data = {
            "code": discount_code,
            "discount_type": "percentage",
            "discount_value": 10.0,
            "min_order_amount": 100.0,
            "max_uses": 100,
            "current_uses": 0,
            "valid_from": datetime.now(timezone.utc),
            "valid_until": datetime(2026, 12, 31, tzinfo=timezone.utc),
            "is_active": True
        }
        await db.discount_codes.insert_one(code_data)
        print(f"  Discount code created: {discount_code} (10% off orders over R100)")
    else:
        print(f"  Discount code already exists: {discount_code}")
    
    print("\n✅ Database seeding completed!")
    print("\nImportant information:")
    print(f"  - Admin email: {admin_email}")
    print(f"  - Total menu items: {len(MENU_DATA)}")
    print(f"  - Welcome discount code: {discount_code}")

if __name__ == "__main__":
    asyncio.run(seed_database())