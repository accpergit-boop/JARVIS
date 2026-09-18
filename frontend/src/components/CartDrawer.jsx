import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { CART } from '@/constants/testIds';

export default function CartDrawer({ open, onClose }) {
  const { items, updateQuantity, removeFromCart, getTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent data-testid={CART.drawer} className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serif">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag className="h-16 w-16 text-text-muted/50 mb-4" />
            <p className="text-lg font-medium text-text-muted">Your cart is empty</p>
            <p className="text-sm text-text-muted/70 mt-2">Add some delicious items to get started</p>
            <Button
              onClick={() => {
                onClose();
                navigate('/menu');
              }}
              className="mt-6 bg-primary hover:bg-primary-hover"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="flex gap-4 bg-surface p-3 rounded-lg">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-text-main line-clamp-1">{item.name}</h4>
                    <p className="text-sm text-primary font-semibold mt-1">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-1 rounded hover:bg-surface-hover transition-colors"
                      >
                        <Minus className="h-4 w-4 text-text-muted" />
                      </button>
                      <span
                        data-testid={CART.itemQuantity}
                        className="w-8 text-center font-medium text-text-main"
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-1 rounded hover:bg-surface-hover transition-colors"
                      >
                        <Plus className="h-4 w-4 text-text-muted" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    data-testid={CART.removeBtn}
                    className="p-2 h-fit rounded hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>

            <Separator />

            {/* Total and Checkout */}
            <div className="py-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-text-main">Subtotal</span>
                <span data-testid={CART.subtotal} className="text-2xl font-bold text-primary">
                  {formatPrice(getTotal())}
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Delivery fees and discounts will be calculated at checkout
              </p>
              <Button
                onClick={handleCheckout}
                data-testid={CART.checkoutBtn}
                className="w-full bg-primary hover:bg-primary-hover text-white h-12 text-base"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}