import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, MapPin, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ACCOUNT } from '@/constants/testIds';

export default function Account() {
  const { user } = useAuth();

  const menuItems = [
    {
      to: '/account/orders',
      icon: ShoppingBag,
      title: 'My Orders',
      description: 'View and track your orders',
      testId: ACCOUNT.ordersLink
    },
    {
      to: '/account/favorites',
      icon: Heart,
      title: 'Favorites',
      description: 'Your favorite dishes',
      testId: ACCOUNT.favoritesLink
    },
    {
      to: '/account/addresses',
      icon: MapPin,
      title: 'Addresses',
      description: 'Manage delivery addresses',
      testId: ACCOUNT.addressesLink
    },
    {
      to: '/account/profile',
      icon: User,
      title: 'Profile',
      description: 'Update your information'
    }
  ];

  return (
    <div className="min-h-screen bg-bone py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8" data-testid={ACCOUNT.dashboard}>
          <h1 className="text-4xl font-serif font-light text-text-main mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-text-muted">Manage your account and orders</p>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} data-testid={item.testId}>
                <Card className="border-border hover:shadow-ambient-lg transition-all cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-main mb-1">{item.title}</h3>
                    <p className="text-sm text-text-muted">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}