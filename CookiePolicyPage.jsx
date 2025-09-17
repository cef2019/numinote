import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Cookie } from 'lucide-react';

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
            <Cookie className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900">{title}</h1>
            <p className="mt-2 text-gray-500">Last updated and effective: {lastUpdated}</p>
          </div>
          <div className="prose prose-lg max-w-none">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  </>
);

const CookiePolicyPage = () => (
  <PolicyPage title="Cookie Policy" lastUpdated="August 25, 2025">
    <h2>1. What Are Cookies?</h2>
    <p>Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit certain websites. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
    
    <h2>2. How We Use Cookies</h2>
    <p>At Numinote, we believe in privacy by design. We use cookies only when they are essential for the functioning of our Service. We do not use cookies for advertising, tracking, or analytics purposes.</p>
    
    <h3>2.1. Strictly Necessary Cookies</h3>
    <p>These cookies are essential for you to browse the Service and use its features, such as accessing secure areas of the site. Without these cookies, services like user authentication and session management cannot be provided. We use cookies for:</p>
    <ul>
      <li><strong>Authentication:</strong> To identify you when you log in to our Service and to keep you logged in.</li>
      <li><strong>Security:</strong> To support our security features and to help us detect malicious activity.</li>
      <li><strong>Session State:</strong> To remember your current session and maintain the state of your application as you navigate.</li>
    </ul>

    <h2>3. Your Choices Regarding Cookies</h2>
    <p>Because we only use strictly necessary cookies, we do not provide an option to opt out of them, as our Service will not function correctly without them. However, you have the ability to control cookies through your web browser settings.</p>
    <p>You can use your browser settings to block or delete cookies from Numinote and other websites. Please note that if you set your browser to block all cookies (including essential cookies), you may not be able to access all or parts of our Service.</p>
    <p>To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.</p>

    <h2>4. Changes to This Cookie Policy</h2>
    <p>We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date at the top.</p>
  </PolicyPage>
);

export default CookiePolicyPage;