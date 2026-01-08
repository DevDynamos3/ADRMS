"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full bg-white pt-24 pb-32 overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-gray-50 to-white -z-10"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-[100px] -z-10 opacity-60"></div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-8 text-center">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 mb-8"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-800">Secure & Official Record Keeping</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.1]"
        >
          Ahmadiyyah Digital <br />
          Records Management System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          A professional digital ledger designed to organize, secure, and manage Jamā’at financial records with precision. Move beyond spreadsheets to a centralized system.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/login" className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white rounded-lg font-semibold shadow-lg hover:bg-black transition-all flex items-center justify-center group">
            Admin Access
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link href="#how-it-works" className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
            Learn More
          </Link>
        </motion.div>
      </div>

      {/* Abstract Dashboard Preview at bottom of hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 max-w-5xl mx-auto px-4"
      >
        <div className="relative rounded-t-xl bg-gray-900 p-2 shadow-2xl border border-gray-200 ring-1 ring-gray-900/5">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900 rounded-t-xl opacity-5"></div>
          <div className="rounded-lg overflow-hidden bg-white">
            {/* Simplified Header of Fake Dashboard */}
            <div className="border-b border-gray-200 bg-gray-50 p-4 flex items-center space-x-4">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="h-4 w-64 bg-gray-200 rounded-md"></div>
            </div>
            {/* Fake Body */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-24 rounded bg-blue-50 border border-blue-100"></div>
              <div className="h-24 rounded bg-emerald-50 border border-emerald-100"></div>
              <div className="h-24 rounded bg-purple-50 border border-purple-100"></div>
              <div className="col-span-3 h-48 rounded bg-gray-50 border border-gray-100 mt-2"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
