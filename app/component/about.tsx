"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function AboutSystem() {
  const features = [
    "Automated Record Management with unique Receipt IDs",
    "Secure & Encrypted Database Storage",
    "Streamlined Administrative Workflow for Officials",
    "Excel Import/Export for Flexible Reporting",
    "Real-time Financial Totals and Analytics",
  ];

  return (
    <section id="features" className="relative w-full bg-transparent py-24 overflow-hidden">

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">
              About the System
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Modernizing Record Keeping for Efficiency & Transparency
            </h3>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              The Ahmadiyyah Record Management System (ADRMS) is a purpose-built digital solution designed to replace manual ledger keeping. It combines the familiarity of spreadsheet data handling with the security and reliability of a modern database application.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              By digitizing records, we ensure that every transaction is traceable, secure, and easily retrievable, minimizing errors and enhancing administrative capabilities.
            </p>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual/Image representation - Abstract UI Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl bg-white shadow-2xl border border-gray-200 p-2 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <div className="bg-gray-50 rounded-xl overflow-hidden flex flex-col h-full">

                {/* Mock Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 bg-emerald-600 rounded flex items-center justify-center text-white text-xs font-bold">A</div>
                    <span className="text-gray-900 font-bold text-sm">ADRMS Dashboard</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500">JD</div>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Mock Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-[10px] text-gray-500 uppercase font-semibold">Total Collections</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">₦0.00</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-[10px] text-gray-500 uppercase font-semibold">Active Records</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">0</p>
                    </div>
                  </div>

                  {/* Mock Table */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700">Recent Transactions</span>
                      <div className="h-4 w-12 bg-emerald-100 rounded text-[9px] flex items-center justify-center text-emerald-700 font-medium">Export</div>
                    </div>
                    <table className="w-full text-left text-[10px]">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400">
                          <th className="px-3 py-2 font-medium">Date</th>
                          <th className="px-3 py-2 font-medium">Name</th>
                          <th className="px-3 py-2 font-medium">Type</th>
                          <th className="px-3 py-2 font-medium text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        <tr>
                          <td className="px-3 py-2 text-gray-600">Jan 15</td>
                          <td className="px-3 py-2 font-medium text-gray-800">Ahmad Ali</td>
                          <td className="px-3 py-2 text-gray-500"><span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">Chanda Aam</span></td>
                          <td className="px-3 py-2 text-gray-800 font-medium text-right">₦ 5,000</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-gray-600">Jan 16</td>
                          <td className="px-3 py-2 font-medium text-gray-800">Yusuf Sodiq</td>
                          <td className="px-3 py-2 text-gray-500"><span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">Tajnid</span></td>
                          <td className="px-3 py-2 text-gray-800 font-medium text-right">---</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-gray-600">Jan 18</td>
                          <td className="px-3 py-2 font-medium text-gray-800">Ibrahim K.</td>
                          <td className="px-3 py-2 text-gray-500"><span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded">Chanda Am</span></td>
                          <td className="px-3 py-2 text-gray-800 font-medium text-right">₦ 2,500</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative blobs */}
            <div className="absolute -z-10 top-1/2 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -z-10 bottom-0 left-10 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
