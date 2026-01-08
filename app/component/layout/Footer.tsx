import Link from "next/link";
import { FileSpreadsheet, Github, Twitter, Linkedin } from "lucide-react";
import Logo from "../logo/Logo";

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 text-white mb-4">
                            <Link href="/" className="flex items-center gap-2 group">
                                <Logo width={45} height={45} text="ADRMS" size="xl" />
                            </Link>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            A professional Record Management System designed for the Ahmadiyyah Jamā’at.
                            Securely store, manage, and audit organizational financial records with ease.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Platform</h3>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Home</Link></li>
                            <li><Link href="#how-it-works" className="text-gray-400 hover:text-emerald-400 transition-colors">How It Works</Link></li>
                            <li><Link href="#features" className="text-gray-400 hover:text-emerald-400 transition-colors">Features</Link></li>
                            <li><Link href="/login" className="text-gray-400 hover:text-emerald-400 transition-colors">Admin Login</Link></li>
                        </ul>
                    </div>

                    {/* <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Security</Link></li>
                        </ul>
                    </div> */}
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} ADRMS. All rights reserved.
                    </p>
                    {/* <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-white"><Github className="h-5 w-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Twitter className="h-5 w-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Linkedin className="h-5 w-5" /></a>
                    </div> */}
                </div>
            </div>
        </footer>
    );
}
