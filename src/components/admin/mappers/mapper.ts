import {
  CourseRow,
  AuthorRow,
  StudentRow,
  SectionRow,
  IssuerRow,
  SiteDetailRow,
  EnrollmentRow,
} from "../types/admin";

export const mapCourseDto = (d: any): CourseRow => ({
  id: d.id ?? d.Id,
  courseTypeName: d.courseTypeName ?? d.CourseTypeName ?? "",
  courseName: d.courseName ?? d.CourseName ?? "",
  shortDescription: d.shortDescription ?? d.ShortDescription ?? "",
  priceGEL: d.priceGEL ?? d.PriceGEL ?? 0,
  priceUSD: d.priceUSD ?? d.PriceUSD ?? 0,
  courseStatusName: d.courseStatusName ?? d.CourseStatusName ?? "",
  certificationTypeName:
    d.certificationTypeName ?? d.CertificationTypeName ?? "",
  createdAt: d.createdAt ?? d.CreatedAt ?? "",
  version: d.version ?? d.Version ?? 0,
});

export const mapStudentDto = (d: any): StudentRow => ({
  id: d.id ?? d.Id,
  firstName: d.firstName ?? d.FirstName ?? "",
  lastName: d.lastName ?? d.LastName ?? "",
  sexTypeName: d.sexTypeName ?? d.SexTypeName ?? "",
  birthDate: d.birthDate ?? d.BirthDate ?? undefined,
  email: d.email ?? d.Email ?? undefined,
  phoneNumber: d.phoneNumber ?? d.PhoneNumber ?? undefined,
  title: d.title ?? d.Title ?? undefined,
  emailVisible: d.emailVisible ?? d.EmailVisible ?? true,
  phoneVisible: d.phoneVisible ?? d.PhoneVisible ?? true,
  academyFavourite: d.academyFavourite ?? d.AcademyFavourite ?? false,
  featured: d.featured ?? d.Featured ?? false,
  version: d.version ?? d.Version ?? 0,
});

export const mapAuthorDto = (d: any): AuthorRow => ({
  id: d.id ?? d.Id,
  firstName: d.firstName ?? d.FirstName ?? "",
  lastName: d.lastName ?? d.LastName ?? "",
  title: d.title ?? d.Title ?? undefined,
  description: d.description ?? d.Description ?? undefined,
  shortDescription:
    d.shortDescription ?? d.ShortDescription ?? undefined,
  version: d.version ?? d.Version ?? 0,
});

export const mapIssuerDto = (d: any): IssuerRow => ({
  id: d.id ?? d.Id,
  issuerName: d.issuerName ?? d.IssuerName ?? "",
  issuerNameGeo: d.issuerNameGeo ?? d.IssuerNameGeo ?? "",
  issuerDescription: d.issuerDescription ?? d.IssuerDescription ?? "",
  issuerDescriptionGeo:
    d.issuerDescriptionGeo ?? d.IssuerDescriptionGeo ?? "",
  establishedDate: d.establishedDate ?? d.EstablishedDate ?? undefined,
  version: d.version ?? d.Version ?? 0,
});

export const mapSiteDetailDto = (d: any): SiteDetailRow => ({
  id: d.id ?? d.Id,
  pageTypeName: d.pageTypeName ?? d.PageTypeName ?? "",
  title: d.title ?? d.Title ?? "",
  titleGeo: d.titleGeo ?? d.TitleGeo ?? "",
  subtitle: d.subtitle ?? d.Subtitle ?? "",
  subtitleGeo: d.subtitleGeo ?? d.SubtitleGeo ?? "",
  titleColor: d.titleColor ?? d.TitleColor ?? undefined,
  subtitleColor: d.subtitleColor ?? d.SubtitleColor ?? undefined,
  createdAt: d.createdAt ?? d.CreatedAt ?? "",
  version: d.version ?? d.Version ?? 0,
});

export const mapEnrollmentDto = (d: any): EnrollmentRow => ({
  id: d.id ?? d.Id,
  courseName: d.courseName ?? d.CourseName ?? "",
  studentName: `${d.studentFirstName ?? d.StudentFirstName ?? ""} ${
    d.studentLastName ?? d.StudentLastName ?? ""
  }`.trim(),
  issuerName: d.issuerName ?? d.IssuerName ?? undefined,
  certificationDate: d.certificationDate ?? d.CertificationDate ?? undefined,
  validityPeriodInDays:
    d.validityPeriodInDays ?? d.ValidityPeriodInDays ?? 0,
  certificateUniqueKey:
    d.certificateUniqueKey ?? d.CertificateUniqueKey ?? undefined,
  version: d.version ?? d.Version ?? 0,
});

export const mapSectionDto = (d: any): SectionRow => ({
  id: d.id ?? d.Id,
  heading: d.heading ?? d.Heading ?? "",
  headingGeo: d.headingGeo ?? d.HeadingGeo ?? "",
  paragraph: d.paragraph ?? d.Paragraph ?? "",
  paragraphGeo: d.paragraphGeo ?? d.ParagraphGeo ?? "",
  coverUrl: d.coverUrl ?? d.CoverUrl ?? d.imageUrl ?? undefined,
  order: d.order ?? d.Order ?? undefined,
});
