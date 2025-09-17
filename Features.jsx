import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Link, 
  Palette, 
  Cloud, 
  Zap,
  Brain,
  Shield,
  Users
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: FileText,
      title: "Rich Text Editor",
      description: "Write with a powerful editor that supports markdown, formatting, and multimedia content.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find anything instantly with AI-powered search across all your notes and documents.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Link,
      title: "Connected Notes",
      description: "Link related ideas and create a web of knowledge with bidirectional connections.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Palette,
      title: "Beautiful Themes",
      description: "Customize your workspace with stunning themes and personalization options.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Cloud,
      title: "Cloud Sync",
      description: "Access your notes anywhere with real-time synchronization across all devices.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience blazing-fast performance with instant loading and smooth interactions.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Get intelligent suggestions and auto-organization powered by advanced AI.",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected with enterprise-grade security measures.",
      color: "from-gray-500 to-slate-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share and collaborate on notes with your team in real-time.",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="gradient-text block">Organize Your Mind</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to enhance your thinking process and boost productivity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}