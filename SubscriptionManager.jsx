import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, Star, Zap, Building, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { handleCheckout, PLAN_PRICE_IDS } from '@/lib/stripe';
import { useNavigate } from 'react-router-dom';

const allFeatures = [
    'Core Accounting & Budgeting',
    'Donation Management',
    'Advanced Reporting & Analytics',
    'Project Management',
    'HR & Payroll',
    'Supply Chain Management',
    'Custom Integrations',
    'Dedicated Support',
];

const plans = [
  {
    name: 'Starter',
    lookup_key: 'starter',
    prices: { monthly: '$39', yearly: '$390' },
    description: 'For small teams getting started.',
    features: [
      ...allFeatures.slice(0, 4),
      'Up to 5 Users',
      '14-day free trial',
    ],
    icon: Star,
    color: 'text-blue-500',
  },
  {
    name: 'Growth',
    lookup_key: 'growth',
    prices: { monthly: '$49', yearly: '$490' },
    description: 'For growing organizations.',
    features: [
      ...allFeatures.slice(0, 6),
      'Up to 10 Users',
      '14-day free trial',
    ],
    icon: Zap,
    color: 'text-purple-500',
    isPopular: true,
  },
  {
    name: 'Scale',
    lookup_key: 'scale',
    prices: { monthly: '$99', yearly: '$990' },
    description: 'For large-scale operations.',
    features: [
      ...allFeatures,
      'Unlimited Users',
      '14-day free trial',
    ],
    icon: Building,
    color: 'text-gray-800',
  },
];

const PlanCard = ({ plan, currentPlan, onSelectPlan, billingCycle, isLoading, selectedPlan }) => {
  const isCurrent = plan.lookup_key === currentPlan;
  const isSelected = plan.lookup_key === selectedPlan;
  
  return (
    <Card className={cn(
      "flex flex-col transition-all duration-300 relative",
      plan.isPopular && "border-primary border-2 shadow-lg",
      isCurrent && "ring-2 ring-green-500 ring-offset-2"
    )}>
      {plan.isPopular && (
        <Badge variant="default" className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 font-semibold">
          Most Popular
        </Badge>
      )}
      <CardHeader className="pt-12">
        <div className="flex items-center gap-4 mb-2">
          <plan.icon className={cn("w-8 h-8", plan.color)} />
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-4xl font-bold mb-6">
          {plan.prices[billingCycle]}
          <span className="text-lg font-normal text-gray-500">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
        </p>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onSelectPlan(plan)}
          variant={isCurrent ? 'secondary' : (plan.isPopular ? 'default' : 'outline')}
          className="w-full"
          disabled={isCurrent || isLoading}
        >
          {isLoading && isSelected ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading && isSelected ? 'Processing...' : (isCurrent ? 'Current Plan' : 'Select Plan')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function SubscriptionManager({ currentPlan, activeOrgId, user, onPlanChange }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan.lookup_key);
    
    if (!user) {
      navigate(`/signup?plan=${plan.lookup_key}&cycle=${billingCycle}`);
      return;
    }
    
    setIsLoading(true);

    const priceId = PLAN_PRICE_IDS[plan.lookup_key][billingCycle];

    const { error } = await handleCheckout(priceId, user.id, activeOrgId, user.email);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Checkout Error',
        description: error.message || 'An unexpected error occurred.',
      });
      setIsLoading(false);
      setSelectedPlan(null);
    } else {
      if (onPlanChange) {
        onPlanChange();
      }
    }
  };

  return (
    <div className="space-y-12 py-8">
      <div className="flex justify-center items-center space-x-4 mb-12">
        <Label htmlFor="billing-cycle" className={cn("font-medium", billingCycle === 'monthly' ? 'text-primary' : 'text-gray-500')}>
          Monthly
        </Label>
        <Switch
          id="billing-cycle"
          checked={billingCycle === 'yearly'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
          disabled={isLoading}
        />
        <Label htmlFor="billing-cycle" className={cn("font-medium", billingCycle === 'yearly' ? 'text-primary' : 'text-gray-500')}>
          Annually
        </Label>
        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">Save 15%</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {plans.map(plan => (
          <PlanCard 
            key={plan.name} 
            plan={plan} 
            currentPlan={currentPlan}
            onSelectPlan={handleSelectPlan}
            billingCycle={billingCycle}
            isLoading={isLoading}
            selectedPlan={selectedPlan}
          />
        ))}
      </div>
       <div className="text-center">
            <Button variant="link" onClick={() => navigate('/signup')}>
                Or start a 14-day free trial
            </Button>
        </div>
      <div className="text-center text-sm text-gray-500">
        <p>Need help? <a href="/contact" className="text-primary font-medium hover:underline">Contact our support team</a>.</p>
      </div>
    </div>
  );
}