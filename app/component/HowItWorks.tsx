"use client";

import { motion } from "framer-motion";
import { Upload, Database, FileSpreadsheet, ShieldCheck } from "lucide-react";

const steps = [
    {
        icon: <Upload className="w-8 h-8 text-white" />,
        title: "1. Upload Data",
        description: "Simply upload your existing Excel spreadsheets or CSV files. The system intelligently maps columns preventing manual entry errors.",
        color: "bg-blue-600"
    },
    {
        icon: <Database className="w-8 h-8 text-white" />,
        title: "2. Centralize Records",
        description: "All records are stored in a secure, unified database. Say goodbye to scattered files and version conflicts.",
        color: "bg-emerald-600"
    },
    {
        icon: <FileSpreadsheet className="w-8 h-8 text-white" />,
        title: "3. Manage & Edit",
        description: "Update entries using our Excel-like interface. Changes are saved instantly and totals are calculated automatically.",
        color: "bg-purple-600"
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-white" />,
        title: "4. Secure Export",
        description: "Generate formatted reports or export back to Excel whenever needed. Admin-only access ensures data integrity.",
        color: "bg-orange-600"
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        ADRMS simplifies record keeping into four easy steps, bridging the gap between familiar spreadsheets and modern software.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 hover:shadow-xl transition-all duration-300 h-full border border-white/50 group-hover:bg-white/60">
                                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-lg shadow-${step.color.split('-')[1]}-200/50 transform group-hover:scale-110 transition-transform duration-300`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
