import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let parsedMongoUri = '';
envContent.split('\n').forEach(line => {
  const match = line.match(/^MONGODB_URI=(.*)$/);
  if (match) parsedMongoUri = match[1].trim().replace(/^['"]|['"]$/g, '');
});

const MONGODB_URI = parsedMongoUri || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true, maxlength: 250 },
    content: { type: String, required: true },
    icon: { type: String, default: "Briefcase" },
    image: { type: String },
    category: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    displayOrder: { type: Number, default: 1 },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
    faqs: { type: [{ q: String, a: String }], default: [] }
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

const services = [
  {
    name: "Company Incorporation",
    slug: "company-incorporation",
    category: "Business Registration",
    shortDescription: "Register Your Business the Right Way, the First Time. Starting a business requires the right structure, documentation, and compliance foundation.",
    seoTitle: "Company Incorporation | Almawa Services",
    seoDescription: "Register Your Business the Right Way, the First Time.",
    icon: "Building",
    status: "Active",
    displayOrder: 1,
    content: `
      <h2>Why Company Incorporation Matters</h2>
      <p>A properly incorporated business creates a strong legal and operational foundation for future growth, partnerships, funding, and compliance.</p>
      
      <h2>What We Help With</h2>
      <ul>
        <li>Business structure guidance</li>
        <li>Company registration support</li>
        <li>Documentation assistance</li>
        <li>Registration process guidance</li>
        <li>Compliance guidance</li>
        <li>Business setup support</li>
      </ul>

      <h2>Who Is This For?</h2>
      <ul>
        <li>Startups</li>
        <li>Entrepreneurs</li>
        <li>New business owners</li>
        <li>Growing businesses</li>
        <li>Founders planning expansion</li>
      </ul>

      <h2>How We Work</h2>
      <ol>
        <li>Understand Your Business</li>
        <li>Recommend the Appropriate Structure</li>
        <li>Prepare Required Documentation</li>
        <li>Support the Registration Process</li>
        <li>Help Establish the Compliance Foundation</li>
      </ol>
    `,
    faqs: [
      { q: "What is company incorporation?", a: "Company incorporation is the legal process used to form a corporate entity or company." },
      { q: "What documents are generally required?", a: "Generally, identity proofs (PAN/Aadhaar), address proofs, and registered office proofs are required." },
      { q: "How can Almawa Services help?", a: "We guide you through the entire process, handle documentation, and ensure compliance." },
      { q: "Can you help startups with business setup?", a: "Yes, we specialize in helping startups choose the right structure and get registered." }
    ]
  },
  {
    name: "Certifications",
    slug: "certifications",
    category: "Compliance",
    shortDescription: "Credibility That Opens Doors — and Tenders. Certifications can strengthen business credibility and help organizations meet specific requirements.",
    seoTitle: "Certifications | Almawa Services",
    seoDescription: "Credibility That Opens Doors — and Tenders.",
    icon: "Badge",
    status: "Active",
    displayOrder: 2,
    content: `
      <h2>Why Certifications Matter</h2>
      <p>Certifications can demonstrate commitment to quality, processes, standards, and professional business practices.</p>

      <h2>What We Help With</h2>
      <ul>
        <li>Certification requirement assessment</li>
        <li>Documentation preparation</li>
        <li>Process guidance</li>
        <li>Compliance preparation</li>
        <li>Certification support</li>
        <li>Renewal planning</li>
      </ul>

      <h2>Benefits</h2>
      <ul>
        <li>Improved business credibility</li>
        <li>Better tender readiness</li>
        <li>Stronger customer confidence</li>
        <li>Structured business processes</li>
        <li>Support for market opportunities</li>
      </ul>
    `,
    faqs: [
      { q: "Why are certifications important?", a: "They build trust with clients and are often required for government tenders and international trade." },
      { q: "What types of certifications do you handle?", a: "We handle ISO, FSSAI, Trademark, MSME, Startup India, IEC, and more." },
      { q: "How long does the certification process take?", a: "It varies by certification, but we streamline the process to be as fast as possible." }
    ]
  },
  {
    name: "Company Profiling",
    slug: "company-profiling",
    category: "Branding",
    shortDescription: "A Story Your Investors, Clients and Partners Will Remember. A strong company profile communicates who you are and what you do.",
    seoTitle: "Company Profiling | Almawa Services",
    seoDescription: "A Story Your Investors, Clients and Partners Will Remember.",
    icon: "Presentation",
    status: "Active",
    displayOrder: 3,
    content: `
      <h2>What We Create</h2>
      <ul>
        <li>Professional company profile</li>
        <li>Business introduction</li>
        <li>Company history</li>
        <li>Vision and mission</li>
        <li>Products and services</li>
        <li>Capabilities</li>
        <li>Achievements</li>
        <li>Client portfolio</li>
        <li>Team information</li>
        <li>Contact information</li>
      </ul>

      <h2>Why a Strong Company Profile Matters</h2>
      <p>A professional company profile can help businesses communicate their capabilities to customers, investors, partners, vendors, and other stakeholders.</p>

      <h2>Who Needs Company Profiling?</h2>
      <ul>
        <li>Startups</li>
        <li>SMEs</li>
        <li>Established companies</li>
        <li>Manufacturers</li>
        <li>Service businesses</li>
        <li>Contractors</li>
        <li>Businesses participating in tenders</li>
      </ul>
    `,
    faqs: [
      { q: "What makes a good company profile?", a: "A good profile tells a clear story, highlights key capabilities, and is professionally designed." },
      { q: "Can you help with the content as well as the design?", a: "Yes, we handle both the copywriting and the professional design of the profile." },
      { q: "What formats do you deliver?", a: "We typically deliver in digital PDF format and editable source files." }
    ]
  },
  {
    name: "Fund Raising",
    slug: "fund-raising",
    category: "Finance",
    shortDescription: "Capital, on Your Terms. Raising capital requires a clear business story, strong financial information, and realistic planning.",
    seoTitle: "Fund Raising | Almawa Services",
    seoDescription: "Capital, on Your Terms.",
    icon: "TrendingUp",
    status: "Active",
    displayOrder: 4,
    content: `
      <h2>Fundraising Support</h2>
      <ul>
        <li>Business plan preparation</li>
        <li>Investor presentation support</li>
        <li>Pitch deck preparation</li>
        <li>Financial information organization</li>
        <li>Funding strategy</li>
        <li>Investor readiness</li>
        <li>Business valuation support</li>
        <li>Funding documentation guidance</li>
      </ul>

      <h2>Fundraising Process</h2>
      <ol>
        <li>Understand the Business</li>
        <li>Assess Funding Requirements</li>
        <li>Prepare Business Materials</li>
        <li>Develop the Funding Strategy</li>
        <li>Prepare for Investor Discussions</li>
        <li>Support the Fundraising Process</li>
      </ol>
      <p><em>Note: We do not promise guaranteed funding or guaranteed investors. We provide professional preparation and strategic support.</em></p>
    `,
    faqs: [
      { q: "What is a pitch deck?", a: "A pitch deck is a brief presentation used to provide your audience with a quick overview of your business plan." },
      { q: "Do you guarantee funding?", a: "No, we cannot guarantee funding. We ensure you are fully prepared and investor-ready." },
      { q: "What financial documents do I need?", a: "You generally need past financial statements, financial projections, and a clear cap table." }
    ]
  },
  {
    name: "Digital Marketing",
    slug: "digital-marketing",
    category: "Marketing",
    shortDescription: "Growth Engineered, Not Guessed. Digital marketing helps businesses reach the right audience and generate leads.",
    seoTitle: "Digital Marketing | Almawa Services",
    seoDescription: "Growth Engineered, Not Guessed.",
    icon: "Megaphone",
    status: "Active",
    displayOrder: 5,
    content: `
      <h2>What We Help With</h2>
      <ul>
        <li>Digital marketing strategy</li>
        <li>Search engine optimization</li>
        <li>Social media marketing</li>
        <li>Content strategy</li>
        <li>Lead generation</li>
        <li>Website optimization</li>
        <li>Online brand positioning</li>
        <li>Performance tracking</li>
      </ul>

      <h2>Our Approach</h2>
      <ol>
        <li>Understand the Business</li>
        <li>Identify the Target Audience</li>
        <li>Define Marketing Goals</li>
        <li>Build the Strategy</li>
        <li>Execute Campaigns</li>
        <li>Measure Performance</li>
        <li>Optimize</li>
      </ol>

      <h2>Key Outcomes</h2>
      <ul>
        <li>Stronger online presence</li>
        <li>Better audience engagement</li>
        <li>Improved lead generation</li>
        <li>Better brand visibility</li>
        <li>Data-driven marketing decisions</li>
      </ul>
      <p><em>Note: We do not guarantee specific traffic, leads, rankings, or revenue, as results depend on market conditions.</em></p>
    `,
    faqs: [
      { q: "How long does SEO take to show results?", a: "SEO typically takes 3 to 6 months to start showing significant results." },
      { q: "What social platforms should I be on?", a: "It depends on your target audience. B2B often does well on LinkedIn, while B2C might prefer Instagram or Meta." },
      { q: "Do you provide weekly reporting?", a: "Yes, we provide transparent weekly or monthly reporting on key performance indicators." }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    await Service.deleteMany({ slug: { $in: services.map(s => s.slug) } });
    console.log("Cleared existing target services");

    await Service.insertMany(services);
    console.log("Successfully seeded services!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
