export type Language = "tr" | "en";

export type TranslationKey = 
  | "common.siteName"
  | "common.toggleTheme"
  | "common.search"
  | "common.readMore"
  | "common.back"
  | "common.home"
  | "common.loading"
  | "common.error"
  | "nav.about"
  | "nav.writings"
  | "nav.projects"
  | "nav.contact"
  | "nav.title"
  | "nav.poems"
  | "nav.memories"
  | "nav.essays"
  | "nav.innovation"
  | "nav.tasting"
  | "nav.language.switch"
  | "footer.navigation"
  | "footer.search"
  | "footer.searchPlaceholder"
  | "footer.rights"
  | "home.welcome"
  | "home.description"
  | "home.contact"
  | "home.hero.title"
  | "home.hero.subtitle"
  | "home.hero.description"
  | "home.expertise.title"
  | "home.expertise.subtitle"
  | "home.expertise.engineering.title"
  | "home.expertise.engineering.description"
  | "home.expertise.entrepreneurship.title"
  | "home.expertise.entrepreneurship.description"
  | "home.expertise.innovation.title"
  | "home.expertise.innovation.description"
  | "home.expertise.multidisciplinary.title"
  | "home.expertise.multidisciplinary.description"
  | "home.expertise.software.title"
  | "home.expertise.software.description"
  | "home.expertise.design.title"
  | "home.expertise.design.description"
  | "about.title"
  | "about.description"
  | "about.education.title"
  | "about.education.content"
  | "about.personal.title"
  | "about.personal.content"
  | "about.philosophy.title"
  | "about.philosophy.content"
  | "about.roles.engineer"
  | "about.roles.entrepreneur"
  | "about.roles.innovator"
  | "poems.title"
  | "poems.empty"
  | "memories.title"
  | "memories.empty"
  | "essays.title"
  | "essays.empty"
  | "innovation.title"
  | "innovation.empty"
  | "tasting.title"
  | "tasting.empty"
  | "contact.title"
  | "contact.description"
  | "contact.info.title"
  | "contact.info.subtitle"
  | "contact.info.email"
  | "contact.info.phone"
  | "contact.info.address"
  | "contact.info.social"
  | "contact.info.getDirections"
  | "contact.form.title"
  | "contact.form.subtitle"
  | "contact.form.name"
  | "contact.form.email"
  | "contact.form.subject"
  | "contact.form.message"
  | "contact.form.send"
  | "contact.form.success"
  | "contact.form.successDetail"
  | "contact.form.error"
  | "contact.collaboration.title"
  | "contact.collaboration.subtitle"
  | "contact.collaboration.description"
  | "contact.support.title"
  | "contact.support.subtitle"
  | "contact.support.description"
  | "projects.title"
  | "projects.comingSoon";

export type Translations = {
  common: {
    siteName: string;
    toggleTheme: string;
    search: string;
    readMore: string;
    back: string;
    home: string;
    loading: string;
    error: string;
  };
  nav: {
    about: string;
    writings: string;
    projects: string;
    contact: string;
    title: string;
    poems: string;
    memories: string;
    essays: string;
    innovation: string;
    tasting: string;
    language: {
      switch: string;
    };
  };
  footer: {
    navigation: string;
    search: string;
    searchPlaceholder: string;
    rights: string;
  };
  home: {
    welcome: string;
    description: string;
    contact: string;
    hero: {
      title: string;
      subtitle: string;
      description: string;
    };
    expertise: {
      title: string;
      subtitle: string;
      engineering: {
        title: string;
        description: string;
      };
      entrepreneurship: {
        title: string;
        description: string;
      };
      innovation: {
        title: string;
        description: string;
      };
      multidisciplinary: {
        title: string;
        description: string;
      };
      software: {
        title: string;
        description: string;
      };
      design: {
        title: string;
        description: string;
      };
    };
  };
  about: {
    title: string;
    description: string;
    education: {
      title: string;
      content: string;
    };
    personal: {
      title: string;
      content: string;
    };
    philosophy: {
      title: string;
      content: string;
    };
    roles: {
      engineer: string;
      entrepreneur: string;
      innovator: string;
    };
  };
  poems: {
    title: string;
    empty: string;
  };
  memories: {
    title: string;
    empty: string;
  };
  essays: {
    title: string;
    empty: string;
  };
  innovation: {
    title: string;
    empty: string;
  };
  tasting: {
    title: string;
    empty: string;
  };
  contact: {
    title: string;
    description: string;
    info: {
      title: string;
      subtitle: string;
      email: string;
      phone: string;
      address: string;
      social: string;
      getDirections: string;
    };
    form: {
      title: string;
      subtitle: string;
      name: string;
      email: string;
      subject: string;
      message: string;
      send: string;
      success: string;
      successDetail: string;
      error: string;
    };
    collaboration: {
      title: string;
      subtitle: string;
      description: string;
    };
    support: {
      title: string;
      subtitle: string;
      description: string;
    };
  };
  projects: {
    title: string;
    comingSoon: string;
  };
};

export const translations: Record<Language, Translations> = {
  tr: {
    common: {
      siteName: "Uğur Şahan",
      toggleTheme: "Tema değiştir",
      search: "Ara",
      readMore: "Devamını Oku",
      back: "Geri",
      home: "Ana Sayfa",
      loading: "Yükleniyor...",
      error: "Bir hata oluştu"
    },
    nav: {
      about: "Hakkımda",
      writings: "Yazılarım",
      projects: "Projelerim",
      contact: "İletişim",
      title: "Menü",
      poems: "Şiirler",
      memories: "Anılar ve Öyküler",
      essays: "Denemeler",
      innovation: "İnovasyon ve Girişimcilik",
      tasting: "Tadımlar",
      language: {
        switch: "Türkçe'ye geç"
      }
    },
    footer: {
      navigation: "Navigasyon",
      search: "Arama",
      searchPlaceholder: "İçeriklerde ara...",
      rights: "Tüm hakları saklıdır.",
    },
    home: {
      welcome: "Uğur Şahan",
      description: "Yazılım geliştirici ve yazar. Teknoloji, edebiyat ve inovasyon dünyasından yazılar.",
      contact: "İletişim",
      hero: {
        title: "Uğur Şahan",
        subtitle: "Makine Mühendisi, Girişimci & İnovatör",
        description: "1989 yılında İstanbul'da dünyaya geldim. Multidisipliner bir yaklaşımla, mühendislik, girişimcilik ve inovasyon alanlarında sürekli kendini geliştiren bir profesyonel olarak çalışıyorum."
      },
      expertise: {
        title: "Uzmanlık Alanlarım",
        subtitle: "Farklı disiplinlerde edindiğim deneyim ve bilgi birikimi",
        engineering: {
          title: "Mühendislik",
          description: "İstanbul Teknik Üniversitesi Makina Mühendisliği eğitimim ve sektördeki deneyimlerimle, teknik problemlere yenilikçi çözümler üretiyorum."
        },
        entrepreneurship: {
          title: "Girişimcilik",
          description: "Üniversite yıllarımdan itibaren girişimcilik ekosisteminin içinde yer alarak, kendi şirketimi kurma ve yönetme deneyimi kazandım."
        },
        innovation: {
          title: "İnovasyon",
          description: "Sürekli öğrenme ve gelişme odaklı yaklaşımımla, yeni fikirler ve projeler geliştiriyor, teknoloji ve inovasyonu bir araya getiriyorum."
        },
        multidisciplinary: {
          title: "Multidisipliner Yaklaşım",
          description: "Danstan dövüş sporlarına, sanat tarihinden tenise kadar farklı alanlarda kendimi geliştirerek, yaratıcı ve bütünsel bir bakış açısı kazandım."
        },
        software: {
          title: "Yazılım Geliştirme",
          description: "Modern web teknolojileri ile kullanıcı dostu, performanslı ve ölçeklenebilir uygulamalar geliştiriyorum. Full-stack geliştirme deneyimimle, frontend ve backend teknolojilerinde uzmanlaşmış durumdayım."
        },
        design: {
          title: "Tasarım",
          description: "Kullanıcı deneyimini ön planda tutan, modern ve estetik arayüz tasarımları oluşturuyorum. UI/UX prensiplerini göz önünde bulundurarak, kullanıcı odaklı çözümler üretiyorum."
        }
      }
    },
    about: {
      title: "Hakkımda",
      description: "Merhaba, ben Uğur Şahan. Makine mühendisi, girişimci ve inovatör.",
      education: {
        title: "Eğitim & Kariyer",
        content: "1989 yılında İstanbul'da dünyaya geldim. Lise hayatımı İstanbul'un köklü okullarından biri olan Beşiktaş Atatürk Anadolu Lisesinde tamamladıktan sonra İstanbul Teknik Üniversitesi Makina Mühendisliği bölümüne girdim. Üniversitenin ilk yıllarında ülkenin ilk girişimcilerinden biri olarak kendi şirketimi kurdum."
      },
      personal: {
        title: "Kişisel Gelişim",
        content: "Çocukluğumdan itibaren hep idealist, konfor alanını sevmeyen birisi olarak yetiştim. Yıllarca sadece iş hayatımda değil sosyal hayatımda da multidisipliner olmak için elimden gelenin fazlasını yaptım. Danstan dövüş sporlarına, sanat tarihinden tenise hayalimde ne varsa peşinden koştum."
      },
      philosophy: {
        title: "Felsefe",
        content: "\"Sadece bir şeyde uzmanlaşabilirsin; aynı anda farklı alanlarda gelişemezsin\" diye inanmayın! Tamamen köle toplumu, görev adamı yetiştirmek için uydurulmuş bir yalan! Gayet de bir çok konuda uzmanlaşabilirsiniz, yeter ki isteyin. Dünyanın sürekli kendini geliştiren, farklı konulara el atan, okuyan, araştıran kısacası dünya insanı olan bireylere ihtiyacı var."
      },
      roles: {
        engineer: "Makine Mühendisi",
        entrepreneur: "Girişimci",
        innovator: "İnovatör"
      }
    },
    poems: {
      title: "Şiirler",
      empty: "Henüz şiir eklenmemiş"
    },
    memories: {
      title: "Anılar ve Öyküler",
      empty: "Henüz anı eklenmemiş"
    },
    essays: {
      title: "Denemeler",
      empty: "Henüz deneme eklenmemiş"
    },
    innovation: {
      title: "İnovasyon ve Girişimcilik",
      empty: "Henüz içerik eklenmemiş"
    },
    tasting: {
      title: "Tadımlar",
      empty: "Henüz tadım eklenmemiş"
    },
    contact: {
      title: "İletişim",
      description: "Benimle iletişime geçmek için aşağıdaki formu kullanabilir veya iletişim bilgilerimden bana ulaşabilirsiniz.",
      info: {
        title: "İletişim Bilgileri",
        subtitle: "Size en uygun yöntemle iletişime geçebilirsiniz",
        email: "E-posta",
        phone: "Telefon",
        address: "Adres",
        social: "Sosyal Medya",
        getDirections: "Yol Tarifi Al"
      },
      form: {
        title: "İletişim Formu",
        subtitle: "Sorularınız veya önerileriniz için lütfen aşağıdaki formu doldurun. En kısa sürede size dönüş yapacağım.",
        name: "İsim",
        email: "E-posta",
        subject: "Konu",
        message: "Mesaj",
        send: "Gönder",
        success: "Mesajınız başarıyla gönderildi!",
        successDetail: "En kısa sürede size dönüş yapacağım.",
        error: "Mesaj gönderilemedi"
      },
      collaboration: {
        title: "İş Birliği & Projeler",
        subtitle: "Yeni projeler ve iş birlikleri için",
        description: "Yazılım geliştirme, inovasyon projeleri veya iş birlikleri için benimle iletişime geçebilirsiniz."
      },
      support: {
        title: "Teknik Destek",
        subtitle: "Web sitesi ile ilgili",
        description: "Web sitesi ile ilgili teknik sorunlar veya önerileriniz için destek ekibimize ulaşabilirsiniz."
      }
    },
    projects: {
      title: "Projelerim",
      comingSoon: "Projeler sayfası yakında burada olacak. Takip etmeye devam edin!"
    }
  },
  en: {
    common: {
      siteName: "Ugur Sahan",
      toggleTheme: "Toggle theme",
      search: "Search",
      readMore: "Read More",
      back: "Back",
      home: "Home",
      loading: "Loading...",
      error: "An error occurred"
    },
    nav: {
      about: "About",
      writings: "Writings",
      projects: "Projects",
      contact: "Contact",
      title: "Menu",
      poems: "Poems",
      memories: "Memories & Stories",
      essays: "Essays",
      innovation: "Innovation & Entrepreneurship",
      tasting: "Tastings",
      language: {
        switch: "Switch to Turkish"
      }
    },
    footer: {
      navigation: "Navigation",
      search: "Search",
      searchPlaceholder: "Search in contents...",
      rights: "All rights reserved.",
    },
    home: {
      welcome: "Ugur Sahan",
      description: "Software developer and writer. Writings from the world of technology, literature, and innovation.",
      contact: "Contact",
      hero: {
        title: "Ugur Sahan",
        subtitle: "Mechanical Engineer, Entrepreneur & Innovator",
        description: "Born in Istanbul in 1989, I work as a professional who continuously develops himself in engineering, entrepreneurship, and innovation with a multidisciplinary approach."
      },
      expertise: {
        title: "Areas of Expertise",
        subtitle: "Experience and knowledge gained in different disciplines",
        engineering: {
          title: "Engineering",
          description: "With my education in Mechanical Engineering at Istanbul Technical University and industry experience, I develop innovative solutions to technical problems."
        },
        entrepreneurship: {
          title: "Entrepreneurship",
          description: "Since my university years, I have gained experience in establishing and managing my own company by being part of the entrepreneurship ecosystem."
        },
        innovation: {
          title: "Innovation",
          description: "With my continuous learning and development-focused approach, I develop new ideas and projects, bringing together technology and innovation."
        },
        multidisciplinary: {
          title: "Multidisciplinary Approach",
          description: "By developing myself in different areas from dance to martial arts, from art history to tennis, I have gained a creative and holistic perspective."
        },
        software: {
          title: "Software Development",
          description: "I develop user-friendly, performant, and scalable applications using modern web technologies. With my full-stack development experience, I specialize in both frontend and backend technologies."
        },
        design: {
          title: "Design",
          description: "I create modern and aesthetic interface designs that prioritize user experience. By considering UI/UX principles, I produce user-focused solutions."
        }
      }
    },
    about: {
      title: "About Me",
      description: "Hello, I'm Ugur Sahan. Mechanical engineer, entrepreneur and innovator.",
      education: {
        title: "Education & Career",
        content: "I was born in Istanbul in 1989. After completing my high school education at Besiktas Ataturk Anatolian High School, one of Istanbul's established schools, I entered Istanbul Technical University's Mechanical Engineering department. In my early university years, I established my own company as one of the country's first entrepreneurs."
      },
      personal: {
        title: "Personal Development",
        content: "Since my childhood, I have grown up as someone who is idealistic and doesn't like comfort zones. For years, I did more than my best to be multidisciplinary not only in my professional life but also in my social life. I pursued everything in my dreams, from dance to martial arts, from art history to tennis."
      },
      philosophy: {
        title: "Philosophy",
        content: "Don't believe in the saying 'you can only specialize in one thing; you can't develop in different areas at the same time'! It's a complete lie made up to raise slave society and task-oriented people! You can definitely specialize in many subjects, as long as you want to. The world needs individuals who continuously develop themselves, try different subjects, read, research, in short, who are world citizens."
      },
      roles: {
        engineer: "Mechanical Engineer",
        entrepreneur: "Entrepreneur",
        innovator: "Innovator"
      }
    },
    poems: {
      title: "Poems",
      empty: "No poems added yet"
    },
    memories: {
      title: "Memories & Stories",
      empty: "No memories added yet"
    },
    essays: {
      title: "Essays",
      empty: "No essays added yet"
    },
    innovation: {
      title: "Innovation & Entrepreneurship",
      empty: "No content added yet"
    },
    tasting: {
      title: "Tastings",
      empty: "No tastings added yet"
    },
    contact: {
      title: "Contact",
      description: "You can use the form below to get in touch with me or reach me through my contact information.",
      info: {
        title: "Contact Information",
        subtitle: "Get in touch through your preferred method",
        email: "Email",
        phone: "Phone",
        address: "Address",
        social: "Social Media",
        getDirections: "Get Directions"
      },
      form: {
        title: "Contact Form",
        subtitle: "For your questions or suggestions, please fill in the form below. I will get back to you as soon as possible.",
        name: "Name",
        email: "Email",
        subject: "Subject",
        message: "Message",
        send: "Send",
        success: "Your message has been sent successfully!",
        successDetail: "I will get back to you as soon as possible.",
        error: "Message could not be sent"
      },
      collaboration: {
        title: "Collaboration & Projects",
        subtitle: "For new projects and partnerships",
        description: "You can contact me for software development, innovation projects, or partnerships."
      },
      support: {
        title: "Technical Support",
        subtitle: "About the website",
        description: "You can reach our support team for technical issues or suggestions regarding the website."
      }
    },
    projects: {
      title: "Projects",
      comingSoon: "Projects page will be here soon. Stay tuned!"
    }
  }
}; 