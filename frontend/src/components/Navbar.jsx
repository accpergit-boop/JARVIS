import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NAVBAR } from '@/constants/testIds';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getItemCount } = useCart();
  const { user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const itemCount = getItemCount();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu', testId: NAVBAR.menuLink },
    { to: '/about', label: 'About', testId: NAVBAR.aboutLink },
    { to: '/contact', label: 'Contact', testId: NAVBAR.contactLink },
    { to: '/offers', label: 'Offers' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-bone/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              data-testid={NAVBAR.logo}
              className="flex items-center space-x-2 group"
            >
              <div className="text-2xl font-serif font-bold text-primary tracking-tight transition-colors group-hover:text-primary-hover">
                ZAIQA
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-testid={link.testId}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'text-primary bg-surface'
                      : 'text-text-muted hover:text-text-main hover:bg-surface'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Cart Button */}
              <button
                data-testid={NAVBAR.cartBtn}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-surface transition-colors"
              >
                <ShoppingCart className="h-5 w-5 text-text-main" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </button>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/account')}
                    data-testid={NAVBAR.accountBtn}
                    className="text-text-main hover:text-primary hover:bg-surface"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    data-testid={NAVBAR.logoutBtn}
                    className="text-text-muted hover:text-primary hover:bg-surface"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  data-testid={NAVBAR.loginBtn}
                  className="hidden md:flex bg-primary hover:bg-primary-hover text-white"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-text-main" />
                ) : (
                  <Menu className="h-6 w-6 text-text-main" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-border">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'text-primary bg-surface'
                      : 'text-text-muted hover:text-text-main hover:bg-surface'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border space-y-2">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/account');
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-surface transition-colors"
                    >
                      <User className="h-4 w-4 inline mr-2" />
                      Account
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-surface transition-colors"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      login();
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}