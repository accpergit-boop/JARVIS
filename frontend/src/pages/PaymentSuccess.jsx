import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = React.useState('checking');
  const [orderId, setOrderId] = React.useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      navigate('/');
      return;
    }

    checkPaymentStatus(sessionId);
  }, [searchParams]);

  const checkPaymentStatus = async (sessionId) => {
    try {
      // Poll for payment status
      let attempts = 0;
      const maxAttempts = 10;

      const poll = async () => {
        try {
          const response = await axios.get(`${API}/payments/status/${sessionId}`);
          
          if (response.data.payment_status === 'paid') {
            setStatus('success');
            clearCart();
            toast.success('Payment successful!');
            
            // Get order ID from transaction
            const txResponse = await axios.get(`${API}/payments/status/${sessionId}`);
            if (txResponse.data.order_id) {
              setOrderId(txResponse.data.order_id);
            }
            return;
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 2000);
          } else {
            setStatus('pending');
          }
        } catch (error) {
          console.error('Status check failed:', error);
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 2000);
          } else {
            setStatus('error');
          }
        }
      };

      poll();
    } catch (error) {
      console.error('Payment status check failed:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-bone flex items-center justify-center py-12">
      <div className="max-w-md w-full px-4">
        {status === 'checking' && (
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <Loader className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-serif font-semibold text-text-main mb-2">
                Confirming Payment
              </h2>
              <p className="text-text-muted">Please wait while we verify your payment...</p>
            </CardContent>
          </Card>
        )}

        {status === 'success' && (
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-semibold text-text-main mb-2">
                Order Confirmed!
              </h2>
              <p className="text-text-muted mb-6">
                Thank you for your order. We've sent a confirmation email and will start preparing your food shortly.
              </p>
              <div className="space-y-3">
                {orderId && (
                  <Button
                    onClick={() => navigate(`/account/orders/${orderId}`)}
                    className="w-full bg-primary hover:bg-primary-hover text-white"
                  >
                    Track Order
                  </Button>
                )}
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
        )}

        {status === 'pending' && (
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-serif font-semibold text-text-main mb-2">
                Payment Processing
              </h2>
              <p className="text-text-muted mb-6">
                Your payment is being processed. You'll receive an email confirmation shortly.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-primary hover:bg-primary-hover text-white"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        )}

        {status === 'error' && (
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-serif font-semibold text-text-main mb-2">
                Payment Verification Failed
              </h2>
              <p className="text-text-muted mb-6">
                We couldn't verify your payment. Please contact support if you were charged.
              </p>
              <Button
                onClick={() => navigate('/contact')}
                className="w-full bg-primary hover:bg-primary-hover text-white"
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}