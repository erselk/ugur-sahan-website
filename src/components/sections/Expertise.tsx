import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Award, Users, Code2, Palette } from "lucide-react";
import { useContext } from "react";
import { LanguageContext } from "@/components/LanguageContext";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { TranslationKey } from "@/lib/i18n/useTranslation";

const expertiseAreas = [
  {
    icon: GraduationCap,
    key: "engineering",
  },
  {
    icon: Briefcase,
    key: "entrepreneurship",
  },
  {
    icon: Award,
    key: "innovation",
  },
  {
    icon: Users,
    key: "multidisciplinary",
  },
  {
    icon: Code2,
    key: "software",
  },
  {
    icon: Palette,
    key: "design",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
    },
  },
};

const iconContainer = {
  hidden: { scale: 0, rotate: -180 },
  show: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

export const Expertise = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[var(--color-bg-secondary)] relative overflow-hidden">
      {/* Arka plan animasyonu */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_var(--color-primary)_50%,_transparent_75%)] bg-[length:250%_250%] opacity-[0.03] animate-shimmer" />

      <div className="container px-6 md:px-8 lg:px-12 xl:px-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[var(--color-fg)]">
            {t("home.expertise.title")}
          </h2>
          <p className="max-w-[900px] text-[var(--color-fg)]/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {t("home.expertise.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {expertiseAreas.map((area, index) => (
            <motion.div
              key={area.key}
              variants={item}
              whileHover="hover"
              className="group"
            >
              <div className="relative h-full p-8 rounded-lg border bg-[var(--color-bg)] text-[var(--color-fg)] shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-[var(--color-primary)]/20">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/0 via-[var(--color-primary)]/5 to-[var(--color-primary)]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
                <motion.div
                  variants={iconContainer}
                  className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center mb-4"
                >
                  <area.icon className="w-6 h-6 text-[var(--color-primary)]" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {t(`home.expertise.${area.key}.title` as TranslationKey)}
                </h3>
                <p className="text-[var(--color-fg)]/70 group-hover:text-[var(--color-fg)]/90 transition-colors">
                  {t(`home.expertise.${area.key}.description` as TranslationKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}; 