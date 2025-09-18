'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';                                                    
import { X, LogIn, Settings, Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isAdmin: boolean;
  onLoginClick: () => void;
  onAdminClick: () => void;
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  user, 
  isAdmin, 
  onLoginClick, 
  onAdminClick 
}: MobileMenuProps) {
  return (
    <div className="mobile-menu-container">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/95 z-[9998] backdrop-blur-sm"
              onClick={onClose}
            />
            
            {/* Menu Panel - Opens from right to left */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white border-l border-gray-200 z-[9999] mobile-menu mobile-scrollable shadow-2xl"
            >
              <div className="flex flex-col h-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-heading text-xl text-black font-semibold">Menu</span>
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 hover:text-black transition-colors touch-manipulation"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Menu Options */}
                <div className="flex-1 space-y-4">
                  {/* Navigation Options */}
                  <Link href="/account/book">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-4 text-gray-700 hover:text-[#6ea058] hover:bg-[#6ea058]/10 transition-all duration-200 px-6 py-4 rounded-xl border border-gray-200 hover:border-[#6ea058]/30 touch-manipulation font-medium text-base"
                    >
                      <Calendar size={20} className="text-gray-600" />
                      <span>Schedule</span>
                    </motion.button>
                  </Link>

                  <Link href="/packages">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-4 text-gray-700 hover:text-[#6ea058] hover:bg-[#6ea058]/10 transition-all duration-200 px-6 py-4 rounded-xl border border-gray-200 hover:border-[#6ea058]/30 touch-manipulation font-medium text-base"
                    >
                      <BookOpen size={20} className="text-gray-600" />
                      <span>Booking</span>
                    </motion.button>
                  </Link>

                  {/* Login/Account Option */}
                  {!user && (
                    <motion.button
                      onClick={() => {
                        onClose();
                        onLoginClick();
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-4 text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200 px-6 py-4 rounded-xl border border-gray-200 hover:border-gray-300 touch-manipulation font-medium text-base"
                    >
                      <LogIn size={20} className="text-gray-600" />
                      <span>Login / Account</span>
                    </motion.button>
                  )}
                  
                  {/* Admin Dashboard Option */}
                  {user && isAdmin && (
                    <motion.button
                      onClick={() => {
                        onClose();
                        onAdminClick();
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-4 text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200 px-6 py-4 rounded-xl border border-gray-200 hover:border-gray-300 touch-manipulation font-medium text-base"
                    >
                      <Settings size={20} className="text-gray-600" />
                      <span>Admin Dashboard</span>
                    </motion.button>
                  )}
                  
                  {/* User Account Option */}
                  {user && !isAdmin && (
                    <motion.button
                      onClick={() => {
                        onClose();
                        onLoginClick();
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-4 text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200 px-6 py-4 rounded-xl border border-gray-200 hover:border-gray-300 touch-manipulation font-medium text-base"
                    >
                      <Settings size={20} className="text-gray-600" />
                      <span>My Account</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}