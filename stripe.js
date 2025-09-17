import { loadStripe } from '@stripe/stripe-js';

const PUBLISHABLE_KEY = 'pk_live_51Rzy7gHUyzabHz4RkVRd344GsaxZh9qpQwMLKRUHPaagRX3gJ963sRooaEths6kV6UpUWSc2R9QqT1qSYssGqH1P006hup95g6';

let stripePromise;
export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(PUBLISHABLE_KEY);
    }
    return stripePromise;
};

export const PLAN_PRICE_IDS = {
  starter: {
    monthly: 'price_1S1MrBHUyzabHz4Rf2ngECJ5',
    yearly: 'price_1S1MrBHUyzabHz4RBbF6gsa6',
  },
  growth: {
    monthly: 'price_1S1Mr4HUyzabHz4RQW2Px69t',
    yearly: 'price_1S1Mr4HUyzabHz4RP7V4IfLt',
  },
  scale: {
    monthly: 'price_1S1MqxHUyzabHz4RQpP8KmF0',
    yearly: 'price_1S1MqxHUyzabHz4RWV05Jk0J',
  },
};

export const handleCheckout = async (priceId, userId, orgId, userEmail = null) => {
  if (!priceId) {
    const message = "No plan selected. Please choose a plan to proceed.";
    console.error(message);
    return { error: { message } };
  }
  if (!userId) {
    const message = "Authentication error. Please sign in or create an account.";
    console.error(message);
    return { error: { message } };
  }

  if (!priceId.startsWith('price_')) {
    const message = `Invalid Price ID format. Must start with 'price_'. Received: ${priceId}`;
    console.error(message);
    return { error: { message } };
  }
  
  try {
    const stripe = await getStripe();
    if (!stripe) {
      const message = "Stripe.js has not loaded yet. Please try again in a moment.";
      console.error(message);
      return { error: { message } };
    }
    
    const clientReferenceId = orgId ? `${userId}|${orgId}` : `${userId}|new_org`;

    const result = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/app/dashboard?subscription_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}${orgId && orgId !== 'new_org' ? '/app/settings/billing' : '/pricing'}`,
      customerEmail: userEmail,
      clientReferenceId: clientReferenceId,
    });
    
    if (result.error) {
      console.error("Stripe redirectToCheckout error:", result.error);
      return { error: result.error };
    }
    return { success: true };
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return { error };
  }
};