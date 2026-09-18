import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Package, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: Package,
  ready: CheckCircle,
  delivered: CheckCircle,
  cancelled: XCircle
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders`, {
        withCredentials: true
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/account" className="text-sm text-primary hover:underline mb-2 inline-block">
            ← Back to Account
          </Link>
          <h1 className="text-4xl font-serif font-light text-text-main mb-2">My Orders</h1>
          <p className="text-text-muted">View and track your order history</p>
        </div>

        {orders.length === 0 ? (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-text-muted/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-main mb-2">No orders yet</h3>
              <p className="text-text-muted mb-6">Start ordering delicious food from ZAIQA!</p>
              <Link
                to="/menu"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
              >
                Browse Menu
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status] || Clock;
              return (
                <Card key={order.order_id} className="border-border hover:shadow-ambient transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-text-main">
                            Order #{order.order_id.substring(6, 14).toUpperCase()}
                          </h3>
                          <Badge className={statusColors[order.status]}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-muted mb-2">
                          {formatDate(order.created_at)}
                        </p>
                        <p className="text-sm text-text-muted">
                          {order.items.length} item(s) • {order.delivery_type === 'delivery' ? 'Delivery' : 'Pickup'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-text-muted mb-1">Total</p>
                          <p className="text-2xl font-bold text-primary">{formatPrice(order.total)}</p>
                        </div>
                        <Link
                          to={`/account/orders/${order.order_id}`}
                          className="px-4 py-2 border-2 border-primary text-primary hover:bg-primary/5 rounded-lg transition-colors whitespace-nowrap"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}