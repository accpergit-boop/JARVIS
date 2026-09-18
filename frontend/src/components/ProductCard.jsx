import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { MENU } from '@/constants/testIds';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <Card
      data-testid={MENU.productCard}
      className="group overflow-hidden border-border hover:shadow-ambient-lg transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden bg-surface">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          {product.is_featured && (
            <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-0">
              Featured
            </Badge>
          )}
          <h3 className="font-serif text-lg font-semibold text-text-main line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-text-muted line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <Button
            size="sm"
            onClick={() => addToCart(product)}
            data-testid={MENU.addToCartBtn}
            className="bg-primary hover:bg-primary-hover text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}