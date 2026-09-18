import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { MENU } from '@/constants/testIds';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/menu/categories`);
      setCategories([{ id: 'all', name: 'All Items', count: 0 }, ...response.data]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async (category = null, searchQuery = '') => {
    try {
      setLoading(true);
      const params = {};
      if (category && category !== 'all') params.category = category;
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get(`${API}/menu/products`, { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchProducts(category, search);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(selectedCategory === 'all' ? null : selectedCategory, search);
  };

  return (
    <div className="min-h-screen bg-bone py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-light text-text-main mb-4">
            Our Menu
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Explore our delicious selection of Pakistani and South African dishes
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
            <Input
              data-testid={MENU.searchInput}
              type="text"
              placeholder="Search for dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 border-border focus:ring-primary focus:border-primary"
            />
          </div>
        </form>

        {/* Categories */}
        <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="mb-12">
          <TabsList className="w-full flex flex-wrap h-auto justify-center gap-2 bg-transparent">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                data-testid={MENU.categoryFilter}
                className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-lg text-text-muted">No products found</p>
          </div>
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