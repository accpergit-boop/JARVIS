import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Truck, Package, CreditCard, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { CHECKOUT } from '@/constants/testIds';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState('delivery');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [address, setAddress] = useState({
    street: '',
    city: 'Pietermaritzburg',
    postal_code: '',
    phone: ''
  });

  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/menu');
    }
  }, [items, navigate]);

  useEffect(() => {
    if (deliveryType === 'delivery' && address.postal_code) {
      calculateDeliveryFee();
    } else {
      setDeliveryFee(0);
    }
  }, [deliveryType, address.postal_code]);

  const calculateDeliveryFee = async () => {
    try {
      const response = await axios.post(`${API}/delivery/calculate`, {
        postal_code: address.postal_code
      });
      setDeliveryFee(response.data.delivery_fee);
    } catch (error) {
      console.error('Failed to calculate delivery fee:', error);
    }
  };

  const applyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }
    // Discount will be applied on backend
    toast.success('Discount code will be applied');
  };

  const handleCheckout = async () => {
    if (deliveryType === 'delivery') {
      if (!address.street || !address.city || !address.postal_code || !address.phone) {
        toast.error('Please fill in all delivery address fields');
        return;
      }
    }

    if (!isAuthenticated) {
      if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
        toast.error('Please fill in your contact information');
        return;
      }
    }

    setLoading(true);

    try {
      // Create order
      const orderData = {
        items: items.map(item => ({
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        delivery_type: deliveryType,
        delivery_address: deliveryType === 'delivery' ? address : null,
        discount_code: discountCode || null,
        notes: notes || null,
        guest_name: !isAuthenticated ? guestInfo.name : null,
        guest_email: !isAuthenticated ? guestInfo.email : null,
        guest_phone: !isAuthenticated ? guestInfo.phone : null
      };

      const orderResponse = await axios.post(`${API}/orders`, orderData, {
        withCredentials: true
      });

      const order = orderResponse.data;

      // Create Stripe checkout session
      const checkoutResponse = await axios.post(
        `${API}/payments/checkout`,
        {
          order_id: order.order_id,
          origin_url: window.location.origin
        },
        { withCredentials: true }
      );

      // Redirect to Stripe
      window.location.href = checkoutResponse.data.checkout_url;
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  const subtotal = getTotal();
  const total = subtotal + deliveryFee - discountAmount;

  return (
    <div className="min-h-screen bg-bone py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-light text-text-main mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Info */}
            {!isAuthenticated && (
              <Card className="border-border">
                <CardContent className="p-6">
                  <h2 className="text-xl font-serif font-semibold text-text-main mb-4">
                    Your Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        value={guestInfo.name}
                        onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                        className="mt-1 border-border"
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                        className="mt-1 border-border"
                      />
                    </div>
                    <div>
                      <Label>Phone *</Label>
                      <Input
                        type="tel"
                        value={guestInfo.phone}
                        onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                        className="mt-1 border-border"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delivery Type */}
            <Card className="border-border" data-testid={CHECKOUT.form}>
              <CardContent className="p-6">
                <h2 className="text-xl font-serif font-semibold text-text-main mb-4">
                  Delivery Method
                </h2>
                <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border cursor-pointer hover:bg-surface">
                    <RadioGroupItem value="delivery" id="delivery" data-testid={CHECKOUT.deliveryTypeRadio} />
                    <Label htmlFor="delivery" className="flex items-center cursor-pointer flex-1">
                      <Truck className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <div className="font-medium">Delivery</div>
                        <div className="text-sm text-text-muted">30-45 minutes</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border cursor-pointer hover:bg-surface mt-3">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex items-center cursor-pointer flex-1">
                      <Package className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <div className="font-medium">Pickup</div>
                        <div className="text-sm text-text-muted">Ready in 20-30 minutes</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            {deliveryType === 'delivery' && (
              <Card className="border-border">
                <CardContent className="p-6">
                  <h2 className="text-xl font-serif font-semibold text-text-main mb-4">
                    Delivery Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Street Address *</Label>
                      <Input
                        data-testid={CHECKOUT.addressInput}
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="mt-1 border-border"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>City *</Label>
                        <Input
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="mt-1 border-border"
                        />
                      </div>
                      <div>
                        <Label>Postal Code *</Label>
                        <Input
                          value={address.postal_code}
                          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                          className="mt-1 border-border"
                          placeholder="3200"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Phone *</Label>
                      <Input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="mt-1 border-border"
                        placeholder="+27 123 456 789"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card className="border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-serif font-semibold text-text-main mb-4">
                  Order Notes (Optional)
                </h2>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for your order..."
                  rows={3}
                  className="border-border"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-border">
                <CardContent className="p-6">
                  <h2 className="text-xl font-serif font-semibold text-text-main mb-4">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.product_id} className="flex justify-between text-sm">
                        <span className="text-text-muted">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-text-main font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Discount Code */}
                  <div className="mb-4">
                    <Label className="text-sm">Discount Code</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        data-testid={CHECKOUT.discountInput}
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        placeholder="WELCOME10"
                        className="border-border"
                      />
                      <Button
                        variant="outline"
                        onClick={applyDiscount}
                        data-testid={CHECKOUT.applyDiscountBtn}
                        className="border-primary text-primary hover:bg-primary/5"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Subtotal</span>
                      <span className="text-text-main">{formatPrice(subtotal)}</span>
                    </div>
                    {deliveryType === 'delivery' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Delivery Fee</span>
                        <span className="text-text-main">{formatPrice(deliveryFee)}</span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="font-semibold text-text-main">Total</span>
                      <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={loading || items.length === 0}
                    data-testid={CHECKOUT.payBtn}
                    className="w-full mt-6 bg-primary hover:bg-primary-hover text-white h-12"
                  >
                    {loading ? (
                      'Processing...'
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-text-muted text-center mt-4">
                    Secure payment powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}