'use client';

import { useState, useRef, FormEvent } from "react";
import { Mail, Phone, Instagram, Linkedin, Users, MessageSquare } from "lucide-react";
import { IconBrandX } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { LanguageContext } from "@/components/LanguageContext";
import { useTranslation } from "@/lib/i18n/useTranslation";

const cardStyles = {
  form: {
    borderColor: "border-l-[var(--color-primary)]",
    iconColor: "text-[var(--color-primary)]",
    iconBg: "bg-[var(--color-primary)]/10",
    hoverColor: "from-[var(--color-primary)]/0 via-[var(--color-primary)]/5 to-[var(--color-primary)]/0",
    linkColor: "text-[var(--color-primary)]"
  },
  collaboration: {
    borderColor: "border-l-[var(--color-accent)]",
    iconColor: "text-[var(--color-accent)]",
    iconBg: "bg-[var(--color-accent)]/10",
    hoverColor: "from-[var(--color-accent)]/0 via-[var(--color-accent)]/5 to-[var(--color-accent)]/0",
    linkColor: "text-[var(--color-accent)]"
  },
  email: {
    borderColor: "border-l-[#FF6B6B]",
    iconColor: "text-[#FF6B6B]",
    iconBg: "bg-[#FF6B6B]/10",
    hoverColor: "from-[#FF6B6B]/0 via-[#FF6B6B]/5 to-[#FF6B6B]/0",
    linkColor: "text-[#FF6B6B]"
  },
  phone: {
    borderColor: "border-l-[#4ECDC4]",
    iconColor: "text-[#4ECDC4]",
    iconBg: "bg-[#4ECDC4]/10",
    hoverColor: "from-[#4ECDC4]/0 via-[#4ECDC4]/5 to-[#4ECDC4]/0",
    linkColor: "text-[#4ECDC4]"
  },
  instagram: {
    borderColor: "border-l-[#E1306C]",
    iconColor: "text-[#E1306C]",
    iconBg: "bg-[#E1306C]/10",
    hoverColor: "from-[#E1306C]/0 via-[#E1306C]/5 to-[#E1306C]/0",
    linkColor: "text-[#E1306C]"
  },
  linkedin: {
    borderColor: "border-l-[#0077B5]",
    iconColor: "text-[#0077B5]",
    iconBg: "bg-[#0077B5]/10",
    hoverColor: "from-[#0077B5]/0 via-[#0077B5]/5 to-[#0077B5]/0",
    linkColor: "text-[#0077B5]"
  },
  twitter: {
    borderColor: "border-l-[#3D348B]",
    iconColor: "text-[#3D348B]",
    iconBg: "bg-[#3D348B]/10",
    hoverColor: "from-[#3D348B]/0 via-[#3D348B]/5 to-[#3D348B]/0",
    linkColor: "text-[#3D348B]"
  }
};

export const ContactContent = () => {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const initialFormState = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formRef.current) return;
    
    const formData = {
      name: (formRef.current.elements.namedItem('name') as HTMLInputElement).value,
      email: (formRef.current.elements.namedItem('email') as HTMLInputElement).value,
      subject: (formRef.current.elements.namedItem('subject') as HTMLInputElement).value,
      message: (formRef.current.elements.namedItem('message') as HTMLTextAreaElement).value,
    };
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(t("contact.form.error"));
      }

      setFormSubmitted(true);
      
      setTimeout(() => {
        setFormSubmitted(false);
        if (formRef.current) {
          formRef.current.reset();
        }
      }, 3000);
    } catch (error: any) {
      alert(error?.message || t("contact.form.error"));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    show: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const ContactFormComponent = () => (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      className={`relative bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg)] p-8 rounded-xl shadow-xl border border-[var(--color-border)] ${cardStyles.form.borderColor} border-l-4 overflow-hidden group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${cardStyles.form.hoverColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative">
        <div className="flex items-center mb-6">
          <motion.div
            variants={iconVariants}
            className={`w-12 h-12 rounded-lg ${cardStyles.form.iconBg} flex items-center justify-center mr-4`}
          >
            <MessageSquare className={`w-6 h-6 ${cardStyles.form.iconColor}`} />
          </motion.div>
          <h2 className="text-2xl font-bold text-[var(--color-fg)]">{t("contact.form.title")}</h2>
        </div>
        <p className="text-[var(--color-fg-secondary)] mb-8">{t("contact.form.subtitle")}</p>
        
        {formSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-6 rounded-lg text-center"
          >
            <p className="font-medium">{t("contact.form.success")}</p>
            <p className="mt-2 text-sm">{t("contact.form.successDetail")}</p>
          </motion.div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--color-fg)] mb-2">
                {t("contact.form.name")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-fg)] mb-2">
                {t("contact.form.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[var(--color-fg)] mb-2">
                {t("contact.form.subject")}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--color-fg)] mb-2">
                {t("contact.form.message")}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300 resize-none"
              ></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`w-full px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all duration-300`}
            >
              {t("contact.form.send")}
            </motion.button>
          </form>
        )}
      </div>
    </motion.div>
  );

  const CollaborationComponent = () => (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      className={`relative bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg)] p-8 rounded-xl shadow-xl border border-[var(--color-border)] ${cardStyles.collaboration.borderColor} border-l-4 overflow-hidden group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${cardStyles.collaboration.hoverColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative">
        <div className="flex items-center mb-6">
          <motion.div
            variants={iconVariants}
            className={`w-12 h-12 rounded-lg ${cardStyles.collaboration.iconBg} flex items-center justify-center mr-4`}
          >
            <Users className={`w-6 h-6 ${cardStyles.collaboration.iconColor}`} />
          </motion.div>
          <h2 className="text-2xl font-bold text-[var(--color-fg)]">{t("contact.collaboration.title")}</h2>
        </div>
        <p className="text-[var(--color-fg-secondary)] mb-6">{t("contact.collaboration.description")}</p>
        <a
          href="mailto:contact@ugursahan.com"
          className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[var(--color-accent)]/20 transition-all duration-300`}
        >
          {t("contact.collaboration.subtitle")}
        </a>
      </div>
    </motion.div>
  );

  const socialLinks = [
    {
      icon: Mail,
      title: t("contact.info.email"),
      href: "mailto:contact@ugursahan.com",
      value: "contact@ugursahan.com",
      style: cardStyles.email
    },
    {
      icon: Phone,
      title: t("contact.info.phone"),
      href: "tel:+905555555555",
      value: "+90 (555) 555 55 55",
      style: cardStyles.phone
    },
    {
      icon: Instagram,
      title: "Instagram",
      href: "https://instagram.com/ugur__sahan",
      value: "@ugur__sahan",
      style: cardStyles.instagram
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      href: "https://linkedin.com/in/ugursahan",
      value: "ugursahan",
      style: cardStyles.linkedin
    },
    {
      icon: IconBrandX,
      title: "X",
      href: "https://x.com/OduncAkil",
      value: "@OduncAkil",
      style: cardStyles.twitter
    }
  ];

  return (
    <div className="container mx-auto px-8 sm:px-12 lg:px-24 py-12 sm:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-fg)] mb-4">
          {t("contact.title")}
        </h1>
        <p className="text-lg text-[var(--color-fg-secondary)] max-w-2xl mx-auto">
          {t("contact.description")}
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-16"
      >
        {socialLinks.map((link, index) => (
          <motion.div
            key={link.title}
            variants={itemVariants}
            whileHover="hover"
            className={`relative bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg)] p-6 rounded-xl shadow-xl border border-[var(--color-border)] ${link.style.borderColor} border-l-4 text-center overflow-hidden group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${link.style.hoverColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative">
              <motion.div
                variants={iconVariants}
                className={`w-12 h-12 rounded-lg ${link.style.iconBg} flex items-center justify-center mx-auto mb-4`}
              >
                <link.icon className={`w-6 h-6 ${link.style.iconColor}`} />
              </motion.div>
              <h3 className="font-medium text-[var(--color-fg)] mb-2">{link.title}</h3>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.style.linkColor} hover:underline text-sm transition-colors duration-300`}
              >
                {link.value}
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <ContactFormComponent />
        </div>
        <div className="lg:col-span-7">
          <CollaborationComponent />
        </div>
      </div>
    </div>
  );
}; 