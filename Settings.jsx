import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building, Users, CreditCard, Sliders } from 'lucide-react';

const settingsNav = [
  { name: 'Profile', href: '/app/settings/profile', icon: User },
  { name: 'Organization', href: '/app/settings/organization', icon: Building },
  { name: 'Users & Roles', href: '/app/settings/users', icon: Users },
  { name: 'Billing', href: '/app/settings/billing', icon: CreditCard },
  { name: 'Advanced', href: '/app/settings/advanced', icon: Sliders },
];

export default function Settings({
  organizationSettings,
  activeOrgId,
  userProfile,
  loadingData,
}) {
  const location = useLocation();

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8 h-full">
      <aside className="lg:col-span-3 xl:col-span-2">
        <nav className="space-y-1 p-2">
          <h2 className="px-2 py-2 text-lg font-semibold tracking-tight">Settings</h2>
          {settingsNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group rounded-md px-3 py-2 flex items-center text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:col-span-9 xl:col-span-10 bg-white rounded-lg shadow-sm border p-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet context={{ organizationSettings, activeOrgId, userProfile, loadingData }} />
        </motion.div>
      </div>
    </div>
  );
}