import { Document, Types } from "mongoose";
import { z } from "zod";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../lib/validations/auth.validation";

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

export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Statistics Types
export interface ApplicationStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface ServiceStats {
  total: number;
  byStatus: Record<string, number>;
  byIcon: Record<string, number>;
  byColor: Record<string, number>;
}

// Filter and Sort Types
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ApplicationFilters extends BaseQueryParams {
  status?: string;
  priority?: string;
  country?: string;
  sortBy?: "createdAt" | "updatedAt" | "firstName" | "lastName" | "email";
}

export interface ServiceFilters extends BaseQueryParams {
  isActive?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "title";
}

export interface MongoFilter {
  [key: string]: any;
  $or?: Array<{ [key: string]: RegExp | string }>;
}

export interface SortOptions {
  [key: string]: 1 | -1;
}
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ServiceResponse {
  id: string;
  title: string;
  description: string;
  icon: "globe" | "graduation-cap" | "users" | "book";
  color: "green" | "red" | "blue" | "yellow";
  features: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): Omit<IUser, "password" | "resetPasswordToken">;
}

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  resetToken?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: Date;
  lastLogin?: Date | null;
}

export interface AuthServiceResponse {
  message: string;
  resetToken?: string;
}
