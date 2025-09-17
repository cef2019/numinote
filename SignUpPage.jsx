import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import SEO from '@/components/SEO';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { PLAN_PRICE_IDS, handleCheckout } from '@/lib/stripe';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { user, signup, authLoading, setAuthLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [plan, setPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isTrial, setIsTrial] = useState(true);
  const [priceId, setPriceId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planName = params.get('plan');
    const cycle = params.get('cycle') || 'monthly';
    
    if (planName && PLAN_PRICE_IDS[planName]) {
      setPlan(planName);
      setBillingCycle(cycle);
      setIsTrial(false);
      setPriceId(PLAN_PRICE_IDS[planName][cycle]);
    } else {
      setIsTrial(true);
    }
  }, [location.search]);
  
  // Effect to handle checkout once the user is logged in
  useEffect(() => {
    const initiateCheckout = async () => {
        if (user && !isTrial && priceId) {
            setAuthLoading(true);
            const { error: checkoutError } = await handleCheckout(priceId, user.id, 'new_org', user.email);
            if (checkoutError) {
                toast({
                    variant: 'destructive',
                    title: 'Checkout Error',
                    description: checkoutError.message,
                });
            }
            // setAuthLoading will be managed by the auth context or here if checkout fails
            setAuthLoading(false);
        }
    };
    initiateCheckout();
  }, [user, isTrial, priceId, setAuthLoading, toast]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !organizationName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out your full name and organization name.",
      });
      return;
    }
    
    setAuthLoading(true);

    const { data, error } = await signup(email, password, {
      data: {
        full_name: fullName,
        organization_name: organizationName,
        is_trial: isTrial,
      },
    });

    if (error) {
        setAuthLoading(false);
        return;
    }

    if (data.user) {
        toast({
            title: 'Account Almost Ready!',
            description: "We've sent a confirmation link to your email. Please verify it to continue.",
            variant: 'success',
        });
        // For paid plans, we now wait for the user to verify and log in.
        // For trial, we can redirect to login immediately.
        if (isTrial) {
            navigate('/login');
        }
    } else {
        toast({
            variant: "destructive",
            title: "Sign Up Failed",
            description: "Could not create user. Please try again.",
        });
    }
    setAuthLoading(false);
  };

  const pageTitle = isTrial ? "Start Your Free Trial" : `Sign Up for ${plan?.charAt(0).toUpperCase() + plan?.slice(1)} Plan`;
  const pageDescription = isTrial ? "No credit card required. Start streamlining your nonprofit's operations today." : "Complete your registration to get started.";

  return (
    <>
      <SEO
        title={`${pageTitle} - Numinote`}
        description={pageDescription}
      />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-block">
              <img className="h-10 w-auto mx-auto" alt="Numinote Logo" src="/logo.svg" />
            </Link>
            <h1 className="mt-6 text-3xl font-extrabold text-gray-900">{pageTitle}</h1>
            <p className="mt-2 text-sm text-gray-600">{pageDescription}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Jane Doe"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="organization-name">Organization Name</Label>
                <Input
                  id="organization-name"
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                  placeholder="Your Nonprofit Inc."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="jane.doe@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {authLoading ? (isTrial ? 'Creating Account...' : 'Processing...') : (isTrial ? 'Start Free Trial' : 'Continue to Payment')}
                  {!authLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Log In
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}