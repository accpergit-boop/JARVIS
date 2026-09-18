import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HOME } from '@/constants/testIds';

export default function Home() {
  const categories = [
    {
      name: 'Signature Biryani',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=600&fit=crop',
      description: 'Aromatic rice dishes'
    },
    {
      name: 'BBQ & Grill',
      image: 'https://images.unsplash.com/photo-1512719724284-dbb9ef47eac5?w=600&h=600&fit=crop',
      description: 'Smoky perfection'
    },
    {
      name: 'South African Fusion',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=600&fit=crop',
      description: 'Best of both worlds'
    }
  ];

  const features = [
    { icon: Clock, title: 'Fast Delivery', description: 'Hot food delivered in 30-45 minutes' },
    { icon: Star, title: 'Quality Ingredients', description: 'Fresh, authentic spices and ingredients' },
    { icon: MapPin, title: 'Convenient Pickup', description: 'Order ahead and collect at your convenience' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        data-testid={HOME.heroSection}
        className="relative bg-gradient-to-br from-surface via-bone to-surface py-24 lg:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,75,49,0.3),transparent_50%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-text-main tracking-tight mb-4">
                  Where Pakistani Tradition <span className="text-primary">Meets</span> South African Flavour
                </h1>
                <p className="text-lg text-text-muted max-w-xl">
                  Experience the rich heritage of Pakistani cuisine blended with beloved South African flavours. From authentic Biryani to Bunny Chow, discover a fusion that delights.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  data-testid={HOME.orderNowBtn}
                  className="bg-primary hover:bg-primary-hover text-white text-base h-12 px-8"
                >
                  <Link to="/menu">
                    Order Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  data-testid={HOME.viewMenuBtn}
                  className="border-primary text-primary hover:bg-primary/5 text-base h-12 px-8"
                >
                  <Link to="/menu">View Menu</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=600&fit=crop"
                alt="Delicious biryani"
                className="rounded-xl shadow-ambient-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 lg:py-24 bg-bone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-text-main mb-4">
              Explore Our Cuisine
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              From traditional Pakistani dishes to South African favorites, every plate tells a story
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-border hover:shadow-ambient-lg transition-all duration-300 cursor-pointer"
                onClick={() => window.location.href = '/menu'}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-serif font-semibold text-text-main mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-text-muted">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-text-main mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-white mb-4">
            Ready to Experience ZAIQA?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Order now and taste the perfect blend of Pakistani and South African cuisine
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-base h-12 px-8"
          >
            <Link to="/menu">Start Your Order</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}