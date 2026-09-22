export const SERVICE_CATEGORIES = [
  "Business Consulting",
  "Strategy",
  "Digital Transformation",
  "Technology",
  "Operations",
  "Business Growth",
  "Process Optimization",
] as const;

export type ServiceCategory =
  (typeof SERVICE_CATEGORIES)[number];

export type ServiceStatus =
  | "active"
  | "inactive";

export interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  content: string;
  icon: string;
  image: string;
  category: ServiceCategory;
  status: ServiceStatus;
  displayOrder: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFormData {
  name: string;
  slug: string;
  shortDescription: string;
  content: string;
  icon: string;
  image: string;
  category: ServiceCategory | "";
  status: ServiceStatus;
  displayOrder: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}