// src/lib/admin-data.ts

export const dashboardStats = [
  {
    title: "Total Leads",
    value: 124,
    change: "+12.5%",
    trend: "up"
  },
  {
    title: "Consultations",
    value: 48,
    change: "+5.2%",
    trend: "up"
  },
  {
    title: "Contact Messages",
    value: 86,
    change: "-2.4%",
    trend: "down"
  },
  {
    title: "Active Services",
    value: 12,
    change: "+1",
    trend: "up"
  }
];

export const leadsChartData = [
  { name: 'April', leads: 40, consultations: 24, conversions: 12 },
  { name: 'May', leads: 30, consultations: 13, conversions: 8 },
  { name: 'June', leads: 20, consultations: 38, conversions: 24 },
  { name: 'July', leads: 27, consultations: 39, conversions: 28 },
  { name: 'August', leads: 18, consultations: 48, conversions: 35 },
  { name: 'September', leads: 23, consultations: 38, conversions: 29 },
];

export const recentLeads = [
  { id: 1, name: "Rahul Sharma", company: "RS Technologies", email: "rahul@example.com", service: "Business Consulting", status: "New", date: "2024-05-24" },
  { id: 2, name: "Priya Mehta", company: "PM Enterprises", email: "priya@example.com", service: "Digital Transformation", status: "Qualified", date: "2024-05-23" },
  { id: 3, name: "Amit Verma", company: "AV Industries", email: "amit@example.com", service: "Business Strategy", status: "Contacted", date: "2024-05-22" },
  { id: 4, name: "Sneha Rao", company: "Startup Hub", email: "sneha@example.com", service: "Process Optimization", status: "Converted", date: "2024-05-21" },
  { id: 5, name: "Kiran Kumar", company: "KK Solutions", email: "kiran@example.com", service: "Technology Consulting", status: "Closed", date: "2024-05-20" },
];

export const consultationRequests = [
  { id: 1, client: "Anil Kapoor", company: "AK Corp", service: "Growth Strategy", date: "2024-06-01", status: "Pending" },
  { id: 2, client: "Deepa Nair", company: "Nair Logistics", service: "Business Consulting", date: "2024-05-28", status: "Confirmed" },
  { id: 3, client: "Sanjay Patel", company: "Patel Manufacturing", service: "Process Optimization", date: "2024-05-25", status: "Completed" },
  { id: 4, client: "Meera Reddy", company: "Reddy Foods", service: "Digital Transformation", date: "2024-05-22", status: "Cancelled" },
];

export const servicesPerformance = [
  { id: 1, name: "Business Consulting", enquiries: 45, conversionRate: 35 },
  { id: 2, name: "Digital Transformation", enquiries: 32, conversionRate: 42 },
  { id: 3, name: "Business Strategy", enquiries: 28, conversionRate: 25 },
  { id: 4, name: "Process Optimization", enquiries: 18, conversionRate: 55 },
  { id: 5, name: "Technology Consulting", enquiries: 22, conversionRate: 40 },
  { id: 6, name: "Growth Strategy", enquiries: 15, conversionRate: 60 },
];

export const recentActivities = [
  { id: 1, title: "New consultation request received", time: "5 minutes ago", type: "consultation" },
  { id: 2, title: "New contact message received", time: "25 minutes ago", type: "message" },
  { id: 3, title: "New testimonial submitted", time: "1 hour ago", type: "testimonial" },
  { id: 4, title: "Lead status changed to Qualified", time: "2 hours ago", type: "lead" },
  { id: 5, title: "New admin user created", time: "Yesterday", type: "system" },
];

export const notifications = [
  { id: 1, title: "New consultation request", time: "2 minutes ago", isRead: false },
  { id: 2, title: "New lead received", time: "15 minutes ago", isRead: false },
  { id: 3, title: "New contact message", time: "1 hour ago", isRead: true },
  { id: 4, title: "System update completed", time: "Yesterday", isRead: true },
];

export const industriesData = [
  { id: 1, name: "Healthcare", clients: 24, activeProjects: 5 },
  { id: 2, name: "Financial Services", clients: 42, activeProjects: 12 },
  { id: 3, name: "Retail & E-commerce", clients: 18, activeProjects: 3 },
  { id: 4, name: "Manufacturing", clients: 31, activeProjects: 8 },
  { id: 5, name: "Technology", clients: 56, activeProjects: 15 },
  { id: 6, name: "Real Estate", clients: 15, activeProjects: 2 },
];

export const testimonialsData = [
  {
    id: 1,
    clientName: "Sarah Jenkins",
    company: "TechNova Solutions",
    rating: 5,
    status: "approved",
    text: "Almawa Services transformed our internal processes. Their digital strategy consulting was top-notch.",
    date: "2024-05-12"
  },
  {
    id: 2,
    clientName: "Michael Chang",
    company: "Apex Retail",
    rating: 5,
    status: "pending",
    text: "The team provided excellent guidance during our market expansion phase. Highly recommended.",
    date: "2024-05-20"
  },
  {
    id: 3,
    clientName: "Emily Rodriguez",
    company: "HealthFirst Clinics",
    rating: 4,
    status: "approved",
    text: "Very professional and knowledgeable. They helped us streamline our patient management systems.",
    date: "2024-04-05"
  }
];
