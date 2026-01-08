"use client";

import Link from "next/link";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../logo/Logo";
import { X, ArrowRight } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
}

export default function Sidebar({ isOpen, onClose, navLinks }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar sliding from right (more standard for mobile menus) or top */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[280px] bg-white z-50 shadow-2xl border-l border-gray-100 flex flex-col"
          >
            {/* Top bar with Logo and Close button */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <span className="font-bold text-lg text-emerald-900">Menu</span>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="block px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    onClick={onClose}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <Link
                href="/login"
                className="flex items-center justify-center w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-semibold shadow-sm hover:bg-emerald-700 active:transform active:scale-95 transition-all"
                onClick={onClose}
              >
                <span>Admin Login</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
