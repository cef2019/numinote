import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PolicyPage = ({ title, lastUpdated, children }) => (
  <>
    <Helmet>
      <title>{title} | Numinote</title>
      <meta name="description" content={`Read the ${title} for Numinote, effective ${lastUpdated}.`} />
    </Helmet>
    <div className="bg-white py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <Shield className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900">{title}</h1>
            <p className="mt-2 text-gray-500">Last updated and effective: {lastUpdated}</p>
          </div>
          <div className="prose prose-lg max-w-none prose-a:text-primary hover:prose-a:underline">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  </>
);

const PrivacyPolicyPage = () => (
  <PolicyPage title="Privacy Policy" lastUpdated="August 25, 2025">
    <h2>1. Introduction</h2>
    <p>Welcome to Numinote ("we," "us," or "our"). We are committed to protecting the privacy of our users ("you"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our software-as-a-service platform (the "Service"). Please read this policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.</p>
    
    <h2>2. Information We Collect</h2>
    <p>We collect information that you provide directly to us, information we collect automatically when you use our Service, and information we obtain from third-party sources.</p>
    
    <h3>2.1. Information You Provide to Us</h3>
    <ul>
      <li><strong>Account Information:</strong> When you register for an account, we collect your name, email address, password, and organization name.</li>
      <li><strong>Organizational Data:</strong> You and your users may upload or input data into the Service, including but not limited to financial records (transactions, invoices, bills, budgets), project details, employee information, donor information, and other organizational data ("Customer Data"). You are the controller of this data.</li>
      <li><strong>Payment Information:</strong> If you subscribe to a paid plan, our third-party payment processor (e.g., Stripe) will collect your payment card information. We do not store this information on our servers.</li>
      <li><strong>Communications:</strong> If you contact us directly, we may receive additional information about you such as your name, email address, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</li>
    </ul>

    <h3>2.2. Information We Collect Automatically</h3>
    <ul>
      <li><strong>Log and Usage Data:</strong> We collect log data about how you use our Service, such as your IP address, browser type, operating system, pages visited, and the dates/times of your visits. This helps us diagnose problems and improve our Service.</li>
      <li><strong>Cookies:</strong> We use essential cookies to operate and secure our Service. For more details, please see our <Link to="/cookie-policy">Cookie Policy</Link>.</li>
    </ul>

    <h2>3. How We Use Your Information</h2>
    <p>We use the information we collect for various purposes, including to:</p>
    <ul>
      <li>Provide, operate, and maintain our Service;</li>
      <li>Process your transactions and manage your subscription;</li>
      <li>Improve, personalize, and expand our Service;</li>
      <li>Understand and analyze how you use our Service;</li>
      <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the Service, and for marketing and promotional purposes (where permitted by law);</li>
      <li>Send you technical notices, updates, security alerts, and support messages;</li>
      <li>Find and prevent fraud.</li>
    </ul>

    <h2>4. How We Share Your Information</h2>
    <p>We do not sell your personal information. We may share information about you in the following circumstances:</p>
    <ul>
      <li><strong>With Service Providers:</strong> We may share your information with third-party vendors and service providers that perform services on our behalf, such as hosting (e.g., Supabase), payment processing (e.g., Stripe), and customer support. These service providers are contractually obligated to protect your data.</li>
      <li><strong>As Required by Law:</strong> We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation, protect and defend our rights or property, or in urgent circumstances to protect the personal safety of our users or the public.</li>
      <li><strong>With Your Consent:</strong> We may share your information with your consent or at your direction. For example, if you invite another user to your organization, we will share necessary information to facilitate that access.</li>
    </ul>

    <h2>5. Data Security</h2>
    <p>We use administrative, technical, and physical security measures to help protect your personal information. We leverage industry-standard services like Supabase for database management and authentication, which includes features like Row Level Security, encryption at rest, and encryption in transit. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>

    <h2>6. Your Data Protection Rights</h2>
    <p>Depending on your location, you may have the following rights regarding your personal information:</p>
    <ul>
      <li>The right to access – You have the right to request copies of your personal data.</li>
      <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
      <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
    </ul>
    <p>To exercise these rights, please contact us at the address below.</p>

    <h2>7. Changes to This Privacy Policy</h2>
    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>

    <h2>8. Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, please contact us via our <Link to="/contact">Contact Page</Link>.</p>
  </PolicyPage>
);

export default PrivacyPolicyPage;