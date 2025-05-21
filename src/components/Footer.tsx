"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  User, 
  BookOpen, 
  Briefcase, 
  Mail,
  BookMarked,
  PenTool,
  Lightbulb,
  Search,
  Github,
  Linkedin,
  Instagram,
  Wine,
  ScrollText
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/ugursahan",
    color: "hover:text-[#333] dark:hover:text-white",
  },
  {
    name: "X",
    icon: (props: any) => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
        {...props}
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    href: "https://twitter.com/OduncAkil",
    color: "hover:text-[#000000] dark:hover:text-white",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com/ugur__sahan",
    color: "hover:text-[#E4405F]",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/ugursahan/",
    color: "hover:text-[#0A66C2]",
  }
];

const mainNavItems = [
  { key: "common.home" as const, href: "/", icon: Home },
  { key: "nav.about" as const, href: "/about", icon: User },
  { key: "nav.writings" as const, href: "/writings", icon: BookOpen },
  { key: "nav.projects" as const, href: "/projects", icon: Briefcase },
  { key: "nav.contact" as const, href: "/contact", icon: Mail },
];

const writingsNavItems = [
  { key: "nav.poems" as const, href: "/poems", icon: PenTool },
  { key: "nav.memories" as const, href: "/memories", icon: BookMarked },
  { key: "nav.essays" as const, href: "/essays", icon: ScrollText },
  { key: "nav.innovation" as const, href: "/innovation", icon: Lightbulb },
  { key: "nav.tasting" as const, href: "/tasting", icon: Wine },
];

export function Footer() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Search sayfasına yönlendir
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-12">
        {/* Üst Bölüm: Profil, Navigasyon ve Arama */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Sol: Profil ve Sosyal Medya */}
          <div className="md:col-span-2">
            <div className="flex flex-col items-start w-[140px]">
              {/* Profil Fotoğrafı */}
              <div className="w-full flex justify-center mb-4">
                <Image
                  src="/ugursahan.webp"
                  alt="Uğur Şahan"
                  width={120}
                  height={120}
                  className="rounded-full"
                  priority
                />
              </div>
              {/* Sosyal Medya İkonları */}
              <div className="flex gap-4 w-full justify-center">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-full hover:bg-accent/50 transition-all ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Orta: Navigasyon */}
          <div className="md:col-span-8 flex justify-center px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 w-full max-w-4xl">
              {mainNavItems.map((item) => (
                <div key={item.href} className="flex flex-col gap-3">
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors group"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    {t(item.key)}
                  </Link>
                  
                  {/* Yazılarım alt menüsü */}
                  {item.key === "nav.writings" && (
                    <ul className="flex flex-col gap-2 mt-1">
                      {writingsNavItems.map((subItem) => (
                        <motion.li
                          key={subItem.href}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="flex items-start"
                        >
                          <Link
                            href={subItem.href}
                            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                          >
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                              <subItem.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-left">{t(subItem.key)}</span>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sağ: Arama */}
          <div className="md:col-span-2 flex justify-end items-start pr-4 md:pr-0">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("footer.searchPlaceholder" as const)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground px-4">
          <p>© {new Date().getFullYear()} {t("common.siteName" as const)}</p>
        </div>
      </div>
    </footer>
  );
} 