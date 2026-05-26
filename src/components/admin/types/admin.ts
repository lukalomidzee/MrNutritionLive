export type EntityType =
  | "Courses"
  | "Students"
  | "Authors"
  | "Issuers"
  | "SiteDetails"
  | "Enrollments"
  | "ProfileRecords"
  | "SocialLinks"
  | "Dictionaries";

export type MediaEntityType =
  | "Author"
  | "Issuer"
  | "SiteDetail"
  | "CourseMaterials"
  | "Section"
  | "Enrollment"
  | "Student"
  | "EducationRecord";

export type StorageProvider = "Local" | "External";

export type ProfileRecordKind =
  | "education"
  | "language"
  | "profession"
  | "work-experience"
  | "district";

export type ProfileOwnerType = "Author" | "Student";
export type SocialLinkOwnerType = "Author" | "Student" | "Issuer" | "SiteDetail";

export interface BaseRow { id: string }

export interface CourseRow extends BaseRow {
  courseTypeName: string;
  courseName: string;
  shortDescription: string;
  priceGEL: number;
  priceUSD: number;
  courseStatusName: string;
  certificationTypeName: string;
  createdAt: string;
  version: number;
}

export interface StudentRow extends BaseRow {
  firstName: string;
  lastName: string;
  sexTypeName: string;
  birthDate?: string;
  email?: string;
  phoneNumber?: string;
  title?: string;
  emailVisible?: boolean;
  phoneVisible?: boolean;
  academyFavourite?: boolean;
  featured?: boolean;
  version: number;
}

export interface AuthorRow extends BaseRow {
  firstName: string;
  lastName: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  version: number;
}

export interface IssuerRow extends BaseRow {
  issuerName: string;
  issuerNameGeo: string;
  issuerDescription: string;
  issuerDescriptionGeo: string;
  establishedDate?: string;
  version: number;
}

export interface SiteDetailRow extends BaseRow {
  pageTypeName: string;
  title: string;
  titleGeo: string;
  subtitle: string;
  subtitleGeo: string;
  titleColor?: string;
  subtitleColor?: string;
  createdAt: string;
  version: number;
}

export interface EnrollmentRow extends BaseRow {
  courseName: string;
  studentName: string;
  issuerName?: string;
  certificationDate?: string;
  validityPeriodInDays: number;
  certificateUniqueKey?: string;
  version: number;
}

export interface SectionRow extends BaseRow {
  heading: string;
  headingGeo: string;
  paragraph?: string;
  paragraphGeo?: string;
  coverUrl?: string;
  order?: number;
}
