import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function Hero() {
  const handleGetStarted = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Get Started isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleWatchDemo = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Watch Demo isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Introducing the future of note-taking
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Transform Your
            <span className="gradient-text block">Thoughts Into</span>
            Knowledge
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Numinote is the intelligent note-taking platform that helps you capture, organize, and connect your ideas seamlessly. Experience the power of structured thinking with AI-enhanced organization.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 h-auto pulse-glow"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={handleWatchDemo}
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 h-auto"
            >
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="relative"
          >
            <div className="floating-animation">
              <img  
                alt="Numinote dashboard interface showing organized notes and workspace"
                className="rounded-2xl shadow-2xl mx-auto max-w-5xl w-full border border-gray-200"
               src="https://images.unsplash.com/photo-1612438424000-6506a22ab801" />
            </div>
            
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg floating-animation" style={{ animationDelay: '1s' }}>
              <Zap className="w-8 h-8 text-white" />
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg floating-animation" style={{ animationDelay: '2s' }}>
              <Brain className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}