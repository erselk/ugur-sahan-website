import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Instagram } from "lucide-react";
import { siX } from "simple-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LucideIcon } from "lucide-react";
import { ReactElement, useContext } from "react";
import { LanguageContext } from "@/components/LanguageContext";
import { useTranslation } from "@/lib/i18n/useTranslation";

type SocialLink = {
  name: string;
  href: string;
  icon: LucideIcon | (() => ReactElement);
  className?: string;
};

const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/ugursahan",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/ugursahan",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/ugur__sahan",
    icon: Instagram,
  },
  {
    name: "X",
    href: "https://x.com/OduncAkil",
    icon: () => (
      <svg
        role="img"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="currentColor"
        dangerouslySetInnerHTML={{ __html: siX.svg }}
      />
    ),
  },
];

export const Hero = () => {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-bg)]">
      <div className="container px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-4"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[var(--color-fg)]">
                {t("home.hero.title")}
              </h1>
              <p className="max-w-[600px] text-[var(--color-fg)]/70 md:text-xl">
                {t("home.hero.subtitle")}
              </p>
            </div>
            <p className="max-w-[600px] text-[var(--color-fg)]/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t("home.hero.description")}
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button 
                size="lg" 
                className="dark:bg-[var(--color-primary)] dark:text-[var(--color-bg)] dark:hover:bg-[var(--color-primary)]/90 bg-[var(--color-primary)]/90 text-[var(--color-bg)] hover:bg-[var(--color-primary)] transition-colors" 
                asChild
              >
                <Link href="/writings" className="group">
                  {t("nav.writings")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10" asChild>
                <Link href="/contact">{t("nav.contact")}</Link>
              </Button>
            </div>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[var(--color-fg)]/70 hover:text-[var(--color-primary)] transition-colors ${link.className || ''}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-full aspect-square max-w-[400px] rounded-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/5 p-4">
              <div className="absolute inset-0 rounded-full bg-[var(--color-primary)]/10 animate-pulse" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[var(--color-border)]">
                <Image
                  src="/ugursahan.webp"
                  alt={language === "tr" ? "Uğur Şahan" : "Ugur Sahan"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 