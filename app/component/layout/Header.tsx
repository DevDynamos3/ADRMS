"use client";

import React, { useState, useEffect } from "react";
import Logo from "../logo/Logo";
import Link from "next/link";
import Sidebar from "./Sidebar";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavLinks {
    name: string;
    href: string;
}

const navLinks: NavLinks[] = [
    { name: "Home", href: "/" },
    { name: "About System", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

    // Handle smooth scroll manually if needed (though CSS scroll-behavior: smooth handles most)
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                const headerOffset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    };

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
                        : "bg-white py-5 border-b border-transparent"
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Logo width={isScrolled ? 40 : 45} height={isScrolled ? 40 : 45} text="ADRMS" size={isScrolled ? "md" : "xl"} />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="relative group py-2"
                            >
                                <span className="text-sm font-medium text-gray-600 group-hover:text-emerald-600 transition-colors">
                                    {link.name}
                                </span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full group-active:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link
                            href="/login"
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 ${isScrolled
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                                    : "bg-gray-900 text-white hover:bg-black shadow-lg"
                                }`}
                        >
                            Admin Login
                        </Link>
                    </div>


                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Sidebar for mobile */}
            <Sidebar
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                navLinks={navLinks}
            />
        </>
    );
}
