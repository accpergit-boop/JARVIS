import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import { Link } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Favorites() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API}/favorites/products`, {
        withCredentials: true
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
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
          <h1 className="text-4xl font-serif font-light text-text-main mb-2">My Favorites</h1>
          <p className="text-text-muted">Your favorite dishes in one place</p>
        </div>

        {products.length === 0 ? (
          <Card className="border-border p-12 text-center">
            <Heart className="h-16 w-16 text-text-muted/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-main mb-2">No favorites yet</h3>
            <p className="text-text-muted mb-6">Add dishes to your favorites from the menu</p>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
            >
              Browse Menu
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}