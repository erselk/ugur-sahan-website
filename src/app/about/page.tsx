"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Award, BookOpen, Heart, Users } from "lucide-react";
import { useRef, useContext } from "react";
import { LanguageContext } from "@/components/LanguageContext";
import { useTranslation } from "@/lib/i18n/useTranslation";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const imageAnimation = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const badgeAnimation = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

export default function AboutPage() {
  const containerRef = useRef(null);
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <motion.div
      ref={containerRef}
      className="container mx-auto px-4 py-12 max-w-4xl min-h-screen"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <motion.div
        style={{ opacity, scale }}
        className="relative w-64 h-64 mx-auto mb-8 rounded-full overflow-hidden shadow-2xl"
        variants={imageAnimation}
        whileHover="hover"
      >
        <img
          src="/ugursahan.webp"
          alt={language === "tr" ? "Uğur Şahan" : "Uğur Şahan"}
          className="w-full h-full object-cover"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight"
        variants={fadeInUp}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {language === "tr" ? "Uğur Şahan" : "Ugur Sahan"}
      </motion.h1>

      <motion.div
        className="flex flex-wrap gap-3 justify-center mb-12"
        variants={staggerContainer}
      >
        <motion.div variants={badgeAnimation} whileHover="hover">
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            <GraduationCap className="w-4 h-4 mr-2" />
            {t("about.roles.engineer")}
          </Badge>
        </motion.div>
        <motion.div variants={badgeAnimation} whileHover="hover">
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            <Briefcase className="w-4 h-4 mr-2" />
            {t("about.roles.entrepreneur")}
          </Badge>
        </motion.div>
        <motion.div variants={badgeAnimation} whileHover="hover">
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            <Award className="w-4 h-4 mr-2" />
            {t("about.roles.innovator")}
          </Badge>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid gap-8"
        variants={staggerContainer}
      >
        <motion.div 
          variants={cardAnimation}
          whileHover="hover"
          className="group"
        >
          <Card className="p-8 transform transition-all duration-300 group-hover:shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-primary">
              <BookOpen className="w-6 h-6 mr-3" />
              {t("about.education.title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t("about.education.content")}
            </p>
          </Card>
        </motion.div>

        <motion.div 
          variants={cardAnimation}
          whileHover="hover"
          className="group"
        >
          <Card className="p-8 transform transition-all duration-300 group-hover:shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-primary">
              <Heart className="w-6 h-6 mr-3" />
              {t("about.personal.title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t("about.personal.content")}
            </p>
          </Card>
        </motion.div>

        <motion.div 
          variants={cardAnimation}
          whileHover="hover"
          className="group"
        >
          <Card className="p-8 transform transition-all duration-300 group-hover:shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-primary">
              <Users className="w-6 h-6 mr-3" />
              {t("about.philosophy.title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t("about.philosophy.content")}
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 