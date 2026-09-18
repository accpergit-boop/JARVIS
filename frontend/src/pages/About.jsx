import React from 'react';
import { Heart, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-bone py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-light text-text-main mb-4">
            About ZAIQA
          </h1>
          <p className="text-lg text-text-muted">
            A story of tradition, fusion, and flavour
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-12 rounded-xl overflow-hidden shadow-ambient-lg">
          <img
            src="https://images.pexels.com/photos/10633476/pexels-photo-10633476.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt="Restaurant interior"
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Story */}
        <div className="prose prose-lg max-w-none mb-16">
          <p className="text-text-muted leading-relaxed mb-4">
            Welcome to ZAIQA, where the rich culinary heritage of Pakistan meets the vibrant flavours of South Africa. Our name, meaning "taste" or "flavour" in Urdu, embodies our commitment to delivering authentic, memorable dining experiences.
          </p>
          <p className="text-text-muted leading-relaxed mb-4">
            Founded in the heart of Pietermaritzburg, ZAIQA was born from a passion to bridge two incredible food cultures. We celebrate the aromatic spices of Pakistani cuisine while embracing the bold, diverse flavours that make South African food so special.
          </p>
          <p className="text-text-muted leading-relaxed">
            Every dish we serve tells a story – from our signature biryanis passed down through generations to our innovative fusion creations like the beloved Bunny Chow with a Pakistani twist. We source the finest ingredients, use traditional cooking methods, and infuse every meal with love and authenticity.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-text-main mb-2">Authenticity</h3>
            <p className="text-text-muted">
              Traditional recipes and techniques passed down through generations
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-text-main mb-2">Community</h3>
            <p className="text-text-muted">
              Bringing people together through the universal language of food
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-text-main mb-2">Quality</h3>
            <p className="text-text-muted">
              Only the finest ingredients and most careful preparation
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-surface rounded-xl p-8 border border-border">
          <h2 className="text-2xl font-serif font-semibold text-text-main mb-4 text-center">
            Our Mission
          </h2>
          <p className="text-text-muted text-center leading-relaxed">
            To create a dining experience that honours Pakistani culinary traditions while celebrating the vibrant, multicultural spirit of South Africa. We strive to be more than just a restaurant – we're a place where cultures meet, stories are shared, and memories are made over exceptional food.
          </p>
        </div>
      </div>
    </div>
  );
}