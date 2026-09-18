import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, MapPin, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    city: 'Pietermaritzburg',
    postal_code: '',
    phone: '',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`${API}/addresses`, {
        withCredentials: true
      });
      setAddresses(response.data);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await axios.put(`${API}/addresses/${editingAddress.address_id}`, formData, {
          withCredentials: true
        });
        toast.success('Address updated');
      } else {
        await axios.post(`${API}/addresses`, formData, {
          withCredentials: true
        });
        toast.success('Address added');
      }
      fetchAddresses();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await axios.delete(`${API}/addresses/${addressId}`, {
        withCredentials: true
      });
      toast.success('Address deleted');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const openEditDialog = (address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      street: address.street,
      city: address.city,
      postal_code: address.postal_code,
      phone: address.phone,
      is_default: address.is_default
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingAddress(null);
    setFormData({
      label: '',
      street: '',
      city: 'Pietermaritzburg',
      postal_code: '',
      phone: '',
      is_default: false
    });
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/account" className="text-sm text-primary hover:underline mb-2 inline-block">
              ← Back to Account
            </Link>
            <h1 className="text-4xl font-serif font-light text-text-main mb-2">My Addresses</h1>
            <p className="text-text-muted">Manage your delivery addresses</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-hover text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Label</Label>
                  <Input
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Home, Work, etc."
                    required
                  />
                </div>
                <div>
                  <Label>Street Address</Label>
                  <Input
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Postal Code</Label>
                    <Input
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.is_default}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
                  />
                  <Label>Set as default address</Label>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white">
                  {editingAddress ? 'Update' : 'Add'} Address
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {addresses.length === 0 ? (
          <Card className="border-border p-12 text-center">
            <MapPin className="h-16 w-16 text-text-muted/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-main mb-2">No addresses saved</h3>
            <p className="text-text-muted mb-6">Add an address for faster checkout</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <Card key={address.address_id} className="border-border relative">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-text-main">{address.label}</h3>
                      {address.is_default && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-1 inline-block">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditDialog(address)}
                        className="p-1 hover:bg-surface rounded"
                      >
                        <Edit className="h-4 w-4 text-text-muted" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.address_id)}
                        className="p-1 hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-text-muted space-y-1">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.postal_code}</p>
                    <p>{address.phone}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}