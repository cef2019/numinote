import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Landmark, BarChart2, Users } from 'lucide-react';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
  >
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-6">
      {React.createElement(icon, { className: "h-8 w-8 text-primary" })}
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Numinote - The All-in-One Nonprofit Management System</title>
        <meta name="description" content="Streamline your nonprofit's finances, projects, and operations with Numinote. The intuitive, powerful, and affordable solution for organizations making a difference." />
      </Helmet>
      <div className="overflow-hidden">
        <section className="relative bg-gray-50 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-[100rem] h-[100rem] bg-gradient-to-br from-green-50 via-emerald-50 to-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                Focus on Your Mission,
                <br />
                <span className="gradient-text">Not Your Paperwork.</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
                Numinote is the all-in-one management system designed specifically for nonprofits. Handle your fund accounting, project management, and donor relations with ease, all in one place.
              </p>
              <div className="mt-10 flex justify-center items-center gap-4 flex-wrap">
                <Button asChild size="lg">
                  <Link to="/signup">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Everything Your Nonprofit Needs to Thrive
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                From financial transparency to operational efficiency, we've got you covered.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <FeatureCard
                icon={Landmark}
                title="True Fund Accounting"
                description="Manage restricted and unrestricted funds with a compliant, easy-to-use system built for the unique needs of nonprofits."
                delay={0.1}
              />
              <FeatureCard
                icon={BarChart2}
                title="Insightful Reporting"
                description="Generate comprehensive financial statements, donor reports, and project summaries in seconds to make data-driven decisions."
                delay={0.2}
              />
              <FeatureCard
                icon={Users}
                title="Integrated Management"
                description="Connect your finances, projects, HR, and supply chain in one unified platform, eliminating data silos and saving valuable time."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  Built for Impact, Priced for Accessibility
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  We believe powerful tools should be within reach for every organization, regardless of size. Our transparent pricing grows with you.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Start for free with our generous core plan. No credit card required.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Affordable, predictable pricing that scales as your needs evolve.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Special discounts for registered charities and educational institutions.</span>
                  </li>
                </ul>
                <div className="mt-10">
                  <Button asChild size="lg">
                    <Link to="/pricing">View Pricing Plans</Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-12 lg:mt-0"
              >
                <img  class="rounded-2xl shadow-2xl" alt="A screenshot of the Numinote dashboard showing charts and financial data" src="https://images.unsplash.com/photo-1571677246347-5040036b95cc" />
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;