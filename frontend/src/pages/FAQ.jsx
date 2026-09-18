import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQ() {
  const faqs = [
    {
      question: 'What are your delivery areas?',
      answer: 'We currently deliver to Pietermaritzburg and surrounding areas within a 15km radius. Delivery fees are calculated based on distance at checkout.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Our standard delivery time is 30-45 minutes from order confirmation. During peak hours, it may take up to 60 minutes.'
    },
    {
      question: 'Do you offer vegetarian options?',
      answer: 'Yes! We have several vegetarian dishes including Daal Fry, Chana Masala, Pap & Chakalaka, and various bread options. Look for the vegetarian label on our menu.'
    },
    {
      question: 'Can I customize my order?',
      answer: 'Absolutely! You can add special instructions in the notes section during checkout. We\'ll do our best to accommodate your preferences.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards through our secure Stripe payment system.'
    },
    {
      question: 'Do you cater for events?',
      answer: 'Yes, we offer catering services for events. Please contact us directly at hello@zaiqa.restaurant or call +27 123 456 789 to discuss your requirements.'
    },
    {
      question: 'How spicy are your dishes?',
      answer: 'Our dishes range from mild to spicy. Each dish description indicates the spice level. You can also request adjustments when ordering.'
    },
    {
      question: 'Can I save my favorite orders?',
      answer: 'Yes! Create an account to save your favorite dishes and entire orders for quick reordering in the future.'
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Orders can be cancelled within 5 minutes of placing. After that, please contact us directly and we\'ll do our best to help.'
    },
    {
      question: 'Do you have halal certification?',
      answer: 'Yes, all our meat is halal certified. We take pride in serving authentic halal Pakistani cuisine.'
    }
  ];

  return (
    <div className="min-h-screen bg-bone py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-light text-text-main mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-text-muted">
            Find answers to common questions about ZAIQA
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-surface border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium text-text-main hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-text-muted">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-surface border border-border rounded-xl p-8">
          <h2 className="text-2xl font-serif font-semibold text-text-main mb-2">
            Still have questions?
          </h2>
          <p className="text-text-muted mb-6">
            We're here to help! Reach out to us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+27123456789"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
            >
              Call Us: +27 123 456 789
            </a>
            <a
              href="mailto:hello@zaiqa.restaurant"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}