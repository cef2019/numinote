import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';
const ContactInfoCard = ({
  icon,
  title,
  children
}) => <div className="flex items-start">
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-emerald-500 to-green-600 text-white">
        {React.createElement(icon, {
        className: "h-6 w-6"
      })}
      </div>
    </div>
    <div className="ml-4">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      <div className="mt-2 text-base text-gray-600">{children}</div>
    </div>
  </div>;
const ContactPage = () => {
  const handleSubmit = e => {
    e.preventDefault();
    // Handle form submission logic here
  };
  return <>
      <Helmet>
        <title>Contact Us | Numinote</title>
        <meta name="description" content="Get in touch with the Numinote team. We're here to help with sales, support, and any other inquiries." />
      </Helmet>
      <div className="bg-gray-50">
        <div className="pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }}>
              <p className="text-base font-semibold text-primary uppercase tracking-wide">Contact Us</p>
              <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                We'd Love to Hear From You
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
                Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <motion.div initial={{
              opacity: 0,
              x: -50
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.6
            }} viewport={{
              once: true
            }} className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="Your Name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message..." rows={5} required />
                  </div>
                  <Button type="submit" className="w-full" size="lg">Send Message</Button>
                </form>
              </motion.div>
              <motion.div initial={{
              opacity: 0,
              x: 50
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.6,
              delay: 0.1
            }} viewport={{
              once: true
            }} className="space-y-8">
                <ContactInfoCard icon={Mail} title="Email Us">
                  <p>Sales: <a href="mailto:sales@numinote.silmustard.com" className="text-primary hover:underline">sales@numinote.silmustard.com</a></p>
                  <p>Support: <a href="mailto:support@numinote.silmustard.com" className="text-primary hover:underline">support@numinote.silmustard.com</a></p>
                </ContactInfoCard>
                <ContactInfoCard icon={Phone} title="Call Us">
                  <p>+1(574)241-3209</p>
                  <p>Mon-Fri, 9am-5pm EST</p>
                </ContactInfoCard>
                <ContactInfoCard icon={MapPin} title="Our Office">
                  <p>1209 MOUNTAIN ROAD PL NE
STE R</p>
                  <p>ALBUQUERQUE, NM 87110, USA</p>
                </ContactInfoCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>;
};
export default ContactPage;