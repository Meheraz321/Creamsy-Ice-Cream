import React from "react";
import { Heart, Instagram, Mail, Phone, MapPin, Sparkles } from "lucide-react";
import { MASCOT_IMAGE } from "../data";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, page: string) => {
    e.preventDefault();
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer" className="relative bg-[#002d24] text-[#80cbc4] pt-20 overflow-hidden">
      {/* SVG WAVY SEPARATOR */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 text-[#FAF6F0]"
          fill="currentColor"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V120H1.53C58.12,111.45,116.89,103.52,175.76,90.41,241.6,75.68,284.4,63.3,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12 pt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/5 pb-12 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1.5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full border border-white/20 bg-neutral-900 overflow-hidden">
                <img
                  src={MASCOT_IMAGE}
                  alt="Creamsy Mascot"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-display font-black text-2xl tracking-wider text-white">
                Creamsy
              </span>
            </div>
            <p className="text-sm text-teal-100/60 leading-relaxed mb-6">
              Taste Joy in Every Bite. Bringing premium gourmet ice cream cups packed with grass-fed cream and fresh fruits straight to your freezer.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white border border-white/10 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@creamsy.com"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white border border-white/10 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-5">
              Explore Menu
            </h5>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#home"
                  onClick={(e) => handleNavClick(e, "home")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Stage Preview
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  onClick={(e) => handleNavClick(e, "menu")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Selection
                </a>
              </li>
              <li>
                <a
                  href="#moments"
                  onClick={(e) => handleNavClick(e, "moments")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Social Moments
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  onClick={(e) => handleNavClick(e, "reviews")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Customer Reviews
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => handleNavClick(e, "faq")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Common FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h5 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-5">
              Contact Us
            </h5>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>88 Sweet Scoop Avenue, Frosty Hills, NY 10024</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+1 (555) CREAMSY</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>scoops@creamsy.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Club */}
          <div>
            <h5 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-5">
              Join the Scoop Club
            </h5>
            <p className="text-xs text-teal-100/60 leading-relaxed mb-4">
              Get secret discounts, invitations to pre-release testing parties, and recipes!
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-[#80cbc4]/40 text-xs focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-colors pr-20"
              />
              <button className="absolute right-1 top-1 bottom-1 px-3 bg-amber-500 hover:bg-amber-600 text-black font-display font-bold text-[10px] uppercase rounded-full tracking-wider transition-colors cursor-pointer">
                Subscribe
              </button>
            </div>
            <p className="text-[10px] text-[#80cbc4]/40 mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-amber-400 stroke-none" />
              Spam free. Only pure vanilla news.
            </p>
          </div>
        </div>

        {/* Bottom copyright / credit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#80cbc4]/60">
          <p>© 2026 Creamsy Ice Cream Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 font-medium text-white/80">
            Made with <Heart className="w-3.5 h-3.5 fill-rose-500 stroke-none animate-pulse" /> by <span className="text-amber-400 font-bold hover:underline cursor-pointer">MD MEHEDI HASAN</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
