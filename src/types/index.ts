import { Document } from "mongoose";

// Base interface for all documents
export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

// Scholarship interfaces
export interface IScholarship extends BaseDocument {
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  location: string;
  level:
    | "Undergraduate"
    | "Graduate"
    | "Master's"
    | "PhD"
    | "Postgraduate"
    | "Various";
  description: string;
  requirements: string;
  benefits: string;
  category:
    | "Research"
    | "Leadership"
    | "Development"
    | "Exchange"
    | "Academic"
    | "Merit-based"
    | "Need-based";
  applicationUrl?: string;
  status: "active" | "inactive" | "expired";
}

export interface ScholarshipFormData {
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  location: string;
  level: IScholarship["level"];
  description: string;
  requirements: string;
  benefits: string;
  category: IScholarship["category"];
  applicationUrl?: string;
  status: IScholarship["status"];
}

// Event interfaces
export interface IEvent extends BaseDocument {
  title: string;
  description: string;
  eventType: "virtual" | "in-person" | "hybrid";
  date: string;
  time: string;
  duration: string;
  location: string;
  maxAttendees?: string;
  registrationFee?: string;
  targetAudience: string;
  agenda?: string;
  speakers?: string;
  requirements?: string;
  registrationDeadline?: string;
  status: "draft" | "published" | "cancelled" | "completed";
  featuredImage?: string;
  registeredCount: number;
}

export interface EventFormData {
  title: string;
  description: string;
  eventType: IEvent["eventType"];
  date: string;
  time: string;
  duration: string;
  location: string;
  maxAttendees?: string;
  registrationFee?: string;
  targetAudience: string;
  agenda?: string;
  speakers?: string;
  requirements?: string;
  registrationDeadline?: string;
  status: IEvent["status"];
  featuredImage?: string;
}

// Country interfaces
export interface ICountry extends BaseDocument {
  name: string;
  slug: string;
  flagCode: string;
  description: string;
  benefits: string;
  scholarships: string;
  visaRequirements: string;
  popularUniversities?: string;
  costOfLiving?: string;
  languageRequirements?: string;
  status: "active" | "inactive";
}

export interface CountryFormData {
  name: string;
  slug: string;
  flagCode: string;
  description: string;
  benefits: string;
  scholarships: string;
  visaRequirements: string;
  popularUniversities?: string;
  costOfLiving?: string;
  languageRequirements?: string;
}

// Query interfaces
export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ScholarshipQuery extends PaginationQuery {
  status?: IScholarship["status"];
  category?: IScholarship["category"];
  level?: IScholarship["level"];
}

export interface EventQuery extends PaginationQuery {
  status?: IEvent["status"];
  eventType?: IEvent["eventType"];
}

export interface CountryQuery extends PaginationQuery {
  status?: ICountry["status"];
}

// Response interfaces
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface StatisticsOverview {
  total: number;
  [key: string]: number;
}

export interface ScholarshipStats {
  overview: StatisticsOverview;
  byCategory: Array<{ _id: string; count: number }>;
}

export interface EventStats {
  overview: StatisticsOverview;
  byType: Array<{ _id: string; count: number }>;
}

export interface CountryStats {
  overview: StatisticsOverview;
}
