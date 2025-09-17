import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import SubscriptionManager from '@/components/SubscriptionManager';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export default function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Pricing Plans - Numinote"
        description="Choose the perfect plan for your nonprofit. Numinote offers flexible and affordable pricing to help you manage your finances, projects, and operations."
      />
      <div className="bg-gray-50 min-h-screen py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect plan to empower your nonprofit's mission. All features included, scale by users as you grow.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16"
          >
            <SubscriptionManager user={user} navigate={navigate} />
          </motion.div>
        </div>
      </div>
    </>
  );
}