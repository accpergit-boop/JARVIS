import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to backend
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+27 123 456 789',
      description: 'Mon-Fri 11:00 - 22:00'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'hello@zaiqa.restaurant',
      description: 'We reply within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: 'Pietermaritzburg',
      description: 'KwaZulu-Natal, South Africa'
    },
    {
      icon: Clock,
      title: 'Hours',
      details: 'Mon-Fri: 11:00 - 22:00',
      description: 'Sat-Sun: 12:00 - 23:00'
    }
  ];

  return (
    <div className="min-h-screen bg-bone py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-light text-text-main mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Have a question or special request? We'd love to hear from you
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <Card key={index} className="border-border">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-main mb-1">{info.title}</h3>
                  <p className="text-sm text-text-main mb-1">{info.details}</p>
                  <p className="text-xs text-text-muted">{info.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-border">
            <CardContent className="p-8">
              <h2 className="text-2xl font-serif font-semibold text-text-main mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-border focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-border focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Phone (optional)
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-border focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Message
                  </label>
                  <Textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="border-border focus:ring-primary focus:border-primary"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white h-12"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}