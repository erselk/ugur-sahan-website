"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { FeaturedPosts } from "@/components/sections/FeaturedPosts";
import { Expertise } from "@/components/sections/Expertise";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <FeaturedPosts />
      <Expertise />
    </main>
  );
} 