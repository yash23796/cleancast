import React from 'react';
import { Hero } from '../marketing/Hero';
import { Features } from '../marketing/Features';
import { UseCases } from '../marketing/UseCases';
import { FAQ } from '../marketing/FAQ';
import { CTA } from '../marketing/CTA';
import { Footer } from '../marketing/Footer';
import { Navigation } from '../marketing/Navigation';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      <Hero />
      <Features />
      <UseCases />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

