import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import React, { useRef, useState, type FormEvent, useEffect, createContext, useContext, useMemo, useCallback } from "react";
import { useInView } from "framer-motion";
import { HeroScene } from "@/components/HeroScene";
import { useScrollOrchestration } from "@/components/ScrollSmoother";
import portraitImg from "@/assets/photo.png";
import projectVelocita from "@/assets/projectVelocita.png";
import projectChrono from "@/assets/projectChrono.png";
import projectAetheric from "@/assets/projectAetheric.png";
import favionImg from "@/assets/avatar.png";
import cvFile from "@/assets/CV_Abdelmonem_Yazid.pdf";
import atosLogo from "@/assets/atos.png";
import oncfLogo from "@/assets/oncf.png";
import dxcLogo from "@/assets/dxc.png";
import heroBgImg from "@/assets/bg.png";
import heroBgImgLight from "@/assets/bg-light.jpg";
import yzdimg from "@/assets/yzd.png";
import ooLogo from "@/assets/oo.svg";
import powerbit from "@/assets/powerbit.png";


import { Mail, MapPin, Phone, MessageCircle, X, Send, Github, Linkedin, Sun, Moon, Globe, ArrowUpRight, Loader2, CheckCircle, ArrowUp } from "lucide-react";
import { FaInstagram, FaDiscord } from "react-icons/fa6";
import emailjs from '@emailjs/browser';

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YAZID Abdelmonem — Data & IA Engineer" },
      {
        name: "description",
        content:
          "Ingénieur Data & IA passionné, concevant des architectures de données et des solutions d'intelligence artificielle avec les technologies cloud de pointe (GCP, AWS, Azure).",
      },
    ],
  }),
  component: Portfolio,
});

// ----- Theme Context -----
type Theme = 'dark' | 'light';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: 'dark',
  toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

// ----- Language Context -----
type Language = 'fr' | 'en';

const LanguageContext = createContext<{
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isTransitioning: boolean;
}>({
  language: 'fr',
  toggleLanguage: () => { },
  t: (key: string) => key,
  isTransitioning: false,
});

export const useLanguage = () => useContext(LanguageContext);

// ----- Translations -----
const translations = {
  fr: {
    nav: { home: "Accueil", about: "À propos", cv: "CV", portfolio: "Portfolio", services: "Services", skills: "Compétences" },
    hero: {
badge: (
  <>
    Disponible pour de nouveaux projets |{" "}
    <span className="text-green-600 dark:text-green-400">
      En recherche d’emploi
    </span>
  </>
),
      title: "Ingénieur",
      titleSpan: "Data & IA",
      desc: "Ingénieur Data & IA passionné, concevant des architectures de données et des solutions d'intelligence artificielle avec les technologies cloud de pointe (GCP, AWS, Azure).",
      contact: "Contactez-moi",
      work: "Voir mon travail",
      projects: "Projets réalisés",
      tech: "Technologies",
      getStarted: "Commencer",
      signatureRole: "Data & IA Engineer",
      techTitle: "Technologies que j'utilise",
      expertise: "Expertise",
      expertiseSkills: [
        "Data Engineering",
        "Machine Learning",
        "Cloud Architecture",
        "AI Solutions",
      ],
      techCount: "Technologies maîtrisées",
      locationTitle: "Localisation",
      locationValue: "Kénitra, Maroc",
      remoteLabel: "Disponible",
      remoteValue: "À distance",
      more: "+ Plus",
    },
    about: {
      label: "À propos de moi",
      title: "Qui suis-je ?",
      p1: "Je suis",
      p1Span: "YAZID Abdelmonem",
      p1End: ", passionné par les technologies de pointe en data et en intelligence artificielle.",
      p2: "Je combine expertise technique et vision stratégique pour transformer des données brutes en insights concrets et en solutions d'IA performantes.",
      p3: "Actuellement ingénieur Data & IA chez Atos, je conçois des Data Factories cloud, des pipelines automatisés et des solutions d'IA générative pour optimiser la prise de décision en entreprise.",
      name: "Nom",
      nameValue: "YAZID Abdelmonem Sied Ahmed",
      age: "Âge",
      ageValue: `${new Date().getFullYear() - 2002} ans`,
      nationality: "Nationalité",
      nationalityValue: "Marocain",
      location: "Lieu",
      locationValue: "Rabat, Maroc",
      languages: "Langues",
      languagesValue: "Français, Anglais, Arabe",
      download: "Télécharger le CV",
    },
    cv: { label: "Parcours", title: "Mon CV", education: "Éducation", experience: "Expérience" },
    portfolio: { label: "Travaux sélectionnés", title: "Mon Portfolio", all: "Tout", view: "Voir le projet", explore: "Explorer" },
    portfolioFilters: {
      "Tout": "Tout",
      "Design Web": "Design Web",
      "Application Web": "Application Web",
      "Application Ai": "Application IA",
    },
    portfolioItems: {
      "Pipeline Boursier Temps Réel": {
        title: "Pipeline de Données Boursières en Temps Réel avec IaC sur AWS",
        category: "Application Ai",
        description: "Architecture d'un pipeline streaming temps réel avec Apache Kafka ; automatisation de l'infrastructure AWS via Terraform ; construction d'un data lake S3 avec Glue et Athena pour l'analytique ad-hoc.",
        features: ["Streaming temps réel avec Kafka", "Infrastructure as Code (Terraform)", "Data Lake S3 avec Glue et Athena", "Analytique ad-hoc"],
      },
      "Pipeline Azure JO de Tokyo": {
        title: "Pipeline Azure Analytique des JO de Tokyo",
        category: "Application Ai",
        description: "Traitement de 11K+ enregistrements via un data lake medallion (ADF + ADLS Gen2) ; transformation avec PySpark sur Databricks et exposition via Synapse + Power BI.",
        features: ["Data lake medallion ADF + ADLS Gen2", "Transformation PySpark (Databricks)", "Exposition via Synapse Analytics", "Power BI"],
      },
      "Maintenance Prédictive Machines": {
        title: "Surveillance de Machines en Temps Réel & Maintenance Prédictive",
        category: "Application Ai",
        description: "Conception d'un pipeline traitant 10K+ enregistrements IoT/min ; développement de modèles ML pour la détection d'anomalies ; orchestration avec Airflow & Docker.",
        features: ["Traitement streaming IoT avec Kafka", "Détection d'anomalies (ML)", "Orchestration Airflow", "Conteneurisation Docker"],
      },
    },
    services: {
      label: "Ce que je fais",
      title: "Mes services",
      items: [
        {
          title: "Ingénierie des données",
          desc: "Construction de Data Factories cloud et de pipelines batch/incrémentaux avec GCP, AWS et Azure, incluant l'orchestration et des architectures medallion reproductibles.",
        },
        {
          title: "Data Warehouse & BI",
          desc: "Conception de Data Warehouses (medallion), d'ETL automatisés et de tableaux de bord Power BI / Tableau pour le suivi des KPI et la prise de décision.",
        },
        {
          title: "IA & Machine Learning",
          desc: "Développement de modèles ML, de détection d'anomalies, de NLP et de solutions d'IA générative (LLM, RAG) pour des cas d'usage analytiques d'entreprise.",
        },
        {
          title: "Streaming temps réel",
          desc: "Architectures de streaming avec Apache Kafka et Spark Streaming pour le traitement de données IoT et financières en temps réel.",
        },
      ],
    },
    skills: {
      label: "Boîte à outils",
      title: "Mes compétences",
      all: "Toutes",
      professional: "Compétences professionnelles",
      categories: {
        "Toutes": "Toutes",
        "Programmation": "Programmation",
        "Big Data & Orchestration": "Big Data & Orchestration",
        "Cloud": "Cloud",
        "IA & ML": "IA & ML",
        "BI & Visualisation": "BI & Visualisation",
        "Bases de données": "Bases de données",
      },
      soft: {
        "Communication": "Communication",
        "Travail d'équipe": "Travail d'équipe",
        "Résolution de problèmes": "Résolution de problèmes",
        "Créativité": "Créativité",
        "Adaptabilité": "Adaptabilité",
      },
    },
    extracurricular: {
      label: "Investissement",
      title: "Activités Extrascolaires",
      items: [
        {
          title: "Enactus INPT – Project Manager",
          desc: "Direction d'équipes pluridisciplinaires dans des projets d'entrepreneuriat social, contribution aux décisions stratégiques et impact communautaire mesurable.",
        },
        {
          title: "Club des Affaires Sociales – Membre Actif",
          desc: "Organisation d'initiatives sociales et d'activités de service communautaire.",
        },
      ],
    },
    social: { label: "Connectons-nous", title: "Mes réseaux sociaux", desc: "Suivez-moi sur mes réseaux sociaux pour découvrir mes projets, mes réflexions et mon quotidien d'ingénieur Data & IA." },
    contact: {
      label: "Contactez-moi",
      title: "Prenez contact",
      desc: "N'hésitez pas à me contacter. Je suis toujours ouvert à discuter de nouveaux projets data & IA, d'idées créatives ou d'opportunités de faire partie de vos visions.",
      phone: "Téléphone",
      email: "Email",
      location: "Lieu",
      locationValue: "Rabat, Maroc",
      name: "Votre nom",
      emailLabel: "Votre Email",
      message: "Votre Message",
      send: "Envoyer le message",
      sending: "Envoi en cours...",
      sent: "Message envoyé ✓",
      error: "Une erreur est survenue. Veuillez réessayer."
    },
    footer: { rights: "Tous droits réservés", brand: "YAZID Abdelmonem", logo: "YAZID Abdelmonem" },
    chat: {
      placeholder: "Posez votre question...",
      online: "En ligne",
      assistantName: "Abdelmonem",
      welcome: "Bonjour ! Je suis l'assistant d'Abdelmonem. Comment puis-je vous aider ?",
    },
    projectDetails: {
      title: "Détails du projet",
      close: "Fermer",
      description: "Description",
      technologies: "Technologies utilisées",
      features: "Fonctionnalités",
    }
  },
  en: {
    nav: { home: "Home", about: "About", cv: "CV", portfolio: "Portfolio", services: "Services", skills: "Skills" },
    hero: {
badge: (
  <>
    Available for new projects |{" "}
    <span className="text-green-600 dark:text-green-400">
      Open to work
    </span>
  </>
),      title: "Engineer in",
      titleSpan: "Data & AI",
      desc: "Passionate Data & AI engineer, designing data architectures and artificial intelligence solutions using cutting-edge cloud technologies (GCP, AWS, Azure).",
      contact: "Contact me",
      work: "View my work",
      projects: "Projects completed",
      tech: "Technologies",
      getStarted: "Get Started",
      signatureRole: "Data & AI Engineer",
      techTitle: "Technologies I use",
      techCount: "Technologies mastered",
      locationTitle: "Location",
      locationValue: "Kénitra, Morocco",
      remoteLabel: "Available",
      remoteValue: "Remotely",
      more: "+ More",
    },
    about: {
      label: "About Me",
      title: "Who am I?",
      p1: "I am",
      p1Span: "YAZID Abdelmonem",
      p1End: ", passionate about cutting-edge data and artificial intelligence technologies.",
      p2: "I combine technical expertise and strategic vision to transform raw data into concrete insights and high-performance AI solutions.",
      p3: "Currently a Data & AI engineer at Atos, I design cloud Data Factories, automated pipelines, and generative AI solutions to optimize business decision-making.",
      name: "Name",
      nameValue: "YAZID Abdelmonem Sied Ahmed",
      age: "Age",
      ageValue: `${new Date().getFullYear() - 2003} years old`,
      nationality: "Nationality",
      nationalityValue: "Moroccan",
      location: "Location",
      locationValue: "Rabat, Morocco",
      languages: "Languages",
      languagesValue: "French, English, Arabic",
      download: "Download CV",
    },
    cv: { label: "Journey", title: "My CV", education: "Education", experience: "Experience" },
    portfolio: { label: "Selected Work", title: "My Portfolio", all: "All", view: "View project", explore: "Explore" },
    portfolioFilters: {
      "Tout": "All",
      "Design Web": "Web Design",
      "Application Web": "Web Application",
      "Application Ai": "AI Application",
    },
    portfolioItems: {
      "Pipeline Boursier Temps Réel": {
        title: "Real-Time Stock Data Pipeline with IaC on AWS",
        category: "Application Ai",
        description: "Real-time streaming pipeline architecture with Apache Kafka; AWS infrastructure automation via Terraform; S3 data lake with Glue and Athena for ad-hoc analytics.",
        features: ["Real-time streaming with Kafka", "Infrastructure as Code (Terraform)", "S3 Data Lake with Glue and Athena", "Ad-hoc analytics"],
      },
      "Pipeline Azure JO de Tokyo": {
        title: "Tokyo Olympics Azure Analytics Pipeline",
        category: "Application Ai",
        description: "Processing 11K+ records through a medallion data lake (ADF + ADLS Gen2); PySpark transformation on Databricks exposed via Synapse + Power BI.",
        features: ["Medallion data lake ADF + ADLS Gen2", "PySpark transformation (Databricks)", "Synapse Analytics exposure", "Power BI"],
      },
      "Maintenance Prédictive Machines": {
        title: "Real-Time Machine Monitoring & Predictive Maintenance",
        category: "Application Ai",
        description: "Pipeline processing 10K+ IoT records/min; ML models for anomaly detection; orchestration with Airflow & Docker.",
        features: ["IoT streaming with Kafka", "Anomaly detection (ML)", "Airflow orchestration", "Docker containerization"],
      },
    },
    services: {
      label: "What I Do",
      title: "My Services",
      items: [
        {
          title: "Data Engineering",
          desc: "Building cloud Data Factories and batch/incremental pipelines with GCP, AWS, and Azure, including orchestration and reproducible medallion architectures.",
        },
        {
          title: "Data Warehouse & BI",
          desc: "Designing Data Warehouses (medallion), automated ETL, and Power BI / Tableau dashboards for KPI tracking and decision-making.",
        },
        {
          title: "AI & Machine Learning",
          desc: "Developing ML models, anomaly detection, NLP, and generative AI solutions (LLM, RAG) for enterprise analytical use cases.",
        },
        {
          title: "Real-Time Streaming",
          desc: "Streaming architectures with Apache Kafka and Spark Streaming for real-time processing of IoT and financial data.",
        },
      ],
    },
    skills: {
      label: "Toolbox",
      title: "My Skills",
      all: "All",
      professional: "Professional Skills",
      categories: {
        "Toutes": "All",
        "Programmation": "Programming",
        "Big Data & Orchestration": "Big Data & Orchestration",
        "Cloud": "Cloud",
        "IA & ML": "AI & ML",
        "BI & Visualisation": "BI & Visualization",
        "Bases de données": "Databases",
      },
      soft: {
        "Communication": "Communication",
        "Travail d'équipe": "Teamwork",
        "Résolution de problèmes": "Problem Solving",
        "Créativité": "Creativity",
        "Adaptabilité": "Adaptability",
      },
    },
    extracurricular: {
      label: "Involvement",
      title: "Extracurricular Activities",
      items: [
        {
          title: "Enactus INPT – Project Manager",
          desc: "Leading multidisciplinary teams in social entrepreneurship projects, contributing to strategic decisions and measurable community impact.",
        },
        {
          title: "Club des Affaires Sociales – Active Member",
          desc: "Organizing social initiatives and community service activities.",
        },
      ],
    },
    social: { label: "Let's Connect", title: "My Social Networks", desc: "Follow me on social media to discover my projects, thoughts, and daily life as a Data & AI engineer." },
    contact: {
      label: "Contact Me",
      title: "Get in Touch",
      desc: "Feel free to contact me. I'm always open to discussing new data & AI projects, creative ideas, or opportunities to be part of your vision.",
      phone: "Phone",
      email: "Email",
      location: "Location",
      locationValue: "Rabat, Morocco",
      name: "Your name",
      emailLabel: "Your Email",
      message: "Your Message",
      send: "Send message",
      sending: "Sending...",
      sent: "Message sent ✓",
      error: "An error occurred. Please try again."
    },
    footer: { rights: "All rights reserved", brand: "YAZID Abdelmonem", logo: "YAZID" },
    chat: {
      placeholder: "Ask your question...",
      online: "Online",
      assistantName: "Abdelmonem",
      welcome: "Hello! I'm Abdelmonem's assistant. How can I help you?",
    },
    projectDetails: {
      title: "Project Details",
      close: "Close",
      description: "Description",
      technologies: "Technologies used",
      features: "Features",
    }
  }
};

// ----- Data -----
const navLinks = [
  { href: "home", key: "home" },
  { href: "about", key: "about" },
  { href: "cv", key: "cv" },
  { href: "portfolio", key: "portfolio" },
  { href: "services", key: "services" },
  { href: "skills", key: "skills" },
] as const;

const education = [
  {
    period: {
      fr: "Sept. 2023 – Juil. 2026",
      en: "Sep 2023 – Jul 2026",
    },
    title: {
      fr: "Diplôme d'Ingénieur en Ingénierie des Données",
      en: "Engineering Degree in Data Engineering",
    },
    place: {
      fr: "Institut National des Postes et Télécommunications (INPT) — Rabat",
      en: "National Institute of Posts and Telecommunications (INPT) — Rabat",
    },
    desc: {
      fr: "Formation d'ingénieur spécialisée en ingénierie des données : pipelines, data warehouses, big data, cloud et intelligence artificielle.",
      en: "Engineering training specialized in data engineering: pipelines, data warehouses, big data, cloud, and artificial intelligence.",
    },
  },
  {
    period: {
      fr: "Sept. 2021 – Juil. 2023",
      en: "Sep 2021 – Jul 2023",
    },
    title: {
      fr: "Classes Préparatoires (TSI)",
      en: "Preparatory Classes (TSI)",
    },
    place: {
      fr: "Lycée Préparatoire Salmane Al-Farissi — Salé",
      en: "Salmane Al-Farissi Preparatory High School — Salé",
    },
    desc: {
      fr: "Classes préparatoires technologiques (sciences et techniques industrielles) préparant aux concours des grandes écoles d'ingénieurs.",
      en: "Technological preparatory classes (TSI) preparing for competitive entrance exams to engineering schools.",
    },
  },
];

const experience = [
  {
    period: { fr: "Fév. 2026 – Présent", en: "Feb 2026 – Present" },
    title: {
      fr: "Ingénieur Data & IA",
      en: "Data & AI Engineer",
    },
    place: {
      fr: "Atos — Casablanca",
      en: "Atos — Casablanca",
    },
    logo: atosLogo,
    tech: ["GCP (BigQuery, Cloud Storage)", "dbt", "Tableau", "LLM/GenAI"],
    desc: {
      fr: "Construction d'une Data Factory GCP centralisant l'ingestion et orchestrant des pipelines batch/incrémentaux avec Cloud Storage, BigQuery et dbt, incluant des modèles reproductibles et des MARTS prêts pour la BI. Contribution à un projet d'innovation en IA générative intégrant des capacités LLM dans un environnement analytique d'entreprise.",
      en: "Building a GCP Data Factory centralizing ingestion and orchestrating batch/incremental pipelines with Cloud Storage, BigQuery, and dbt, including reproducible models and BI-ready MARTS. Contributing to a generative AI innovation project integrating LLM capabilities into an enterprise analytical environment.",
    },
  },
  {
    period: { fr: "Juil. 2025 – Août 2025", en: "Jul 2025 – Aug 2025" },
    title: {
      fr: "Data Engineer",
      en: "Data Engineer",
    },
    place: {
      fr: "ONCF — Rabat",
      en: "ONCF — Rabat",
    },
    logo: oncfLogo,
    tech: ["SQL Server", "Power BI", "Data Warehouse", "Architecture Medallion", "ETL"],
    desc: {
      fr: "Conception d'un Data Warehouse avec Architecture Medallion (Bronze-Silver-Gold) intégrant les données opérationnelles ferroviaires depuis des sources OLTP. Développement de pipelines ETL automatisés et de tableaux de bord Power BI pour les KPI, réduisant les rapports manuels de 70% et la latence de 30%.",
      en: "Designing a Data Warehouse with Medallion architecture (Bronze-Silver-Gold) integrating railway operational data from OLTP sources. Developing automated ETL pipelines and Power BI dashboards for KPIs, reducing manual reports by 70% and latency by 30%.",
    },
  },
  {
    period: { fr: "Juin 2024", en: "Jun 2024" },
    title: {
      fr: "Data Analyst",
      en: "Data Analyst",
    },
    place: {
      fr: "DXC Technology — Rabat",
      en: "DXC Technology — Rabat",
    },
    logo: dxcLogo,
    tech: ["Python", "Selenium", "BeautifulSoup", "NLP", "Power BI"],
    desc: {
      fr: "Automatisation de l'extraction de données à grande échelle avec Selenium et BeautifulSoup ; développement d'un modèle NLP de sentiment avec 79% de précision. Création d'un tableau de bord Power BI interactif réduisant le temps d'analyse des parties prenantes de 50%.",
      en: "Automating large-scale data extraction with Selenium and BeautifulSoup; developing an NLP sentiment model with 79% accuracy. Creating an interactive Power BI dashboard reducing stakeholder analysis time by 50%.",
    },
  },
];

const portfolio = [
  {
    key: "Pipeline Boursier Temps Réel",
    image: projectVelocita,
    technologies: ["Apache Kafka", "AWS", "Terraform", "Python"],
  },
  {
    key: "Pipeline Azure JO de Tokyo",
    image: projectChrono,
    technologies: ["Azure Data Factory", "Databricks", "PySpark", "Power BI"],
  },
  {
    key: "Maintenance Prédictive Machines",
    image: projectAetheric,
    technologies: ["Apache Kafka", "Spark Streaming", "Airflow", "Docker", "ML"],
  },
] as const;

// Internal (non-translated) category keys used for filtering logic
const portfolioFilterKeys = ["Tout", "Application Ai"] as const;

const techSkills: { name: string; cat: string; icon: string; mono?: boolean }[] = [
  {
    name: "Python",
    cat: "Programmation",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "SQL",
    cat: "Programmation",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "Scala",
    cat: "Programmation",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
  },
  {
    name: "Java",
    cat: "Programmation",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    name: "Spark",
    cat: "Big Data & Orchestration",
    icon: "https://www.vectorlogo.zone/logos/apache_spark/apache_spark-icon.svg",
  },
  {
    name: "Kafka",
    cat: "Big Data & Orchestration",
    icon: "https://www.vectorlogo.zone/logos/apache_kafka/apache_kafka-icon.svg",
    mono: true,
  },
{
  name: "Hive",
  cat: "Big Data & Orchestration",
  icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/apachehive.svg",
  mono: true,
},
  {
    name: "Hadoop",
    cat: "Big Data & Orchestration",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hadoop/hadoop-original.svg",
  },
  {
    name: "Airflow",
    cat: "Big Data & Orchestration",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apacheairflow/apacheairflow-original.svg",
  },
  {
    name: "dbt",
    cat: "Big Data & Orchestration",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/dbt.svg",
    mono: true,
  },
  {
    name: "Databricks",
    cat: "Big Data & Orchestration",
    icon: "https://cdn-icons-png.flaticon.com/512/2236/2236575.png",
  },
  {
    name: "GCP",
    cat: "Cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
  },
{
  name: "AWS",
  cat: "Cloud",
  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  mono: true,
},
  {
    name: "Azure",
    cat: "Cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  },
  {
    name: "BigQuery",
    cat: "Cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
  },
  {
    name: "Terraform",
    cat: "Cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
  },
  {
    name: "Scikit-learn",
    cat: "IA & ML",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
{
  name: "LangChain",
  cat: "IA & ML",
  icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/langchain.svg",
  mono: true,
},
  {
    name: "LLM / GenAI",
    cat: "IA & ML",
    icon: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
  },
  {
    name: "Deep Learning",
    cat: "IA & ML",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  },
  {
    name: "NLP",
    cat: "IA & ML",
    icon: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
  },
  {
    name: "PostgreSQL",
    cat: "Bases de données",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "MongoDB",
    cat: "Bases de données",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "Cassandra",
    cat: "Bases de données",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cassandra/cassandra-original.svg",
  },
  {
    name: "Power BI",
    cat: "BI & Visualisation",
    icon: powerbit,
  },
{
    name: "Tableau",
    cat: "BI & Visualisation",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tableau.svg",
    mono: true,
  },
  {
    name: "Streamlit",
    cat: "BI & Visualisation",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/streamlit/streamlit-original.svg",
  },
{
  name: "Looker",
  cat: "BI & Visualisation",
  icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/looker.svg",
  mono: true,
},
  {
    name: "Docker",
    cat: "Cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "Git",
    cat: "Cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
];

// Internal (non-translated) category keys used for filtering logic
const skillCategoryKeys = [
  "Toutes",
  "Programmation",
  "Big Data & Orchestration",
  "Cloud",
  "IA & ML",
  "BI & Visualisation",
  "Bases de données",
] as const;

const softSkillKeys = [
  { key: "Communication", value: 50 },
  { key: "Travail d'équipe", value: 50 },
  { key: "Résolution de problèmes", value: 50 },
  { key: "Créativité", value: 50 },
  { key: "Adaptabilité", value: 50 },
] as const;

// ----- Social Media Data -----
const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/yzdpirate28",
    icon: Github,
    color:
      "hover:bg-[#181717] hover:text-white",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/yazid-abdelmonem",
    icon: Linkedin,
    color:
      "hover:bg-[#0A66C2] hover:text-white",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/andiamyazid/",
    icon: FaInstagram,
    color:
      "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#FCAF45] hover:text-white",
  },
  {
    name: "Discord",
    url: "https://discord.com/users/yzdlaflamee",
    icon: FaDiscord,
    color:
      "hover:bg-[#5865F2] hover:text-white",
  },
];

// ----- Chatbot System Prompt -----
const CHATBOT_SYSTEM_PROMPT = {
  fr: `Tu es l'assistant virtuel de YAZID Abdelmonem Sied Ahmed, ingénieur Data & IA. 
Tu dois répondre aux questions sur son parcours, ses compétences, ses projets et ses coordonnées.
Voici les informations clés :
- Nom : YAZID Abdelmonem Sied Ahmed
- Titre : Data & IA Engineer
- Nationalité : Marocain
- Localisation : Rabat, Maroc
- Langues : Arabe (natif), Français (C1), Anglais (C1)
- Formation : Diplôme d'Ingénieur en Ingénierie des Données (INPT, Rabat, 2023-2026), Classes Préparatoires TSI (Salé, 2021-2023)
- Expérience : Ingénieur Data & IA chez Atos (depuis Fév. 2026), Data Engineer chez ONCF (2025), Data Analyst chez DXC Technology (2024)
- Compétences : Python, SQL, Spark, Kafka, dbt, Airflow, BigQuery, AWS, Azure, LLM/GenAI, RAG, Power BI, Tableau, Terraform, Docker
- Projets : Pipeline de données boursières en temps réel (AWS/Kafka/Terraform), Pipeline Azure analytique des JO de Tokyo, Surveillance de machines & maintenance prédictive
- Téléphone : +212 693656266
- Email : abdelmonem.yazid@gmail.com
- GitHub : https://github.com/yzdpirate28
- LinkedIn : https://www.linkedin.com/in/yazid-abdelmonem

Réponds de manière naturelle, professionnelle et en français. Si tu ne connais pas la réponse, propose de contacter YAZID directement.`,
  en: `You are YAZID Abdelmonem Sied Ahmed's virtual assistant, a Data & AI engineer.
You must answer questions about his background, skills, projects, and contact information.
Key information:
- Name: YAZID Abdelmonem Sied Ahmed
- Title: Data & AI Engineer
- Nationality: Moroccan
- Location: Rabat, Morocco
- Languages: Arabic (native), French (C1), English (C1)
- Education: Engineering Degree in Data Engineering (INPT, Rabat, 2023-2026), TSI Preparatory Classes (Salé, 2021-2023)
- Experience: Data & AI Engineer at Atos (since Feb 2026), Data Engineer at ONCF (2025), Data Analyst at DXC Technology (2024)
- Skills: Python, SQL, Spark, Kafka, dbt, Airflow, BigQuery, AWS, Azure, LLM/GenAI, RAG, Power BI, Tableau, Terraform, Docker
- Projects: Real-time stock data pipeline (AWS/Kafka/Terraform), Tokyo Olympics Azure analytics pipeline, Real-time machine monitoring & predictive maintenance
- Phone: +212 693656266
- Email: abdelmonem.yazid@gmail.com
- GitHub: https://github.com/yzdpirate28
- LinkedIn: https://www.linkedin.com/in/yazid-abdelmonem

Answer naturally, professionally, and in English. If you don't know the answer, suggest contacting YAZID directly.`
};

// ----- Groq API Function -----
async function getGroqResponse(userMessage: string, language: Language): Promise<string> {
  const GROQ_API_KEY = "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";
  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: CHATBOT_SYSTEM_PROMPT[language],
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API Error:", errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Groq API Request Failed:", error);
    return getLocalResponse(userMessage, language);
  }
}

// ----- Chatbot Local Fallback Responses -----
const chatbotResponses = {
  fr: {
    "bonjour": "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    "salut": "Salut ! Ravi de vous parler. Que puis-je faire pour vous ?",
    "qui es-tu": "Je suis l'assistant virtuel de YAZID Abdelmonem, ingénieur Data & IA.",
    "abdelmonem": `YAZID Abdelmonem Sied Ahmed est un ingénieur Data & IA basé à Rabat, Maroc, actuellement chez Atos.`,
    "yazid": `YAZID Abdelmonem Sied Ahmed est un ingénieur Data & IA basé à Rabat, Maroc, actuellement chez Atos.`,
    "formation": "Il est diplômé en Ingénierie des Données de l'INPT (Rabat, 2023-2026), après des classes préparatoires TSI à Salé.",
    "experience": "YAZID travaille actuellement comme Ingénieur Data & IA chez Atos. Il a aussi été Data Engineer chez ONCF et Data Analyst chez DXC Technology.",
    "projet": "Ses principaux projets : Pipeline de données boursières en temps réel (AWS/Kafka/Terraform), Pipeline Azure des JO de Tokyo, et maintenance prédictive de machines.",
    "contact": "Vous pouvez le contacter par email à abdelmonem.yazid@gmail.com ou au +212 693656266.",
    "github": "Son GitHub est disponible ici : https://github.com/yzdpirate28",
    "linkedin": "Son LinkedIn : https://www.linkedin.com/in/yazid-abdelmonem",
    default: "Je suis désolé, je n'ai pas bien compris. Pouvez-vous reformuler votre question ? Vous pouvez aussi contacter YAZID directement."
  },
  en: {
    "hello": "Hello! How can I help you today?",
    "hi": "Hi there! Happy to chat. What can I do for you?",
    "who are you": "I'm YAZID Abdelmonem's virtual assistant, a Data & AI engineer.",
    "abdelmonem": `YAZID Abdelmonem Sied Ahmed is a Data & AI engineer based in Rabat, Morocco, currently at Atos.`,
    "yazid": `YAZID Abdelmonem Sied Ahmed is a Data & AI engineer based in Rabat, Morocco, currently at Atos.`,
    "education": "He holds an Engineering Degree in Data Engineering from INPT (Rabat, 2023-2026), after TSI preparatory classes in Salé.",
    "experience": "YAZID currently works as a Data & AI Engineer at Atos. He also worked as a Data Engineer at ONCF and a Data Analyst at DXC Technology.",
    "project": "His main projects: real-time stock data pipeline (AWS/Kafka/Terraform), Tokyo Olympics Azure pipeline, and predictive machine maintenance.",
    "contact": "You can reach him at abdelmonem.yazid@gmail.com or +212 693656266.",
    "github": "His GitHub is here: https://github.com/yzdpirate28",
    "linkedin": "His LinkedIn: https://www.linkedin.com/in/yazid-abdelmonem",
    default: "Sorry, I didn't quite catch that. Could you rephrase your question? You can also contact YAZID directly."
  }
} as const;

function getLocalResponse(userInput: string, language: Language): string {
  const lowerInput = userInput.toLowerCase();
  const responses = chatbotResponses[language];

  for (const [key, response] of Object.entries(responses)) {
    if (lowerInput.includes(key)) {
      return response;
    }
  }
  return responses.default;
}

// ----- Composant Reveal optimisé -----
function Reveal({
  children,
  delay = 0,
  className = "",
  once = true,
  threshold = 0.1
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin: "-50px"
  });

  if (isInView && !hasAnimated.current) {
    hasAnimated.current = true;
  }

  const visible = once ? hasAnimated.current : isInView;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.19, 1, 0.22, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ----- Composant Image avec Lazy Loading optimisé -----
function OptimizedImage({
  src,
  alt,
  className = "",
  theme,
  aspectRatio = "auto"
}: {
  src: string;
  alt: string;
  className?: string;
  theme: Theme;
  aspectRatio?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "100px" });
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (isInView) {
      setShouldLoad(true);
    }
  }, [isInView]);

  useEffect(() => {
    if (shouldLoad) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setIsLoaded(true); // Fallback
    }
  }, [shouldLoad, src]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${
        aspectRatio === "auto" ? "h-full w-full" : ""
      }`}
      style={aspectRatio === "auto" ? undefined : { aspectRatio }}
    >
      {!isLoaded && shouldLoad && (
        <div className={`absolute inset-0 animate-pulse ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`} />
      )}
      {!shouldLoad && (
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`} />
      )}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}

// ----- Composant Scroll To Top Button -----
function ScrollToTopButton({ theme }: { theme: Theme }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          onClick={scrollToTop}
          className={`fixed bottom-24 right-7 z-40 flex h-13 w-13 items-center justify-center rounded-full p-1.5 shadow-2xl transition-all hover:scale-110 ${theme === 'dark'
            ? 'bg-white text-black hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]'
            : 'bg-black text-white hover:shadow-[0_0_40px_rgba(0,0,0,0.2)]'
            }`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
// ----- Composant PortfolioCard optimisé -----
const PortfolioCard = React.memo(({
  project,
  info,
  theme,
  t,
  onOpen,
  getPortfolioFilterLabel,
  index
}: {
  project: typeof portfolio[number];
  info: any;
  theme: Theme;
  t: (key: string) => string;
  onOpen: () => void;
  getPortfolioFilterLabel: (key: string) => string;
  index: number;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <motion.div
      whileHover="hover"
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-2xl ring-1 h-full cursor-pointer transition-all duration-500 ${theme === 'dark'
        ? 'ring-white/5 bg-zinc-900/50 hover:ring-white/20'
        : 'ring-black/5 bg-gray-50/50 hover:ring-black/20'
        }`}
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: (index % 6) * 0.05,
        ease: [0.19, 1, 0.22, 1]
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <OptimizedImage
          src={project.image}
          alt={info.title}
          
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          theme={theme}
          aspectRatio="4/3"
        />

        <div className="absolute top-4 left-4">
          <span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wider uppercase backdrop-blur-xl ${theme === 'dark'
            ? 'bg-black/60 text-white/90 border border-white/10'
            : 'bg-white/80 text-black/90 border border-black/10'
            }`}>
            {getPortfolioFilterLabel(info.category)}
          </span>
        </div>

        <motion.div
          variants={{ hover: { opacity: 1 } }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        />
      </div>

      <div className="p-6 space-y-3">
        <h3 className={`font-display text-xl font-medium leading-tight ${theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
          {info.title}
        </h3>

        <p className={`text-sm leading-relaxed line-clamp-2 ${theme === 'dark' ? 'text-white/60' : 'text-black/60'
          }`}>
          {info.description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className={`px-2.5 py-1 rounded-full text-[9px] font-medium tracking-wide ${theme === 'dark'
                ? 'bg-white/5 text-white/50 border border-white/5'
                : 'bg-black/5 text-black/50 border border-black/5'
                }`}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className={`px-2.5 py-1 rounded-full text-[9px] font-medium ${theme === 'dark'
              ? 'text-white/40'
              : 'text-black/40'
              }`}>
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <motion.div
          variants={{ hover: { x: 0, opacity: 1 } }}
          initial={{ x: -8, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="pt-2"
        >
          <span className={`inline-flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3 ${theme === 'dark' ? 'text-white/80' : 'text-black/80'
            }`}>
            {t('portfolio.explore')}
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </motion.div>
      </div>

      <motion.div
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
            }, transparent 60%)`,
        }}
      />
    </motion.div>
  );
});

PortfolioCard.displayName = 'PortfolioCard';

// ----- Composant Principal -----
function Portfolio() {
  useScrollOrchestration();
  const portraitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: portraitRef,
    offset: ["start end", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["-40px", "40px"]);

  const vantaRef = useRef<HTMLDivElement>(null);

  const [portfolioFilter, setPortfolioFilter] = useState<(typeof portfolioFilterKeys)[number]>("Tout");
  const [skillFilter, setSkillFilter] = useState<(typeof skillCategoryKeys)[number]>("Toutes");
  const [navOpen, setNavOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('fr');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof portfolio[number] | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Translation function with useMemo
  const t = useMemo(() => {
    return (key: string): string => {
      const keys = key.split('.');
      let current: any = translations[language];
      for (const k of keys) {
        if (current && current[k] !== undefined) {
          current = current[k];
        } else {
          return key;
        }
      }
      return current as string;
    };
  }, [language]);

  const heroTech = useMemo(() => {
    const order = ["Python", "SQL", "Power BI", "AWS", "Azure", "GCP", "Docker"];
    return order
      .map((n) => techSkills.find((s) => s.name === n))
      .filter((s): s is (typeof techSkills)[number] => Boolean(s));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const toggleLanguage = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, 300);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);

    document.title = "YAZID Abdelmonem - Portfolio";

    let favicon = document.querySelector(
      "link[rel='icon']"
    ) as HTMLLinkElement | null;

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    favicon.href = favionImg;
    favicon.type = "image/png";

    let appleIcon = document.querySelector(
      "link[rel='apple-touch-icon']"
    ) as HTMLLinkElement | null;

    if (!appleIcon) {
      appleIcon = document.createElement("link");
      appleIcon.rel = "apple-touch-icon";
      document.head.appendChild(appleIcon);
    }

    appleIcon.href = favionImg;
  }, [theme]);



  useEffect(() => {
    setMessages([{ text: t('chat.welcome'), sender: 'bot' }]);
  }, [t]);

  const visibleProjects = useMemo(() => {
    if (portfolioFilter === "Tout") return portfolio;
    return portfolio.filter((p) => translations.fr.portfolioItems[p.key].category === portfolioFilter);
  }, [portfolioFilter]);

  const visibleSkills = useMemo(() => {
    if (skillFilter === "Toutes") return techSkills;
    return techSkills.filter((s) => s.cat === skillFilter);
  }, [skillFilter]);

  const getProjectInfo = useCallback((key: string) => {
    type ProjectKey = keyof typeof translations.fr.portfolioItems;
    const projectKey = key as ProjectKey;
    return translations[language].portfolioItems[projectKey];
  }, [language]);

  const getPortfolioFilterLabel = useCallback((key: string) => {
    type FilterKey = keyof typeof translations.fr.portfolioFilters;
    const filterKey = key as FilterKey;
    return translations[language].portfolioFilters[filterKey] || key;
  }, [language]);

  const getSkillCategoryLabel = useCallback((key: string) => {
    type CategoryKey = keyof typeof translations.fr.skills.categories;
    const categoryKey = key as CategoryKey;
    return translations[language].skills.categories[categoryKey] || key;
  }, [language]);

  const getSoftSkillLabel = useCallback((key: string) => {
    type SoftKey = keyof typeof translations.fr.skills.soft;
    const softKey = key as SoftKey;
    return translations[language].skills.soft[softKey] || key;
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    try {
      const botResponse = await getGroqResponse(userMessage, language);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      const fallbackResponse = getLocalResponse(userMessage, language);
      setMessages(prev => [...prev, { text: fallbackResponse, sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, language]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setNavOpen(false);
  }, []);

  const openProjectModal = useCallback((project: typeof portfolio[number]) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeProjectModal = useCallback(() => {
    setIsProjectModalOpen(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setSelectedProject(null), 300);
  }, []);

  const themeValue = { theme, toggleTheme };
  const languageValue = { language, toggleLanguage, t, isTransitioning };

  const getNavLabel = useCallback((key: string) => t(`nav.${key}`), [t]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <LanguageContext.Provider value={languageValue}>
        <div className={`relative min-h-screen overflow-x-hidden ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
          <AnimatePresence>
            {isTransitioning && (
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isProjectModalOpen && selectedProject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                onClick={closeProjectModal}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 50 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.19, 1, 0.22, 1],
                    type: "spring",
                    damping: 25,
                    stiffness: 300
                  }}
                  className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={`rounded-3xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-zinc-950' : 'bg-white'
                    }`}>
                    <button
                      onClick={closeProjectModal}
                      aria-label={t('projectDetails.close')}
                      className={`absolute top-6 right-6 z-10 rounded-full p-3 transition-all hover:scale-110 ${theme === 'dark'
                        ? 'bg-black/60 text-white hover:bg-black/80'
                        : 'bg-white/60 text-black hover:bg-white/80'
                        } backdrop-blur-xl border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'
                        }`}
                    >
                      <X size={24} />
                    </button>

<div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">

{/* IMAGE */}
<div className="relative h-[400px] lg:h-[650px] overflow-hidden bg-black/20">
  <OptimizedImage
    src={selectedProject.image}
    alt={getProjectInfo(selectedProject.key).title}
    className="w-full h-full object-cover"
    theme={theme}
    aspectRatio="auto"
  />

  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

  <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8">
    <span
      className={`inline-block px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase ${
        theme === "dark"
          ? "bg-white/20 text-white backdrop-blur-xl"
          : "bg-black/20 text-white backdrop-blur-xl"
      }`}
    >
      {getPortfolioFilterLabel(
        getProjectInfo(selectedProject.key).category
      )}
    </span>
  </div>
</div>

                      <div className="p-8 lg:p-12 space-y-6">
                        <motion.h2
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                          className={`font-display text-3xl lg:text-4xl font-medium leading-tight ${theme === 'dark' ? 'text-white' : 'text-black'
                            }`}
                        >
                          {getProjectInfo(selectedProject.key).title}
                        </motion.h2>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className={`space-y-4 ${theme === 'dark' ? 'text-white/70' : 'text-black/70'
                            }`}
                        >
                          <div>
                            <h3 className={`text-sm font-semibold tracking-wider uppercase mb-2 ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                              }`}>
                              {t('projectDetails.description')}
                            </h3>
                            <p className="text-base leading-relaxed">
                              {getProjectInfo(selectedProject.key).description}
                            </p>
                          </div>

                          <div>
                            <h3 className={`text-sm font-semibold tracking-wider uppercase mb-2 ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                              }`}>
                              {t('projectDetails.technologies')}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${theme === 'dark'
                                    ? 'bg-white/10 text-white/80'
                                    : 'bg-black/10 text-black/80'
                                    }`}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className={`text-sm font-semibold tracking-wider uppercase mb-2 ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                              }`}>
                              {t('projectDetails.features')}
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {getProjectInfo(selectedProject.key).features.map((feature: string) => (
                                <li
                                  key={feature}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-white/40' : 'bg-black/40'
                                    }`} />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`pointer-events-none fixed inset-0 ${theme === 'dark' ? 'spotlight-gradient' : 'bg-gray-50/50'}`} />

          {/* Navbar */}
          <nav className="fixed top-5 left-0 z-50 w-full px-4">
            <div className="mx-auto max-w-7xl">
              <div className={`flex items-center justify-between rounded-full border px-6 py-4 backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.08)] ${theme === 'dark'
                ? 'border-white/10 bg-black/60'
                : 'border-black/10 bg-white/80'
                }`}>
                <motion.a
                  onClick={() => scrollToSection('home')}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <img
                    src={ooLogo}
                    alt="yazid"
                    loading="lazy"
                    className="h-11 w-11 object-contain dark:invert"
                  />
                  <span className={`font-display uppercase leading-none font-semibold tracking-tight text-balance ${theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                    yazid
                  </span>
                </motion.a>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="hidden lg:flex items-center gap-8"
                >
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => scrollToSection(link.href)}
                      className={`relative uppercase text-sm font-medium transition hover:text-ink after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-ink after:transition-all after:duration-300 hover:after:w-full ${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'
                        }`}
                    >
                      {getNavLabel(link.key)}
                    </button>
                  ))}
                </motion.div>

                <div className="hidden lg:flex items-center gap-4">
                  <button
                    onClick={toggleLanguage}
                    disabled={isTransitioning}
                    className={`flex items-center gap-1 rounded-full border px-3 py-2 transition hover:scale-105 ${isTransitioning ? 'cursor-not-allowed opacity-50' : ''
                      } ${theme === 'dark'
                        ? 'border-white/15 text-white hover:border-white/40 hover:bg-white/5'
                        : 'border-black/15 text-black hover:border-black/40 hover:bg-black/5'
                      }`}
                  >
                    <Globe size={18} />
                    <span className="text-xs font-medium">
                      {language === 'fr' ? 'FR' : 'EN'}
                    </span>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className={`rounded-full border px-3 py-2 transition hover:scale-105 ${theme === 'dark'
                      ? 'border-white/15 text-white hover:border-white/40 hover:bg-white/5'
                      : 'border-black/15 text-black hover:border-black/40 hover:bg-black/5'
                      }`}
                  >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className={`rounded-full px-7 py-3 text-sm font-semibold shadow-[0_0_25px_rgba(255,255,255,0.4)] transition hover:scale-105 ${theme === 'dark'
                      ? 'bg-white text-black hover:shadow-[0_0_35px_rgba(255,255,255,0.6)]'
                      : 'bg-black text-white hover:shadow-[0_0_35px_rgba(0,0,0,0.6)]'
                      }`}
                  >
                    {t('hero.getStarted')}
                  </button>
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                  <button
                    onClick={toggleLanguage}
                    disabled={isTransitioning}
                    className={`flex items-center gap-1 rounded-full border px-2 py-1.5 text-xs transition ${isTransitioning ? 'cursor-not-allowed opacity-50' : ''
                      } ${theme === 'dark'
                        ? 'border-white/10 text-white hover:bg-white/5'
                        : 'border-black/10 text-black hover:bg-black/5'
                      }`}
                  >
                    <Globe size={18} />
                    <span className="font-medium">
                      {language === 'fr' ? 'FR' : 'EN'}
                    </span>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className={`rounded-full border p-2 transition ${theme === 'dark'
                      ? 'border-white/10 text-white hover:bg-white/5'
                      : 'border-black/10 text-black hover:bg-black/5'
                      }`}
                  >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                  <button
                    onClick={() => setNavOpen((v) => !v)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${theme === 'dark'
                      ? 'border-white/10 hover:bg-white/5'
                      : 'border-black/10 hover:bg-black/5'
                      }`}
                  >
                    <svg
                      className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {navOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 rounded-3xl border p-6 backdrop-blur-xl lg:hidden ${theme === 'dark'
                    ? 'border-white/10 bg-black/95'
                    : 'border-black/10 bg-white/95'
                    }`}
                >
                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <button
                        key={link.href}
                        onClick={() => scrollToSection(link.href)}
                        className={`text-left transition hover:pl-2 ${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'
                          }`}
                      >
                        {getNavLabel(link.key)}
                      </button>
                    ))}
                    <div className="mt-4 flex flex-col gap-3">
                      <button
                        onClick={() => scrollToSection('contact')}
                        className={`rounded-full border py-3 text-center transition ${theme === 'dark'
                          ? 'border-white/15 text-white hover:bg-white/5'
                          : 'border-black/15 text-black hover:bg-black/5'
                          }`}
                      >
                        {t('hero.contact')}
                      </button>
                      <button
                        onClick={() => scrollToSection('contact')}
                        className={`rounded-full py-3 text-center font-semibold ${theme === 'dark'
                          ? 'bg-white text-black'
                          : 'bg-black text-white'
                          }`}
                      >
                        {t('hero.getStarted')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </nav>

          {/* Hero Section */}
          <section
            id="home"
            ref={vantaRef}
            className="relative flex min-h-screen flex-col items-center justify-center pt-[140px] pb-18 overflow-x-hidden"
          >
            <div className="pointer-events-none absolute inset-0 z-0">
            <img
              src={theme === 'dark' ? heroBgImg : heroBgImgLight}
              alt="Hero background"
                aria-hidden="true"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className={`absolute inset-0 ${
                theme === 'dark'
                  ? 'bg-black/70'
                  : 'bg-white/60'
              }`} />
            </div>

            <div className="z-10 px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={`mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-xl ${theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-black/10 bg-black/5'
                  }`}
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                <span
                  className={`text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-white/70' : 'text-black/70'
                    }`}
                >
                  {t('hero.badge')}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 1.2,
                  ease: [0.19, 1, 0.22, 1],
                  delay: 0.1
                }}
                className={`mb-8 font-display text-balance text-5xl font-semibold leading-none tracking-tight sm:text-7xl lg:text-8xl ${theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
              >
                {t('hero.title')}
                <br />
                <span
                  className={`font-light italic ${theme === 'dark' ? 'text-white/70' : 'text-black/70'
                    }`}
                >
                  {t('hero.titleSpan')}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className={`mx-auto max-w-[48ch] text-pretty text-base sm:text-lg ${theme === 'dark' ? 'text-white/70' : 'text-black/70'
                  }`}
              >
                {t('hero.desc')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <motion.button
                  onClick={() => scrollToSection('contact')}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`rounded-full px-6 py-3 text-sm font-medium ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                    }`}
                >
                  {t('hero.contact')}
                </motion.button>

                <motion.button
                  onClick={() => scrollToSection('portfolio')}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`rounded-full border px-6 py-3 text-sm font-medium transition ${theme === 'dark'
                    ? 'border-white/15 text-white/80 hover:text-white'
                    : 'border-black/15 text-black/80 hover:text-black'
                    }`}
                >
                  {t('hero.work')}
                </motion.button>

                <motion.a
                  href="https://github.com/yzdpirate28"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  aria-label="GitHub"
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                    theme === 'dark'
                      ? 'border-white/15 text-white/80 hover:bg-white/10'
                      : 'border-black/15 text-black/80 hover:bg-black/5'
                  }`}
                >
                  <Github size={18} />
                </motion.a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.65,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="mt-8 flex flex-col items-center gap-3"
              >
                <p
                  className={`text-[12px] uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                    }`}
                >
                  {t('hero.techTitle')}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {heroTech.map((tech) => (
                    <span
                      key={tech.name}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[16px] font-medium backdrop-blur-xl transition ${
                        theme === 'dark'
                          ? 'border-white/10 bg-white/[0.04] text-white/80'
                          : 'border-black/10 bg-black/[0.03] text-black/80'
                      }`}
                    >
                      <img
                        src={tech.icon}
                        alt={tech.name}
                        className={`h-3.5 w-3.5 object-contain ${tech.mono ? 'dark:invert' : ''}`}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {tech.name}
                    </span>
                  ))}
                  <span
                    className={`flex items-center rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-xl transition ${
                      theme === 'dark'
                        ? 'border-white/10 text-white/50'
                        : 'border-black/10 text-black/50'
                    }`}
                  >
                    {t('hero.more')}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.8,
                  duration: 1,
                }}
                className="mt-16 flex justify-center gap-12 text-center"
              >
                <div>
                  <div
                    className={`font-display text-4xl font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                  >
                    {portfolio.length}+
                  </div>
                  <div
                    className={`mt-1 text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                      }`}
                  >
                    {t('hero.projects')}
                  </div>
                </div>

                <div>
                  <div
                    className={`font-display text-4xl font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                  >
                    6+
                  </div>
                  <div
                    className={`mt-1 text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                      }`}
                  >
                    {t('hero.tech')}
                  </div>
                </div>
              </motion.div>
            </div>




            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                delay: 1.0,
              }}
              className="absolute bottom-24 right-10 hidden rotate-[-8deg] md:block z-10"
            >
              <div
                className={`font-script text-4xl ${theme === 'dark' ? 'text-white/80' : 'text-black/80'
                  }`}
              >
                Yazid Abdelmonem
              </div>
              <div
                className={`mt-2 h-px w-52 ${theme === 'dark' ? 'bg-white/30' : 'bg-black/30'
                  }`}
              />
              <p
                className={`mt-2 text-right text-[10px] uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                  }`}
              >
                {t('hero.signatureRole')}
              </p>
            </motion.div>
          </section>

          {/* About Section */}
          <section id="about" className={`relative overflow-hidden px-6 py-32 md:px-12 ${theme === 'dark' ? '' : 'bg-gray-50/30'
            }`}>
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <p className={`mb-3 text-xs font-medium tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                  }`}>
                  {t('about.label')}
                </p>
                <h2 className={`mb-16 font-display text-4xl font-medium leading-tight md:text-5xl ${theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                  {t('about.title')}
                </h2>
              </Reveal>

              <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
                <Reveal className="lg:col-span-5" threshold={0.3}>
                  <motion.div
                    ref={portraitRef}
                    className="relative mx-auto w-full max-w-md"
                    style={{ y: portraitY }}
                  >
                    <div className={`absolute -inset-4 rounded-full blur-3xl ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'
                      }`} />

                    <div className="group relative overflow-hidden rounded-2xl ring-1 ring-white/5">
                      <OptimizedImage
                        src={portraitImg}
                        alt={language === 'fr' ? 'Photo de YAZID Abdelmonem' : 'Photo of YAZID Abdelmonem'}
                        className="block w-full rounded-2xl object-cover brightness-[0.85] saturate-0 transition-all duration-700 group-hover:brightness-100 group-hover:saturate-100"
                        theme={theme}
                        aspectRatio="4/5"
                      />

                      <div className="absolute inset-0 bg-black/10 transition-opacity duration-700 group-hover:opacity-0" />
                    </div>
                  </motion.div>
                </Reveal>

                <Reveal
                  delay={0.1}
                  className={`space-y-6 text-pretty lg:col-span-7 ${theme === 'dark' ? 'text-white/70' : 'text-black/70'
                    }`}
                  threshold={0.2}
                >
                  <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                    {t('about.p1')} <span className="font-medium">{t('about.p1Span')}</span>{t('about.p1End')}
                  </p>

                  <p className="leading-relaxed">
                    {t('about.p2')}
                  </p>

                  <p className="leading-relaxed">
                    {t('about.p3')}
                  </p>

                  <div className={`grid grid-cols-1 gap-x-8 gap-y-5 border-t pt-6 sm:grid-cols-2 ${theme === 'dark' ? 'border-white/5' : 'border-black/5'
                    }`}>
                    {[
                      [t('about.name'), t('about.nameValue')],
                      [t('about.age'), t('about.ageValue')],
                      [
                        t('about.nationality'),
                        <>
                          <img
                            src="https://flagcdn.com/w40/ma.png"
                            alt={language === 'fr' ? 'Maroc' : 'Morocco'}
                            className="mr-2 inline-block h-4 w-6"
                            loading="lazy"
                          />
                          {t('about.nationalityValue')}
                        </>,
                      ],
                      [t('about.location'), t('about.locationValue')],
                      [t('about.languages'), t('about.languagesValue')],
                    ].map(([k, v], index) => (
                      <div key={index}>
                        <div className={`text-[10px] uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                          }`}>
                          {k}
                        </div>
                        <div className={`mt-1 text-sm ${theme === 'dark' ? 'text-white' : 'text-black'
                          }`}>
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <motion.button
                      onClick={() => scrollToSection('contact')}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className={`rounded-full px-5 py-2.5 text-sm font-medium ${theme === 'dark'
                        ? 'bg-white text-black'
                        : 'bg-black text-white'
                        }`}
                    >
                      {t('hero.contact')}
                    </motion.button>

                    <motion.a
                      href={cvFile}
                      download="cv_yazid_abdelmonem.pdf"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${theme === 'dark'
                        ? 'border-white/15 text-white/80 hover:text-white'
                        : 'border-black/15 text-black/80 hover:text-black'
                        }`}
                    >
                      {t('about.download')}
                    </motion.a>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* CV Section */}
          <section id="cv" className={`px-6 py-32 md:px-12 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
            }`}>
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <p className={`mb-3 text-xs font-medium tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                  }`}>
                  {t('cv.label')}
                </p>
                <h2 className={`font-display text-4xl md:text-5xl font-medium leading-tight mb-16 ${theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                  {t('cv.title')}
                </h2>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <Reveal>
                    <h3 className={`font-display text-2xl font-medium mb-8 ${theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>{t('cv.education')}</h3>
                  </Reveal>
                  <div className="space-y-6">
                    {education.map((e, i) => (
                      <TimelineItem key={e.title.fr} item={e} delay={i * 0.05} theme={theme} language={language} />
                    ))}
                  </div>
                </div>
                <div>
                  <Reveal>
                    <h3 className={`font-display text-2xl font-medium mb-8 ${theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>{t('cv.experience')}</h3>
                  </Reveal>
                  <div className="space-y-6">
                    {experience.map((e, i) => (
                      <TimelineItem key={e.title.fr} item={e} delay={i * 0.05} theme={theme} language={language} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio Section */}
          <section id="portfolio" className="px-6 py-32 md:px-12">
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <p className={`mb-3 text-xs font-medium tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                  }`}>
                  {t('portfolio.label')}
                </p>
                <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                  <h2 className={`font-display text-4xl md:text-5xl font-medium leading-tight ${theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                    {t('portfolio.title')}
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {portfolioFilterKeys.map((f) => (
                      <button
                        key={f}
                        onClick={() => setPortfolioFilter(f)}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${portfolioFilter === f
                          ? theme === 'dark' ? 'border-white bg-white text-black' : 'border-black bg-black text-white'
                          : theme === 'dark' ? 'border-white/15 text-white/60 hover:text-white' : 'border-black/15 text-black/60 hover:text-black'
                          }`}
                      >
                        {f === "Tout" ? t('portfolio.all') : getPortfolioFilterLabel(f)}
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>

              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {visibleProjects.map((p, i) => {
                  const info = getProjectInfo(p.key);
                  return (
                    <PortfolioCard
                      key={p.key}
                      project={p}
                      info={info}
                      theme={theme}
                      t={t}
                      onOpen={() => openProjectModal(p)}
                      getPortfolioFilterLabel={getPortfolioFilterLabel}
                      index={i}
                    />
                  );
                })}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12 text-center"
              >
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                  }`}>
                  {visibleProjects.length} {visibleProjects.length > 1 ? 'projets' : 'projet'} •
                  <span className="ml-1">{t('portfolio.label')}</span>
                </span>
              </motion.div>
            </div>
          </section>

          {/* Services Section */}
<section
  id="services"
  className={`px-6 py-24 md:px-12 md:py-32 overflow-hidden ${
    theme === "dark" ? "bg-white/5" : "bg-black/5"
  }`}
>
  <div className="mx-auto max-w-7xl">

    {/* HEADER */}
    <Reveal>
      <div className="mb-16">
        <p
          className={`mb-3 text-xs font-medium tracking-[0.3em] uppercase ${
            theme === "dark" ? "text-white/40" : "text-black/40"
          }`}
        >
          {t("services.label")}
        </p>

        <h2
          className={`font-display text-4xl md:text-5xl font-medium leading-tight ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          {t("services.title")}
        </h2>
      </div>
    </Reveal>

    {/* SERVICES LAYOUT */}
    <div className="relative">

      {/* SOFT GLOW BEHIND PERSON */}
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        h-[420px] w-[420px] md:h-[560px] md:w-[560px]
        rounded-full blur-[100px] pointer-events-none
        ${
          theme === "dark"
            ? "bg-white/10"
            : "bg-black/10"
        }`}
      />

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px_1fr] gap-6 items-center">

        {/* LEFT */}
        <div className="flex flex-col gap-6 order-2 md:order-1">

          {translations[language].services.items
            .slice(0, 2)
            .map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className={`group relative rounded-2xl border p-7 md:p-8 backdrop-blur-sm transition-colors ${
                    theme === "dark"
                      ? "border-white/10 bg-white/[0.02] hover:border-white/20"
                      : "border-black/[0.07] bg-white/50 hover:border-black/15"
                  }`}
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between mb-7">

                    <span
                      className={`font-display text-3xl font-light ${
                        theme === "dark"
                          ? "text-white/30"
                          : "text-black/25"
                      }`}
                    >
                      0{i + 1}
                    </span>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-transform duration-300 group-hover:translate-x-1 ${
                        theme === "dark"
                          ? "border-white/10 text-white"
                          : "border-black/10 text-black"
                      }`}
                    >
                      <span className="text-sm">→</span>
                    </div>
                  </div>

                  {/* TITLE */}
                  <h3
                    className={`font-display text-xl md:text-2xl font-medium mb-3 ${
                      theme === "dark"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {s.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p
                    className={`text-sm leading-relaxed ${
                      theme === "dark"
                        ? "text-white/55"
                        : "text-black/55"
                    }`}
                  >
                    {s.desc}
                  </p>

                </motion.div>
              </Reveal>
            ))}

        </div>

        {/* CENTER PERSON */}
        <div className="relative flex justify-center items-end order-1 md:order-2 min-h-[430px] md:min-h-[650px]">

          {/* CIRCLE */}
          <div
            className={`absolute bottom-10 left-1/2 -translate-x-1/2
            h-[300px] w-[300px] md:h-[380px] md:w-[380px]
            rounded-full border
            ${
              theme === "dark"
                ? "border-white/5 bg-white/[0.02]"
                : "border-black/5 bg-white/40"
            }`}
          />

          {/* DOT PATTERN */}
          <div
            className={`absolute bottom-24 left-1/2 -translate-x-1/2
            h-40 w-40 opacity-40
            [background-image:radial-gradient(circle,currentColor_1px,transparent_1px)]
            [background-size:14px_14px]
            ${
              theme === "dark"
                ? "text-white/40"
                : "text-black/30"
            }`}
          />

          {/* PERSON */}
          <motion.img
            src={yzdimg}
            alt="Data Scientist & Data Engineer"
            initial={{ opacity: 0, y: 30 }}
            loading="lazy"
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="relative z-10 w-[300px] md:w-[390px] lg:w-[430px]
                       max-w-none object-contain object-bottom"
          />

        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6 order-3">

          {translations[language].services.items
            .slice(2, 4)
            .map((s, i) => (
              <Reveal key={s.title} delay={(i + 2) * 0.05}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className={`group relative rounded-2xl border p-7 md:p-8 backdrop-blur-sm transition-colors ${
                    theme === "dark"
                      ? "border-white/10 bg-white/[0.02] hover:border-white/20"
                      : "border-black/[0.07] bg-white/50 hover:border-black/15"
                  }`}
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between mb-7">

                    <span
                      className={`font-display text-3xl font-light ${
                        theme === "dark"
                          ? "text-white/30"
                          : "text-black/25"
                      }`}
                    >
                      0{i + 3}
                    </span>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-transform duration-300 group-hover:translate-x-1 ${
                        theme === "dark"
                          ? "border-white/10 text-white"
                          : "border-black/10 text-black"
                      }`}
                    >
                      <span className="text-sm">→</span>
                    </div>
                  </div>

                  {/* TITLE */}
                  <h3
                    className={`font-display text-xl md:text-2xl font-medium mb-3 ${
                      theme === "dark"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {s.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p
                    className={`text-sm leading-relaxed ${
                      theme === "dark"
                        ? "text-white/55"
                        : "text-black/55"
                    }`}
                  >
                    {s.desc}
                  </p>

                </motion.div>
              </Reveal>
            ))}

        </div>

      </div>
    </div>
  </div>
</section>

          {/* Skills Section */}
          <section id="skills" className="px-6 py-32 md:px-12">
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <p className={`mb-3 text-xs font-medium tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                  }`}>
                  {t('skills.label')}
                </p>
                <h2 className={`font-display text-4xl md:text-5xl font-medium leading-tight mb-12 ${theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                  {t('skills.title')}
                </h2>
              </Reveal>

              <Reveal>
                <div className="mb-12 flex flex-wrap gap-2">
                  {skillCategoryKeys.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSkillFilter(c)}
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${skillFilter === c
                        ? theme === 'dark'
                          ? 'border-white bg-white text-black'
                          : 'border-black bg-black text-white'
                        : theme === 'dark'
                          ? 'border-white/15 text-white/60 hover:text-white'
                          : 'border-black/15 text-black/60 hover:text-black'
                        }`}
                    >
                      {c === "Toutes" ? t('skills.all') : getSkillCategoryLabel(c)}
                    </button>
                  ))}
                </div>
              </Reveal>

              <motion.div layout className="flex flex-wrap gap-3 mb-20">
                {visibleSkills.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: (i % 12) * 0.03,
                      duration: 0.5,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                    whileHover={{
                      y: -4,
                      scale: 1.03,
                    }}
                    className={`flex items-center gap-3 rounded-full border px-4 py-3 ${theme === 'dark'
                      ? 'border-white/5'
                      : 'border-black/5'
                      }`}
                  >
                    <img
                      src={s.icon}
                      alt={s.name}
                      className={`h-5 w-5 object-contain transition-transform duration-300 group-hover:scale-110 ${
                        s.mono ? 'dark:invert' : ''
                      }`}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                      {s.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <Reveal>
                <h3 className={`font-display text-2xl font-medium mb-8 ${theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>{t('skills.professional')}</h3>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl">
                {softSkillKeys.map((s, i) => (
                  <SoftSkillBar key={s.key} skillKey={s.key} value={s.value} delay={i * 0.05} theme={theme} label={getSoftSkillLabel(s.key)} />
                ))}
              </div>
            </div>
          </section>

          {/* Extracurricular Section */}
          <section id="extracurricular" className="px-6 py-32 md:px-12">
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <p className={`mb-3 text-xs font-medium tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                  }`}>
                  {t('extracurricular.label')}
                </p>
                <h2 className={`font-display text-4xl md:text-5xl font-medium leading-tight mb-16 ${theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                  {t('extracurricular.title')}
                </h2>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[0, 1].map((i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                      className={`group relative rounded-2xl border p-7 md:p-8 transition-colors h-full ${
                        theme === 'dark'
                          ? 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          : 'border-black/[0.07] bg-white/50 hover:border-black/15'
                      }`}
                    >
                      <h3 className={`font-display text-xl md:text-2xl font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>
                        {t(`extracurricular.items.${i}.title`)}
                      </h3>
                      <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/55' : 'text-black/55'
                        }`}>
                        {t(`extracurricular.items.${i}.desc`)}
                      </p>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Social Section */}
          <section id="social" className={`px-6 py-32 md:px-12 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
            }`}>
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <p className={`mb-3 text-xs font-medium tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                  }`}>
                  {t('social.label')}
                </p>
                <h2 className={`font-display text-4xl md:text-5xl font-medium leading-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                  {t('social.title')}
                </h2>
                <p className={`mb-16 max-w-2xl text-pretty ${theme === 'dark' ? 'text-white/70' : 'text-black/70'
                  }`}>
                  {t('social.desc')}
                </p>
              </Reveal>

              <div className="flex flex-wrap items-center justify-center gap-6">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Reveal key={social.name} delay={index * 0.05}>
                      <motion.a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{
                          scale: 1.1,
                          y: -5,
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`group relative flex h-20 w-20 items-center justify-center rounded-2xl border transition-all duration-300 hover:border-transparent ${theme === 'dark'
                          ? 'border-white/10 bg-white/5'
                          : 'border-black/10 bg-black/5'
                          } ${social.color}`}
                      >
                        <Icon
                          size={28}
                          className={`transition-all duration-300 group-hover:scale-110 ${theme === 'dark'
                            ? 'text-white/70 group-hover:text-white'
                            : 'text-black/70 group-hover:text-white'
                            }`}
                        />
                        <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-widest opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                          }`}>
                          {social.name}
                        </span>
                      </motion.a>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className={`px-6 py-32 md:px-12 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
            }`}>
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <p className={`mb-3 text-xs font-medium tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                  }`}>
                  {t('contact.label')}
                </p>
                <h2 className={`mb-6 font-display text-4xl font-medium leading-tight md:text-5xl ${theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                  {t('contact.title')}
                </h2>
                <p className={`mb-16 max-w-2xl text-pretty ${theme === 'dark' ? 'text-white/70' : 'text-black/70'
                  }`}>
                  {t('contact.desc')}
                </p>
              </Reveal>

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                <Reveal className="space-y-6 lg:col-span-2">
                  {[
                    {
                      label: t('contact.phone'),
                      value: "+212 693656266",
                      href: "tel:+212693656266",
                      icon: Phone,
                    },
                    {
                      label: t('contact.email'),
                      value: "abdelmonem.yazid@gmail.com",
                      href: "mailto:abdelmonem.yazid@gmail.com",
                      icon: Mail,
                    },
                    {
                      label: t('contact.location'),
                      value: t('contact.locationValue'),
                      icon: MapPin,
                    },
                  ].map((c) => {
                    const Icon = c.icon;

                    return (
                      <a
                        key={c.label}
                        href={c.href ?? "#"}
                        className={`block rounded-2xl border p-6 transition-colors ${theme === 'dark'
                          ? 'border-white/5 hover:border-white/20'
                          : 'border-black/5 hover:border-black/20'
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${theme === 'dark'
                            ? 'border-white/10 bg-white/5'
                            : 'border-black/10 bg-black/5'
                            }`}>
                            <Icon size={18} className={theme === 'dark' ? 'text-white/70' : 'text-black/70'} />
                          </div>
                          <div>
                            <div className={`text-[10px] uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                              }`}>
                              {c.label}
                            </div>
                            <div className={`mt-2 ${theme === 'dark' ? 'text-white' : 'text-black'
                              }`}>
                              {c.value}
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </Reveal>

                <Reveal delay={0.1} className="lg:col-span-3">
                  <ContactFormWithEmail theme={theme} language={language} t={t} />
                </Reveal>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className={`px-6 py-12 md:px-12 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'
            }`}>
                          <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex justify-center py-12 md:py-20 px-4 overflow-hidden"
            >
              <div className="relative flex justify-center">
                <span
                  className={`font-display font-light tracking-[-0.04em] leading-none whitespace-nowrap text-transparent bg-clip-text select-none
        text-[72px] sm:text-[120px] md:text-[170px] lg:text-[190px]
        ${theme === "dark"
                      ? "bg-gradient-to-b from-white/90 via-white/70 to-white/30"
                      : "bg-gradient-to-b from-black/90 via-black/70 to-black/30"
                    }`}
                >
                  {t("footer.logo")}
                </span>

 

                <div
                  className={`absolute
        -bottom-4 md:-bottom-8
        left-1/2 -translate-x-1/2
        h-px
        w-32 sm:w-48 md:w-72
        bg-gradient-to-r from-transparent
        ${theme === "dark"
                      ? "via-white/30"
                      : "via-black/30"
                    }
        to-transparent`}
                />
              </div>
            </motion.div>
            <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className={`font-display uppercase text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-black'
                }`}>{t('footer.brand')}</span>
              <p className={`text-[10px] tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
                }`}>
                © {new Date().getFullYear()} {t('footer.rights')}
              </p>
            </div>


          </footer>
          {/* Scroll to Top Button */}
          <ScrollToTopButton theme={theme} />
          {/* Chatbot */}
          <div className="fixed bottom-6 right-6 z-50">
            {chatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[80vh] rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col ${theme === 'dark'
                  ? 'border-white/10 bg-black/90'
                  : 'border-black/10 bg-white/90'
                  }`}
              >
                <div className={`flex items-center justify-between border-b px-5 py-4 ${theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-black/10 bg-black/5'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br from-black-400 to-white-500 border flex items-center justify-center ${theme === 'dark' ? 'border-white/20' : 'border-black/20'
                        }`}>
                        <MessageCircle size={20} className={theme === 'dark' ? 'text-white' : 'text-black'} />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 ring-2 ring-black" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('chat.assistantName')}</h3>
                      <p className="text-[10px] text-green-400">{t('chat.online')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChatOpen(false)}
                    className={`rounded-full p-1.5 transition ${theme === 'dark'
                      ? 'hover:bg-white/10 text-white/60 hover:text-white'
                      : 'hover:bg-black/10 text-black/60 hover:text-black'
                      }`}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'user'
                          ? theme === 'dark'
                            ? 'bg-white text-black'
                            : 'bg-black text-white'
                          : theme === 'dark'
                            ? 'bg-white/10 text-white/90'
                            : 'bg-black/10 text-black/90'
                          }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className={`rounded-2xl px-4 py-3 ${theme === 'dark'
                        ? 'bg-white/10 text-white/60'
                        : 'bg-black/10 text-black/60'
                        }`}>
                        <div className="flex gap-1">
                          <span className={`h-2 w-2 rounded-full animate-bounce [animation-delay:-0.3s] ${theme === 'dark' ? 'bg-white/40' : 'bg-black/40'
                            }`} />
                          <span className={`h-2 w-2 rounded-full animate-bounce [animation-delay:-0.15s] ${theme === 'dark' ? 'bg-white/40' : 'bg-black/40'
                            }`} />
                          <span className={`h-2 w-2 rounded-full animate-bounce ${theme === 'dark' ? 'bg-white/40' : 'bg-black/40'
                            }`} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className={`border-t p-4 ${theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-black/10 bg-black/5'
                  }`}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t('chat.placeholder')}
                      className={`flex-1 rounded-full border px-4 py-2.5 text-sm outline-none transition ${theme === 'dark'
                        ? 'border-white/10 bg-black/50 text-white placeholder:text-white/40 focus:border-white/30'
                        : 'border-black/10 bg-white/50 text-black placeholder:text-black/40 focus:border-black/30'
                        }`}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className={`rounded-full px-4 py-2.5 transition disabled:opacity-40 disabled:cursor-not-allowed ${theme === 'dark'
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'bg-black text-white hover:bg-black/90'
                        }`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChatOpen(!chatOpen)}
              className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition ${theme === 'dark'
                ? 'bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]'
                : 'bg-black hover:shadow-[0_0_40px_rgba(0,0,0,0.2)]'
                }`}
            >
              {chatOpen ? (
                <X size={24} className={theme === 'dark' ? 'text-black' : 'text-white'} />
              ) : (
                <MessageCircle size={24} className={theme === 'dark' ? 'text-black' : 'text-white'} />
              )}
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-400 ring-2 ring-black animate-pulse" />
            </motion.button>
          </div>
        </div>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}

// ----- Sub-components -----

function TimelineItem({
  item,
  delay,
  theme,
  language,
}: {
  item: {
    period: string | { fr: string; en: string };
    title: { fr: string; en: string };
    place: { fr: string; en: string };
    logo?: string;
    tech?: string[];
    desc: { fr: string; en: string };
  };
  delay: number;
  theme: Theme;
  language: Language;
}) {
  const period = typeof item.period === "string" ? item.period : item.period[language];
  return (
    <Reveal delay={delay}>
      <div className={`relative pl-6 border-l ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
        <span className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-black'
          }`} />
        <p className={`text-[10px] tracking-[0.2em] uppercase ${theme === 'dark' ? 'text-white/40' : 'text-black/40'
          }`}>{period}</p>
        <h4 className={`font-display mt-2 text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-black'
          }`}>{item.title[language]}</h4>
        <div className="flex items-center gap-3 mt-1.5">
          {item.logo && (
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg p-1.5 ${
              theme === 'dark' ? 'bg-white border border-black/10 shadow-sm' : 'bg-white border border-black/10 shadow-sm'
            }`}>
              <img src={item.logo} alt={item.place[language]} className="h-full w-full object-contain" loading="lazy" />
            </span>
          )}
          <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-black/70'}`}>{item.place[language]}</p>
        </div>
        {item.tech && item.tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.tech.map((tech) => (
              <span key={tech} className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                theme === 'dark'
                  ? 'bg-white/10 text-white/70 border border-white/10'
                  : 'bg-black/10 text-black/70 border border-black/10'
              }`}>
                {tech}
              </span>
            ))}
          </div>
        )}
        <p className={`text-sm mt-3 leading-relaxed text-pretty ${theme === 'dark' ? 'text-white/70' : 'text-black/70'
          }`}>{item.desc[language]}</p>
      </div>
    </Reveal>
  );
}

function SoftSkillBar({
  skillKey,
  value,
  delay,
  theme,
  label,
}: {
  skillKey: string;
  value: number;
  delay: number;
  theme: Theme;
  label: string;
}) {
  return (
    <Reveal delay={delay}>
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className={theme === 'dark' ? 'text-white' : 'text-black'}>
            {label}
          </span>
          <span className={theme === 'dark' ? 'text-white/50' : 'text-black/50'}>
            {value}%
          </span>
        </div>
        <div className={`h-[2px] w-full overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'
          }`}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${value}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
            className={`h-full ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
          />
        </div>
      </div>
    </Reveal>
  );
}

// ----- Contact Form avec EmailJS -----
function ContactFormWithEmail({ theme, language, t }: { theme: Theme; language: Language; t: (key: string) => string }) {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const serviceID = "service_p8e9tao";
  const templateID = "template_6e867sl";
  const publicKey = "fGXEJzJvHX8tmL4wE";

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.fullname.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    setStatus('sending');

    try {
      await emailjs.send(
        serviceID,
        templateID,
        {
          from_name: formData.fullname,
          from_email: formData.email,
          message: formData.message,
        },
        publicKey
      );

      setStatus('sent');
      setFormData({ fullname: '', email: '', message: '' });

      setTimeout(() => {
        setStatus('idle');
      }, 5000);

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setStatus('error');
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');

      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }
  }, [formData]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border p-8 space-y-5 ${theme === 'dark' ? 'border-white/5' : 'border-black/5'
        }`}
    >
      <FieldWithEmail
        label={t('contact.name')}
        name="fullname"
        value={formData.fullname}
        onChange={handleChange}
        theme={theme}
      />
      <FieldWithEmail
        label={t('contact.emailLabel')}
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        theme={theme}
      />
      <FieldWithEmail
        label={t('contact.message')}
        name="message"
        as="textarea"
        value={formData.message}
        onChange={handleChange}
        theme={theme}
      />

      <motion.button
        type="submit"
        disabled={status === 'sending'}
        whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
        whileTap={{ scale: status === 'sending' ? 1 : 0.98 }}
        className={`w-full rounded-full py-3 text-sm font-medium flex items-center justify-center gap-2 transition ${status === 'sending'
          ? 'cursor-not-allowed opacity-70'
          : ''
          } ${theme === 'dark'
            ? 'bg-white text-black hover:bg-white/90'
            : 'bg-black text-white hover:bg-black/90'
          }`}
      >
        {status === 'sending' && (
          <Loader2 size={18} className="animate-spin" />
        )}
        {status === 'sent' && (
          <CheckCircle size={18} />
        )}
        {status === 'error' && (
          <X size={18} />
        )}
        {status === 'idle' && t('contact.send')}
        {status === 'sending' && t('contact.sending')}
        {status === 'sent' && t('contact.sent')}
        {status === 'error' && t('contact.error')}
      </motion.button>

      {status === 'error' && errorMessage && (
        <p className={`text-sm text-center mt-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'
          }`}>
          {errorMessage}
        </p>
      )}
    </form>
  );
}

function FieldWithEmail({
  label,
  name,
  type = "text",
  as = "input",
  value,
  onChange,
  theme,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "input" | "textarea";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  theme: Theme;
}) {
  const classes =
    `peer w-full bg-transparent border-b pb-2 pt-5 text-sm outline-none transition-colors focus:border-ink ${theme === 'dark'
      ? 'border-white/15 text-white focus:border-white'
      : 'border-black/15 text-black focus:border-black'
    }`;
  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={`absolute left-0 top-0 text-[10px] tracking-[0.2em] uppercase ${theme === 'dark' ? 'text-white/50' : 'text-black/50'
          }`}
      >
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          required
          rows={4}
          className={classes}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required
          className={classes}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}