export const MEDIA_ROLE_NAMES_BY_ENTITY: Record<
  "CourseMaterials" | "Author" | "Student" | "Issuer" | "SiteDetail",
  string[]
> = {
  CourseMaterials: [
    "CourseCover",
    "CourseThumbnail",
    "CourseBackground",
    "CourseIntroVideo",
    "CourseSyllabus",
    "CourseCertificateTemplate",
    "CourseGalleryItem",
  ],
  Author: [
    "AuthorCover",
    "AuthorThumbnail",
    "AuthorBackground",
    "AuthorVideo",
    "AuthorPlaylist",
    "AuthorGallery",
  ],
  Student: [
    "StudentCover",
    "StudentThumbnail",
    "StudentBackground",
    "StudentPlaylist",
    "StudentVideo",
  ],
  Issuer: ["IssuerLogo", "IssuerCover", "IssuerBackground"],
  SiteDetail: ["SiteDetailBackground", "SiteDetailVideo"],
};
