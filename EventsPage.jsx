import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Video, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const events = [
  {
    type: 'Webinar',
    icon: Video,
    title: 'Mastering Fund Accounting in Numinote',
    date: 'October 15, 2025 | 2:00 PM EST',
    description: 'A deep dive into fund accounting principles and how to apply them effectively using our software.',
  },
  {
    type: 'Workshop',
    icon: Users,
    title: 'Grant Writing Bootcamp',
    date: 'November 5-7, 2025',
    description: 'An intensive, hands-on workshop designed to improve your grant proposals and win more funding.',
  },
  {
    type: 'Webinar',
    icon: Video,
    title: 'Year-End Financial Reporting',
    date: 'December 3, 2025 | 11:00 AM EST',
    description: 'Learn how to prepare and present comprehensive financial reports for your board and stakeholders.',
  },
];

const EventsPage = () => {
  return (
    <>
      <Helmet>
        <title>Events | Numinote</title>
        <meta name="description" content="Join Numinote for webinars, workshops, and community events designed for nonprofit professionals." />
      </Helmet>
      <div className="bg-gray-50/50 min-h-screen">
        <div className="pt-20 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-b from-white to-gray-50/50 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Calendar className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              Upcoming Events
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Learn, connect, and grow with our series of events for the nonprofit community.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 text-primary font-semibold">
                      <event.icon className="h-5 w-5" />
                      <span>{event.type}</span>
                    </div>
                    <CardTitle className="pt-2">{event.title}</CardTitle>
                    <CardDescription>{event.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600">{event.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Register Now</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;