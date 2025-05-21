"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Languages, ChevronDown } from "lucide-react";
import { LanguageContext } from "./LanguageContext";
import { GB, TR } from 'country-flag-icons/react/3x2';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tailwind className birleştirici yardımcı fonksiyon
function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const navItems = [
  { key: "nav.about", href: "/about" },
  { 
    key: "nav.writings",
    href: "/writings",
    subItems: [
      { key: "nav.poems", href: "/poems" },
      { key: "nav.memories", href: "/memories" },
      { key: "nav.essays", href: "/essays" },
      { key: "nav.innovation", href: "/innovation" },
      { key: "nav.tasting", href: "/tasting" },
    ]
  },
  { key: "nav.projects", href: "/projects" },
  { key: "nav.contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const { language, setLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState<boolean | null>(null);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Dil değiştirme için
  const toggleLanguage = () => {
    const newLang = language === "tr" ? "en" : "tr";
    setLanguage(newLang);
    setIsLanguageMenuOpen(false);
    localStorage.setItem("language", newLang);
  };

  // İlk yüklemede tema ayarlarını yükle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      const isDarkMode = savedTheme === 'dark';
      setIsDark(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
        } else {
      // İlk yüklemede tarayıcı temasını kullan
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        }
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Dil ayarları için ayrı bir useEffect
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    const browserLang = navigator.language.split("-")[0];
    
    if (savedLanguage === "tr" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    } else {
      setLanguage(browserLang === "tr" ? "tr" : "en");
    }
  }, [setLanguage]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-8">
      {/* Logo */}
        <motion.div 
          initial={{ x: -40, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 100 }}
        >
        <Link href="/">
            <Image 
              src="/logo.svg" 
              alt="logo" 
              width={64} 
              height={64} 
              className="rounded-full transition-colors dark:invert dark:brightness-200" 
            />
        </Link>
      </motion.div>

      {/* Navigasyon */}
        <motion.nav 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ type: "spring", delay: 0.2 }}
          className="hidden md:flex items-center gap-6"
        >
          {navItems.map((item) => (
            <motion.div 
              key={item.href} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => item.subItems && setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative"
            >
              {item.subItems ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    asChild
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname.startsWith(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Link href={item.href}>
                      {t(item.key)}
                    </Link>
                  </Button>
                  <AnimatePresence>
                    {hoveredItem === item.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 mt-2 w-48 rounded-md border bg-popover shadow-md z-50"
                        onMouseEnter={() => setHoveredItem(item.href)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <div className="py-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "block px-4 py-2 text-sm transition-colors",
                                pathname === subItem.href
                                  ? "bg-accent text-accent-foreground"
                                  : "hover:bg-accent hover:text-accent-foreground"
                              )}
                            >
                              {t(subItem.key)}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Link href={item.href}>
                    {t(item.key)}
                  </Link>
                </Button>
              )}
            </motion.div>
          ))}
        </motion.nav>

      {/* Sağ: Gece modu ve dil switch */}
        <motion.div 
          initial={{ x: 40, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          className="flex items-center gap-4"
        >
        {/* Gece modu butonu */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--color-border)] transition-colors flex items-center justify-center"
            aria-label={t('common.toggleTheme')}
        >
          <motion.span
              key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 360, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
              {isDark ? (
                <Moon className="w-6 h-6" />
              ) : (
                <Sun className="w-6 h-6" />
              )}
          </motion.span>
          </motion.button>

          {/* Dil switch */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-[var(--color-border)] transition-colors flex items-center justify-center"
            aria-label={t('nav.language.switch')}
          >
            <motion.span
              key={language}
              initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 360, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {language === "tr" ? (
                <TR className="w-5 h-5" />
              ) : (
                <GB className="w-5 h-5" />
              )}
            </motion.span>
          </motion.button>
        </motion.div>
        </div>
    </header>
  );
} 