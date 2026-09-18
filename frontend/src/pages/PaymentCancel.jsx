import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bone flex items-center justify-center py-12">
      <div className="max-w-md w-full px-4">
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-semibold text-text-main mb-2">
              Payment Cancelled
            </h2>
            <p className="text-text-muted mb-6">
              Your payment was cancelled. Your items are still in your cart if you'd like to try again.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary hover:bg-primary-hover text-white"
              >
                Return to Checkout
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/menu')}
                className="w-full border-primary text-primary hover:bg-primary/5"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}