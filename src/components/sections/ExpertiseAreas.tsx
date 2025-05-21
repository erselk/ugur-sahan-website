import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Database, Layout, Smartphone, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef } from "react";

const expertiseAreas = [
  {
    title: "Frontend Geliştirme",
    description: "Modern web teknolojileri ile kullanıcı dostu, performanslı ve erişilebilir arayüzler geliştiriyorum.",
    icon: Code2,
  },
  {
    title: "Backend Sistemleri",
    description: "Ölçeklenebilir, güvenli ve modern backend sistemleri tasarlıyor ve geliştiriyorum.",
    icon: Database,
  },
  {
    title: "UI/UX Tasarım",
    description: "Kullanıcı deneyimini ön planda tutan, modern ve estetik arayüz tasarımları oluşturuyorum.",
    icon: Layout,
  },
  {
    title: "Mobil Uygulama",
    description: "React Native ile cross-platform mobil uygulamalar geliştiriyorum.",
    icon: Smartphone,
  },
  {
    title: "Performans Optimizasyonu",
    description: "Web uygulamalarının performansını artırmak için modern optimizasyon teknikleri uyguluyorum.",
    icon: Zap,
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

export const ExpertiseAreas = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity, scale }}
      className="py-24 bg-[var(--color-bg)] relative overflow-hidden"
    >
      {/* Arka plan animasyonu */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_var(--color-primary)_50%,_transparent_75%)] bg-[length:250%_250%] opacity-[0.03]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="container px-6 md:px-8 lg:px-12 xl:px-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[var(--color-fg)]">
            Uzmanlık Alanlarım
          </h2>
          <p className="max-w-[900px] text-[var(--color-fg)]/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Modern web teknolojileri ile kapsamlı çözümler sunuyorum
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
              key={index}
              variants={item}
              whileHover="hover"
              className="group"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 bg-[var(--color-bg-secondary)] border-[var(--color-border)] relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/0 via-[var(--color-primary)]/5 to-[var(--color-primary)]/0 opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
                <CardHeader>
                  <motion.div
                    variants={iconContainer}
                    className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center mb-4"
                  >
                    <area.icon className="w-6 h-6 text-[var(--color-primary)]" />
                  </motion.div>
                  <CardTitle className="text-[var(--color-fg)] group-hover:text-[var(--color-primary)] transition-colors">
                    {area.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[var(--color-fg)]/70 group-hover:text-[var(--color-fg)]/90 transition-colors">
                    {area.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}; 