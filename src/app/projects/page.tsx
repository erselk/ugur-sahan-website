"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t("projects.title")}
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          {t("projects.comingSoon")}
        </p>
        <Link href="/">
          <Button variant="outline" className="group">
            {t("common.back")}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
} 