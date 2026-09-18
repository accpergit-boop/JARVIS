import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Percent, Calendar } from 'lucide-react';

export default function Offers() {
  const offers = [
    {
      id: 1,
      title: 'Welcome Offer',
      description: 'Get 10% off your first order above R100',
      code: 'WELCOME10',
      icon: Gift,
      color: 'bg-primary',
      validUntil: '31 Dec 2026'
    },
    {
      id: 2,
      title: 'Weekend Special',
      description: 'Free delivery on orders above R200 every weekend',
      code: 'WEEKEND',
      icon: Percent,
      color: 'bg-green-600',
      validUntil: 'Every Sat-Sun'
    },
    {
      id: 3,
      title: 'Biryani Bonanza',
      description: 'Buy 2 Biryani dishes, get 1 free drink',
      code: 'BIRYANI2',
      icon: Calendar,
      color: 'bg-blue-600',
      validUntil: 'Limited time'
    }
  ];

  return (
    <div className="min-h-screen bg-bone py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-light text-text-main mb-4">
            Special Offers
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Save more on your favorite dishes with our exclusive deals
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {offers.map((offer) => {
            const Icon = offer.icon;
            return (
              <Card key={offer.id} className="border-border hover:shadow-ambient-lg transition-all">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${offer.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-text-main mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-text-muted mb-4">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-surface text-primary hover:bg-surface font-mono text-base px-3 py-1">
                      {offer.code}
                    </Badge>
                    <span className="text-xs text-text-muted">{offer.validUntil}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How to Use */}
        <div className="max-w-3xl mx-auto bg-surface border border-border rounded-xl p-8">
          <h2 className="text-2xl font-serif font-semibold text-text-main mb-6 text-center">
            How to Use Promo Codes
          </h2>
          <ol className="space-y-4 text-text-muted">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                1
              </span>
              <span>Add items to your cart and proceed to checkout</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                2
              </span>
              <span>Enter the promo code in the discount code field</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                3
              </span>
              <span>Click "Apply" to see your discount reflected in the total</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                4
              </span>
              <span>Complete your order and enjoy the savings!</span>
            </li>
          </ol>
          <p className="mt-6 text-sm text-text-muted italic text-center">
            * Terms and conditions apply. Offers cannot be combined unless stated otherwise.
          </p>
        </div>
      </div>
    </div>
  );
}