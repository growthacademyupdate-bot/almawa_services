// Central mock dataset. Everything client-side; nothing hits a backend.

export type ServiceSlug =
  | "company-incorporation"
  | "certifications"
  | "company-profiling"
  | "fund-raising"
  | "digital-marketing";

export interface ServiceItem {
  slug: ServiceSlug;
  title: string;
  createdAt?: string;
  clients?: number;
  projects?: number;
  tagline: string;
  description: string;
  icon: string; // react-icons name key
  color: string;
  overview: string;
  benefits: string[];
  process: { step: string; detail: string }[];
  documents: string[];
  whoCanApply: string[];
  faqs: { q: string; a: string }[];
  offerings: string[];
}

export const heroSlides = [
  {
    id: "h1",
    enabled: true,
    title: "Empowering Businesses Through Smart Consulting",
    subtitle:
      "Helping Startups, MSMEs and Growing Businesses with Registration, Certifications, Fund Raising, Digital Marketing and Company Profiling.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80",
    cta: "Get Free Consultation",
  },
  {
    id: "h2",
    enabled: true,
    title: "From Idea to Incorporation — We Handle It All",
    subtitle:
      "Private Limited, LLP, OPC, Startup India, MSME, GST — end-to-end registration by seasoned consultants.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80",
    cta: "Explore Services",
  },
  {
    id: "h3",
    enabled: true,
    title: "Raise Capital With Confidence",
    subtitle:
      "Investor-ready pitch decks, valuations and warm introductions to angels, VCs and government schemes.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=80",
    cta: "Start Fund Raising",
  },
  {
    id: "h4",
    enabled: true,
    title: "Grow Your Brand Digitally, Pan India",
    subtitle:
      "SEO, performance marketing, websites and content — a growth stack tuned for Indian MSMEs.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80",
    cta: "Grow My Business",
  },
  {
    id: "h5",
    enabled: true,
    title: "Compliance That Just Works",
    subtitle:
      "ISO, FSSAI, Trademark, IEC and more — certifications delivered without the paperwork headache.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1920&q=80",
    cta: "Get Certified",
  },
];

const svc = (s: ServiceItem): ServiceItem => s;

export const services: ServiceItem[] = [
  svc({
    slug: "company-incorporation",
    title: "Company Incorporation",
    tagline: "Register your business the right way, the first time.",
    description:
      "End-to-end incorporation for Private Limited, LLP, OPC, Partnership, Proprietorship, plus Startup India, MSME and GST registration.",
    icon: "building",
    color: "from-orange-500 to-amber-500",
    overview:
      "Choosing the right legal structure is the single most consequential decision an entrepreneur makes. Our incorporation team advises on the ideal entity type, files every form, drafts your MoA/AoA and hands over a fully compliant company — usually within 10–15 working days.",
    benefits: [
      "100% online, paperless process",
      "Dedicated compliance manager",
      "Free DSC & DIN for directors",
      "Bank account opening assistance",
      "Post-incorporation compliance calendar",
      "Startup India & MSME add-ons",
    ],
    process: [
      { step: "Consultation", detail: "Understand your business model and recommend the ideal structure." },
      { step: "Documentation", detail: "Collect KYC, address proof and drafts of MoA/AoA." },
      { step: "Name Approval", detail: "RUN / SPICe+ Part A filed with MCA." },
      { step: "Filing", detail: "SPICe+ Part B, AGILE-PRO and INC-9 submitted." },
      { step: "Incorporation", detail: "Certificate of Incorporation, PAN, TAN issued." },
      { step: "Handover", detail: "Bank account, GST, MSME and post-incorporation checklist." },
    ],
    documents: [
      "PAN & Aadhaar of directors",
      "Passport-size photographs",
      "Address proof (utility bill / bank statement)",
      "Registered office proof (rent agreement + NoC)",
      "Digital Signature Certificate (we arrange)",
    ],
    whoCanApply: [
      "First-time founders launching a startup",
      "MSMEs formalising operations",
      "Family businesses converting to a company",
      "NRIs & foreign nationals investing in India",
    ],
    faqs: [
      { q: "How long does incorporation take?", a: "Typically 10–15 working days from complete documentation." },
      { q: "What is the minimum capital required?", a: "There is no minimum paid-up capital for Private Limited or LLP." },
      { q: "Do I need a physical office?", a: "A registered address is required; it can be a residential address with a NoC." },
    ],
    offerings: [
      "Private Limited Company",
      "Limited Liability Partnership (LLP)",
      "One Person Company (OPC)",
      "Partnership Firm",
      "Proprietorship",
      "Startup India Registration",
      "MSME / Udyam Registration",
      "GST Registration",
    ],
  }),
  svc({
    slug: "certifications",
    title: "Certifications",
    tagline: "Credibility that opens doors — and tenders.",
    description:
      "ISO, FSSAI, Trademark, MSME, Startup India, IEC and more — the certifications your business needs to sell, export and win contracts.",
    icon: "badge",
    color: "from-blue-500 to-cyan-500",
    overview:
      "Certifications aren't just paperwork — they unlock tenders, marketplaces, export routes and consumer trust. Almawa handles the entire lifecycle from gap analysis to certificate delivery, and keeps you audit-ready year after year.",
    benefits: [
      "Gap analysis before you apply",
      "End-to-end documentation",
      "Liaison with certifying bodies",
      "Fast-track processing",
      "Renewal reminders and support",
      "Multi-certification bundles",
    ],
    process: [
      { step: "Scoping Call", detail: "Identify which certifications match your product, industry and market." },
      { step: "Documentation", detail: "Prepare quality manuals, SOPs and application forms." },
      { step: "Application", detail: "Submit to certifying body with liaison support." },
      { step: "Audit Prep", detail: "Mock audits and readiness checks." },
      { step: "Certification", detail: "Certificate issued and handed over digitally." },
    ],
    documents: [
      "Company incorporation documents",
      "Product / service catalogue",
      "Existing SOPs (if any)",
      "Address proof of premises",
      "Bank statement (last 6 months)",
    ],
    whoCanApply: [
      "Manufacturers targeting exports",
      "Food businesses (FSSAI)",
      "Brands protecting IP (Trademark)",
      "Startups seeking DPIIT benefits",
    ],
    faqs: [
      { q: "Which ISO is right for me?", a: "It depends on your industry — 9001 for quality, 27001 for infosec, 14001 for environment. We'll advise." },
      { q: "How long does a trademark take?", a: "Trademark filing is same-day; registration takes 12–18 months." },
      { q: "Is FSSAI mandatory?", a: "Any food business with turnover above ₹12 lakh must have FSSAI." },
    ],
    offerings: [
      "ISO 9001 / 14001 / 27001 / 45001",
      "FSSAI (Basic / State / Central)",
      "Trademark Registration",
      "MSME / Udyam",
      "Startup India (DPIIT)",
      "IEC (Import Export Code)",
      "BIS, CE, GMP",
    ],
  }),
  svc({
    slug: "company-profiling",
    title: "Company Profiling",
    tagline: "A story your investors, clients and partners will remember.",
    description:
      "Investor-grade company profiles, business plans, pitch decks, brochures and financial projections — designed to convert.",
    icon: "chart",
    color: "from-purple-500 to-pink-500",
    overview:
      "Whether you're walking into a boardroom, a bank or a demo day, your profile is your handshake. We combine research, strategy and design to build assets that get you into the next meeting.",
    benefits: [
      "Research-backed positioning",
      "Investor-grade financial models",
      "Premium design language",
      "Editable master files (PPT/PDF/Word)",
      "Unlimited revisions in scope",
      "Delivered in 7–14 working days",
    ],
    process: [
      { step: "Discovery", detail: "Deep-dive workshop to extract your story and numbers." },
      { step: "Research", detail: "Market sizing, competition mapping, benchmarking." },
      { step: "Draft", detail: "Content architecture and first design draft." },
      { step: "Iterate", detail: "Two rounds of structured feedback." },
      { step: "Delivery", detail: "Final files + editable source files." },
    ],
    documents: [
      "Company overview & founder bios",
      "Existing brand assets (logo, colours)",
      "Financial history (if any)",
      "Product / service details",
    ],
    whoCanApply: [
      "Startups raising a round",
      "MSMEs bidding for large contracts",
      "Businesses launching a new vertical",
      "Consultants building a firm brand",
    ],
    faqs: [
      { q: "How is this different from a designer on Fiverr?", a: "We lead with strategy and financials — design is the delivery layer, not the starting point." },
      { q: "Do you help with the actual pitch?", a: "Yes, coaching sessions are included with the pitch deck package." },
      { q: "Will I get editable files?", a: "Absolutely — PPT, Word and PDF source files are yours." },
    ],
    offerings: [
      "Company Profile",
      "Business Profile",
      "Pitch Deck",
      "Corporate Brochure",
      "Investor Presentation",
      "Business Plan",
      "Financial Projections",
    ],
  }),
  svc({
    slug: "fund-raising",
    title: "Fund Raising",
    tagline: "Capital, on your terms.",
    description:
      "Investor readiness, warm introductions, pitch prep and access to angel networks, VCs, and government schemes.",
    icon: "trending",
    color: "from-emerald-500 to-teal-500",
    overview:
      "Fund raising is 20% document and 80% narrative. Almawa gets both right — building the deck, model and data room, then plugging you into a curated investor network across India.",
    benefits: [
      "Investor-ready collateral",
      "Access to 500+ angels & VCs",
      "Government scheme filings (SIDBI, CGTMSE, MUDRA)",
      "Term sheet negotiation support",
      "Data room setup",
      "Post-money advisory",
    ],
    process: [
      { step: "Readiness", detail: "Assess maturity across product, team, traction and financials." },
      { step: "Collateral", detail: "Deck, one-pager, financial model, data room." },
      { step: "Targeting", detail: "Shortlist investors by stage, sector and cheque size." },
      { step: "Intros", detail: "Warm introductions and follow-up cadence." },
      { step: "Close", detail: "Term sheet review and closing support." },
    ],
    documents: [
      "Incorporation documents",
      "Cap table",
      "Last 2 years financials (if any)",
      "Traction metrics",
      "Team CVs",
    ],
    whoCanApply: [
      "Pre-seed to Series B startups",
      "MSMEs seeking working capital",
      "Businesses eligible for government schemes",
      "Family businesses opening to external capital",
    ],
    faqs: [
      { q: "Do you guarantee funding?", a: "No credible firm can — but we dramatically improve your odds and cycle time." },
      { q: "What's your fee structure?", a: "A retainer + success fee model, aligned with outcomes." },
      { q: "Which schemes are best for me?", a: "Depends on turnover, sector and vintage — we'll map it in the first call." },
    ],
    offerings: [
      "Investor Support",
      "Pitch Deck",
      "Financial Planning",
      "Business Valuation",
      "Government Schemes",
      "Startup Funding",
      "Angel Funding",
      "MSME Funding",
    ],
  }),
  svc({
    slug: "digital-marketing",
    title: "Digital Marketing",
    tagline: "Growth engineered, not guessed.",
    description:
      "SEO, paid ads, websites, brand identity, content and email — a full-stack growth team for Indian MSMEs.",
    icon: "megaphone",
    color: "from-rose-500 to-orange-500",
    overview:
      "Digital marketing without a strategy is just spending. Almawa builds a measurable growth engine — from your website and brand to SEO, paid ads and CRM — with weekly reporting you'll actually read.",
    benefits: [
      "Strategy-first engagements",
      "In-house creative + performance team",
      "Transparent weekly reporting",
      "Own your assets — no lock-in",
      "Google & Meta certified specialists",
      "Fixed-scope retainers",
    ],
    process: [
      { step: "Audit", detail: "Website, brand, funnel and channel audit." },
      { step: "Strategy", detail: "90-day growth plan with KPIs." },
      { step: "Build", detail: "Website, creatives, tracking, CRM." },
      { step: "Launch", detail: "Campaigns go live, tracked end-to-end." },
      { step: "Iterate", detail: "Weekly reviews, monthly strategy pivots." },
    ],
    documents: [
      "Access to existing ad accounts",
      "Domain & hosting details",
      "Brand assets",
      "CRM / analytics access",
    ],
    whoCanApply: [
      "D2C brands",
      "Local businesses expanding online",
      "SaaS & service businesses",
      "MSMEs entering ecommerce",
    ],
    faqs: [
      { q: "Do I need to sign a long contract?", a: "No — we work on 3-month rolling engagements." },
      { q: "Who owns the ad account?", a: "You do. Always." },
      { q: "How fast will I see results?", a: "Paid channels: 2–4 weeks. SEO: 3–6 months." },
    ],
    offerings: [
      "SEO",
      "Social Media Marketing",
      "Google Ads",
      "Facebook / Meta Ads",
      "Website Development",
      "Brand Identity",
      "Content Marketing",
      "Email Marketing",
    ],
  }),
];

export const industries = [
  { name: "Manufacturing", icon: "factory", desc: "Compliance, ISO and export readiness for Indian manufacturers." },
  { name: "Healthcare", icon: "heart", desc: "Clinic setup, drug licensing and healthtech growth." },
  { name: "Education", icon: "book", desc: "Edtech incorporation, funding and go-to-market." },
  { name: "Construction", icon: "hardhat", desc: "Contractor licensing, tender readiness and MSME benefits." },
  { name: "Agriculture", icon: "leaf", desc: "FPO setup, agri-tech funding and rural schemes." },
  { name: "Retail", icon: "shopping", desc: "Franchise, GST, trademark and D2C growth." },
  { name: "Technology", icon: "cpu", desc: "SaaS incorporation, ESOP structuring and VC readiness." },
  { name: "Logistics", icon: "truck", desc: "Fleet compliance, IEC and B2B contracts." },
  { name: "Finance", icon: "bank", desc: "NBFC advisory, RBI compliance and fintech launches." },
  { name: "Startups", icon: "rocket", desc: "0-to-1 support: incorporation, DPIIT, funding, growth." },
];

export const testimonialsSeed = [
  {
    id: "t1",
    name: "Rahul Verma",
    company: "Verma Tech Solutions",
    rating: 5,
    comment:
      "Almawa incorporated our Pvt Ltd, got DPIIT recognition, and lined up three warm intros — all in six weeks. Genuinely investor-grade work.",
    image: "https://i.pravatar.cc/150?img=12",
    status: "approved" as const,
    date: "2025-11-14",
  },
  {
    id: "t2",
    name: "Priya Nair",
    company: "Nair Foods Pvt Ltd",
    rating: 5,
    comment:
      "FSSAI Central, ISO 22000 and a trademark — bundled and delivered without a single follow-up from my side. Highly recommended.",
    image: "https://i.pravatar.cc/150?img=45",
    status: "approved" as const,
    date: "2025-10-30",
  },
  {
    id: "t3",
    name: "Arjun Mehta",
    company: "Mehta Logistics",
    rating: 4,
    comment:
      "Their MSME funding team helped us secure a ₹40L CGTMSE loan. Clear timelines and zero surprises on documentation.",
    image: "https://i.pravatar.cc/150?img=33",
    status: "approved" as const,
    date: "2025-09-22",
  },
  {
    id: "t4",
    name: "Sana Iqbal",
    company: "Curated by Sana",
    rating: 5,
    comment:
      "They rebuilt our brand, launched Meta and Google campaigns, and doubled our revenue in one quarter. Actual growth partners.",
    image: "https://i.pravatar.cc/150?img=48",
    status: "approved" as const,
    date: "2025-08-11",
  },
  {
    id: "t5",
    name: "Karthik Reddy",
    company: "Reddy Agri FPO",
    rating: 5,
    comment:
      "Set up our FPO, guided us through NABARD schemes, and built our profile deck. First-class service.",
    image: "https://i.pravatar.cc/150?img=15",
    status: "approved" as const,
    date: "2025-07-04",
  },
];

export const blogsSeed = [
  {
    id: "b1",
    slug: "choosing-right-business-structure-india-2026",
    title: "Choosing the Right Business Structure in India (2026 Edition)",
    excerpt:
      "Private Limited, LLP, OPC or Proprietorship? A practical, tax-first framework for founders.",
    content:
      "Every founder faces the same fork in the road: what legal structure do I register under? The answer looks technical, but it's really a question about how you plan to raise capital, distribute profits, and manage compliance overhead...\n\nA Private Limited Company is the default for anyone raising external capital. LLPs win on compliance simplicity. OPCs suit solo founders who want limited liability without a co-founder. Proprietorships are for micro-scale bootstrapped operations.\n\nOur rule of thumb: if you'll raise money in the next 24 months, incorporate a Pvt Ltd. If not, LLP. Only choose OPC or Proprietorship after ruling both out.",
    category: "Incorporation",
    author: "Almawa Editorial",
    date: "2026-01-08",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "b2",
    slug: "startup-india-dpiit-2026-benefits",
    title: "Startup India DPIIT Recognition: What's Actually Worth It in 2026",
    excerpt:
      "Tax holidays, IPR fast-tracking, tender exemptions — and the fine print most founders miss.",
    content:
      "DPIIT recognition is one of the most oversold benefits in the Indian startup ecosystem — and one of the most underused. Here's the honest breakdown...",
    category: "Funding",
    author: "Almawa Editorial",
    date: "2025-12-19",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "b3",
    slug: "iso-certification-guide-msme",
    title: "The MSME's Guide to ISO Certification",
    excerpt: "Which ISO you need, what it costs, and how long it really takes.",
    content:
      "ISO certification is a passport — for tenders, exports and enterprise clients. But which one, and at what cost? This guide breaks it down for MSMEs...",
    category: "Certifications",
    author: "Almawa Editorial",
    date: "2025-11-27",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "b4",
    slug: "pitch-deck-mistakes-2026",
    title: "7 Pitch Deck Mistakes That Kill Term Sheets",
    excerpt: "The patterns we see in decks that never make it past the first meeting.",
    content:
      "Every VC has seen a thousand decks this year. Yours has 90 seconds to earn the next meeting. Here are the seven mistakes we see most often...",
    category: "Funding",
    author: "Almawa Editorial",
    date: "2025-10-05",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "b5",
    slug: "seo-for-indian-msmes",
    title: "SEO for Indian MSMEs: A No-Fluff 90-Day Plan",
    excerpt: "The exact playbook we run for MSMEs starting from zero organic traffic.",
    content:
      "SEO for an MSME isn't about ranking for one big keyword. It's about owning a cluster of high-intent, low-competition searches that convert. Here's the 90-day plan...",
    category: "Marketing",
    author: "Almawa Editorial",
    date: "2025-09-14",
    image:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "b6",
    slug: "government-schemes-2026",
    title: "Top 10 Government Schemes Every Indian MSME Should Know",
    excerpt: "MUDRA, CGTMSE, PMEGP and the ones that fly under the radar.",
    content:
      "The Indian government runs dozens of schemes for MSMEs. Most owners know MUDRA — few know the rest. Here are the ten worth your attention...",
    category: "Funding",
    author: "Almawa Editorial",
    date: "2025-08-02",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
  },
];

export const faqs = [
  { q: "How quickly can I get incorporated?", a: "Typically 10–15 working days for Pvt Ltd or LLP once documents are ready." },
  { q: "Do you serve businesses outside metro cities?", a: "Yes — Almawa operates pan India, entirely digitally." },
  { q: "What's your pricing model?", a: "Fixed-scope packages for one-time services; monthly retainers for growth engagements." },
  { q: "Do you help with post-incorporation compliance?", a: "Yes — annual filings, ROC, GST and TDS are all handled through our compliance desk." },
  { q: "Can you introduce me to investors?", a: "Yes, once you're investor-ready. We won't shop an unfinished deck." },
  { q: "How is a pitch deck different from a company profile?", a: "A profile tells your story. A pitch deck asks for money. Both matter." },
  { q: "Do you take equity as payment?", a: "No — we're a services firm. Cash-only, transparent fees." },
  { q: "Can I speak to past clients?", a: "Absolutely, on request under NDA." },
];

export const gallerySeed = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
];

export const defaultSettings = {
  companyName: "Almawa Services",
  tagline: "Empowering Businesses Through Smart Consulting",
  phone: "+91 9561179693",
  phoneTwo: "+91 9561106693",
  email: "business@al-mawa.international",
  address: "1st Floor, Corporate Tower, MG Road, Bengaluru, India",
  social: {
    twitter: "https://x.com/al_mawa__",
    linkedin: "https://www.linkedin.com/company/al-mawa-international-opc-private-limited/posts/?feedView=all",
    instagram: "https://www.instagram.com/al_mawainternational?igsh=MXJkbWt3b3NvOTBmaw%3D%3D",
    facebook: "https://www.facebook.com/almawainternational",
  },
  seoTitle: "Almawa Services — Business Consulting, Incorporation & Fund Raising",
  seoDescription:
    "Pan-India business consulting for startups and MSMEs — incorporation, certifications, company profiling, fund raising and digital marketing.",
    maintenanceMode: false,
};

export const serviceOptions = [
  "Company Incorporation",
  "GST Registration",
  "MSME Registration",
  "Startup Registration",
  "Company Profiling",
  "Fund Raising",
  "Certifications",
  "Digital Marketing",
  "Website Development",
  "Other",
];

export const slugToServiceOption: Record<string, string> = {
  "company-incorporation": "Company Incorporation",
  certifications: "Certifications",
  "company-profiling": "Company Profiling",
  "fund-raising": "Fund Raising",
  "digital-marketing": "Digital Marketing",
};
