import os
import asyncio
import logging
import resend
from twilio.rest import Client

logger = logging.getLogger(__name__)

# Resend setup
resend.api_key = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "orders@zaiqa.restaurant")

# Twilio setup
twilio_client = None
try:
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    if account_sid and auth_token and not account_sid.endswith("placeholder"):
        twilio_client = Client(account_sid, auth_token)
except Exception as e:
    logger.warning(f"Twilio client initialization failed: {e}")

async def send_order_confirmation_email(order_data: dict):
    """Send order confirmation email to customer."""
    if not resend.api_key or resend.api_key.endswith("placeholder"):
        logger.warning("Resend API key not configured, skipping email")
        return
    
    try:
        customer_email = order_data.get("guest_email") or order_data.get("user_email")
        if not customer_email:
            logger.warning("No customer email found")
            return
        
        items_html = ""
        for item in order_data.get("items", []):
            items_html += f"""
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #E5E5E0;">{item['name']}</td>
                <td style="padding: 8px; border-bottom: 1px solid #E5E5E0; text-align: center;">{item['quantity']}</td>
                <td style="padding: 8px; border-bottom: 1px solid #E5E5E0; text-align: right;">R{item['price']:.2f}</td>
            </tr>
            """
        
        html_content = f"""
        <html>
        <body style="font-family: 'Manrope', Arial, sans-serif; background-color: #F9F9F6; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
                <div style="background: #C84B31; padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-family: 'Cormorant Garamond', serif;">ZAIQA</h1>
                    <p style="color: #F9F9F6; margin: 5px 0 0;">Where Pakistani Tradition Meets South African Flavour</p>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #1A1A1A; font-family: 'Cormorant Garamond', serif;">Order Confirmed!</h2>
                    <p style="color: #4A4A44;">Thank you for your order. We're preparing your delicious meal.</p>
                    
                    <div style="background: #F3F2EE; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0; color: #1A1A1A;"><strong>Order ID:</strong> {order_data['order_id']}</p>
                        <p style="margin: 5px 0; color: #1A1A1A;"><strong>Type:</strong> {order_data['delivery_type'].title()}</p>
                        <p style="margin: 5px 0; color: #1A1A1A;"><strong>Total:</strong> R{order_data['total']:.2f}</p>
                    </div>
                    
                    <h3 style="color: #1A1A1A; font-family: 'Cormorant Garamond', serif;">Order Items</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #F3F2EE;">
                                <th style="padding: 8px; text-align: left;">Item</th>
                                <th style="padding: 8px; text-align: center;">Qty</th>
                                <th style="padding: 8px; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items_html}
                        </tbody>
                    </table>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #4A4A44;">Questions? Contact us at +27 123 456 789</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        params = {
            "from": SENDER_EMAIL,
            "to": [customer_email],
            "subject": f"Order Confirmation #{order_data['order_id'][:8]} - ZAIQA",
            "html": html_content
        }
        
        # Run sync SDK in thread to keep FastAPI non-blocking
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Order confirmation email sent: {result.get('id')}")
    except Exception as e:
        logger.error(f"Failed to send order confirmation email: {e}")

async def send_new_order_sms(order_data: dict):
    """Send SMS notification to restaurant about new order."""
    if not twilio_client:
        logger.warning("Twilio client not configured, skipping SMS")
        return
    
    try:
        restaurant_phone = os.environ.get("RESTAURANT_PHONE")
        twilio_phone = os.environ.get("TWILIO_PHONE_NUMBER")
        
        if not restaurant_phone or not twilio_phone:
            logger.warning("Phone numbers not configured")
            return
        
        message_body = f"""New Order #{order_data['order_id'][:8]}
Type: {order_data['delivery_type'].title()}
Total: R{order_data['total']:.2f}
Items: {len(order_data.get('items', []))}"""
        
        # Run sync SDK in thread
        message = await asyncio.to_thread(
            twilio_client.messages.create,
            body=message_body,
            from_=twilio_phone,
            to=restaurant_phone
        )
        logger.info(f"New order SMS sent: {message.sid}")
    except Exception as e:
        logger.error(f"Failed to send new order SMS: {e}")