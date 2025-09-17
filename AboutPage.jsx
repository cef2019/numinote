import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, Lightbulb, Users, CheckCircle } from 'lucide-react';

const FeatureCard = ({ icon, title, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-white p-8 rounded-xl shadow-lg text-center"
  >
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white mx-auto mb-4">
      {React.createElement(icon, { className: "h-8 w-8" })}
    </div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{children}</p>
  </motion.div>
);

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Numinote | Our Mission to Empower Nonprofits</title>
        <meta name="description" content="Learn about Numinote's mission, values, and the team dedicated to providing the best management software for nonprofits." />
        <meta property="og:title" content="About Numinote | Our Mission to Empower Nonprofits" />
        <meta property="og:description" content="Learn about Numinote's mission, values, and the team dedicated to providing the best management software for nonprofits." />
      </Helmet>
      <div className="bg-gray-50">
        <div className="pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-base font-semibold text-primary uppercase tracking-wide">Our Story</p>
              <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                Empowering Those Who Do Good
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
                We started Numinote with a simple belief: the organizations dedicated to solving the world's biggest problems deserve the best tools to help them succeed.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="relative pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img  class="rounded-2xl shadow-2xl w-full h-auto" alt="A diverse team of people collaborating in a modern office" src="https://images.unsplash.com/photo-1637622124152-33adfabcc923" />
            </motion.div>
          </div>
        </div>

        <section className="pb-20 sm:pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Why Numinote?</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              Nonprofits often juggle multiple disconnected tools for finance, project management, HR, and even supply chain. This creates data silos, wastes valuable time, and obscures the true picture of their impact. Numinote was built to solve this.
            </p>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard icon={CheckCircle} title="Unified Platform" delay={0.1}>
                Manage finances, projects, donors, HR, and supply chain all in one place, eliminating the need for multiple subscriptions and complex integrations.
              </FeatureCard>
              <FeatureCard icon={Lightbulb} title="Intuitive by Design" delay={0.2}>
                We believe powerful software doesn't have to be complicated. Our user-friendly interface is designed for everyone, not just tech experts.
              </FeatureCard>
              <FeatureCard icon={Heart} title="Built for Nonprofits" delay={0.3}>
                From fund accounting to donor management, every feature is tailored to the unique challenges and workflows of nonprofit organizations.
              </FeatureCard>
            </div>
          </div>
        </section>

        <section className="pb-20 sm:pb-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Our Mission & Values</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Our mission is to accelerate the impact of nonprofits by providing powerful, intuitive, and affordable technology. We are guided by our core values in everything we do.
                </p>
              </motion.div>
              <div className="mt-12 lg:mt-0 space-y-10">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                      <Heart className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Impact-First</h3>
                    <p className="mt-2 text-base text-gray-600">We prioritize features and decisions that directly help our users create more positive change in the world.</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Radical Simplicity</h3>
                    <p className="mt-2 text-base text-gray-600">Nonprofit work is complex enough. We are obsessed with making our software intuitive and easy to use.</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Community-Driven</h3>
                    <p className="mt-2 text-base text-gray-600">We build Numinote in partnership with our users, constantly listening and adapting to their evolving needs.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;