import { Edit, ImageUp, Layers, Trash, Images, FileText } from "lucide-react";
import { ColumnDef, RowAction } from "./TableTypes";
import {
  CourseRow,
  StudentRow,
  AuthorRow,
  IssuerRow,
  SiteDetailRow,
  EnrollmentRow,
} from "../types/admin";
import React from "react";

export interface TabConfig<T> {
  icon: React.FC<any>;
  columns: ColumnDef<T>[];
  actions: RowAction<T>[];
  addLabel: string;
}

export const courseColumns: ColumnDef<CourseRow>[] = [
  { key: "n", header: "N", render: (_r, i) => i + 1 },
  { key: "type", header: "Course Type", render: (r) => r.courseTypeName },
  { key: "name", header: "Course Name", render: (r) => r.courseName },
  {
    key: "short",
    header: "Short Description",
    render: (r) => r.shortDescription,
  },
  { key: "priceGel", header: "Price (GEL)", render: (r) => r.priceGEL },
  { key: "priceUsd", header: "Price (USD)", render: (r) => r.priceUSD },
  { key: "status", header: "Status", render: (r) => r.courseStatusName },
  {
    key: "cert",
    header: "Certification",
    render: (r) => r.certificationTypeName,
  },
  {
    key: "created",
    header: "Created At",
    render: (r) =>
      r.createdAt ? r.createdAt.slice(0, 19).replace("T", " ") : "—",
  },
];

export const studentColumns: ColumnDef<StudentRow>[] = [
  { key: "n", header: "N", render: (_r, i) => i + 1 },
  { key: "fn", header: "First Name", render: (r) => r.firstName },
  { key: "ln", header: "Last Name", render: (r) => r.lastName },
  { key: "sex", header: "Sex", render: (r) => r.sexTypeName ?? "—" },
  { key: "birth", header: "Birth Date", render: (r) => r.birthDate ?? "—" },
  { key: "email", header: "Email", render: (r) => r.email ?? "—" },
  { key: "phone", header: "Phone Number", render: (r) => r.phoneNumber ?? "—" },
  { key: "title", header: "Title", render: (r) => r.title ?? "—" },
  {
    key: "fav",
    header: "Academy Favourite",
    render: (r) => (r.academyFavourite ? "Yes" : "No"),
  },
  {
    key: "feat",
    header: "Featured",
    render: (r) => (r.featured ? "Yes" : "No"),
  },
];

export const authorColumns: ColumnDef<AuthorRow>[] = [
  { key: "n", header: "N", render: (_r, i) => i + 1 },
  { key: "fn", header: "First Name", render: (r) => r.firstName },
  { key: "ln", header: "Last Name", render: (r) => r.lastName },
  { key: "title", header: "Title", render: (r) => r.title ?? "—" },
  { key: "desc", header: "Description", render: (r) => r.description ?? "—" },
  {
    key: "short",
    header: "Short Description",
    render: (r) => r.shortDescription ?? "—",
  },
];

export const issuerColumns: ColumnDef<IssuerRow>[] = [
  { key: "n", header: "N", render: (_r, i) => i + 1 },
  { key: "name", header: "Name", render: (r) => r.issuerName },
  { key: "nameGeo", header: "Name (Geo)", render: (r) => r.issuerNameGeo },
  {
    key: "desc",
    header: "Description",
    render: (r) => r.issuerDescription ?? "—",
  },
  {
    key: "descGeo",
    header: "Description (Geo)",
    render: (r) => r.issuerDescriptionGeo ?? "—",
  },
  {
    key: "established",
    header: "Established",
    render: (r) => r.establishedDate ?? "—",
  },
];

export const siteDetailColumns: ColumnDef<SiteDetailRow>[] = [
  { key: "n", header: "N", render: (_r, i) => i + 1 },
  { key: "pageType", header: "Page Type", render: (r) => r.pageTypeName },
  { key: "title", header: "Title", render: (r) => r.title },
  { key: "titleGeo", header: "Title (Geo)", render: (r) => r.titleGeo },
  { key: "subtitle", header: "Subtitle", render: (r) => r.subtitle },
  {
    key: "subtitleGeo",
    header: "Subtitle (Geo)",
    render: (r) => r.subtitleGeo,
  },
  {
    key: "created",
    header: "Created At",
    render: (r) =>
      r.createdAt ? r.createdAt.slice(0, 19).replace("T", " ") : "—",
  },
];

export const enrollmentColumns: ColumnDef<EnrollmentRow>[] = [
  { key: "n", header: "N", render: (_r, i) => i + 1 },
  { key: "course", header: "Course", render: (r) => r.courseName },
  { key: "student", header: "Student", render: (r) => r.studentName },
  { key: "issuer", header: "Issuer", render: (r) => r.issuerName ?? "—" },
  {
    key: "certDate",
    header: "Certification Date",
    render: (r) => r.certificationDate ?? "—",
  },
  {
    key: "validity",
    header: "Validity (days)",
    render: (r) => r.validityPeriodInDays,
  },
  {
    key: "key",
    header: "Certificate Key",
    render: (r) => r.certificateUniqueKey ?? "—",
  },
];

type CourseHandlers = Partial<{
  onEdit: (r: CourseRow) => void;
  onUploadMedia: (r: CourseRow) => void;
  onManageMedia: (r: CourseRow) => void;
  onManageSections: (r: CourseRow) => void;
  onDelete: (r: CourseRow) => void;
}>;

export const courseActions = (
  h: CourseHandlers = {}
): RowAction<CourseRow>[] => {
  const a: RowAction<CourseRow>[] = [];
  if (h.onEdit)
    a.push({
      id: "edit",
      label: "Update details",
      icon: <Edit size={18} />,
      onClick: h.onEdit,
    });
  if (h.onUploadMedia)
    a.push({
      id: "upload-media",
      label: "Upload media",
      icon: <ImageUp size={18} />,
      onClick: h.onUploadMedia,
    });
  if (h.onManageMedia)
    a.push({
      id: "manage-media",
      label: "Manage media",
      icon: <Images size={18} />,
      onClick: h.onManageMedia,
    });
  if (h.onManageSections)
    a.push({
      id: "sections",
      label: "Manage sections",
      icon: <Layers size={18} />,
      onClick: h.onManageSections,
    });
  if (h.onDelete)
    a.push({
      id: "delete",
      label: "Delete",
      icon: <Trash size={18} />,
      onClick: h.onDelete,
    });
  return a;
};

type StudentHandlers = Partial<{
  onEdit: (r: StudentRow) => void;
  onUploadCover: (r: StudentRow) => void;
  onManageMedia: (r: StudentRow) => void;
  onManageRecords: (r: StudentRow) => void;
  onManageSocials: (r: StudentRow) => void;
  onDelete: (r: StudentRow) => void;
}>;

export const studentActions = (
  h: StudentHandlers = {}
): RowAction<StudentRow>[] => {
  const a: RowAction<StudentRow>[] = [];
  if (h.onEdit)
    a.push({
      id: "edit",
      label: "Update details",
      icon: <Edit size={18} />,
      onClick: h.onEdit,
    });
  if (h.onUploadCover)
    a.push({
      id: "cover",
      label: "Upload media",
      icon: <ImageUp size={18} />,
      onClick: h.onUploadCover,
    });
  if (h.onManageMedia)
    a.push({
      id: "manage-media",
      label: "Manage media",
      icon: <Images size={18} />,
      onClick: h.onManageMedia,
    });
  if (h.onManageRecords)
    a.push({
      id: "manage-records",
      label: "Manage records",
      icon: <FileText size={18} />,
      onClick: h.onManageRecords,
    });
  if (h.onManageSocials)
    a.push({
      id: "manage-socials",
      label: "Manage social links",
      icon: <FileText size={18} />,
      onClick: h.onManageSocials,
    });
  if (h.onDelete)
    a.push({
      id: "delete",
      label: "Delete",
      icon: <Trash size={18} />,
      onClick: h.onDelete,
    });
  return a;
};

type AuthorHandlers = Partial<{
  onEdit: (r: AuthorRow) => void;
  onUploadCover: (r: AuthorRow) => void;
  onManageMedia: (r: AuthorRow) => void;
  onManageRecords: (r: AuthorRow) => void;
  onManageSocials: (r: AuthorRow) => void;
  onDelete: (r: AuthorRow) => void;
}>;

export const authorActions = (
  h: AuthorHandlers = {}
): RowAction<AuthorRow>[] => {
  const a: RowAction<AuthorRow>[] = [];
  if (h.onEdit)
    a.push({
      id: "edit",
      label: "Update details",
      icon: <Edit size={18} />,
      onClick: h.onEdit,
    });
  if (h.onUploadCover)
    a.push({
      id: "cover",
      label: "Upload media",
      icon: <ImageUp size={18} />,
      onClick: h.onUploadCover,
    });
  if (h.onManageMedia)
    a.push({
      id: "manage-media",
      label: "Manage media",
      icon: <Images size={18} />,
      onClick: h.onManageMedia,
    });
  if (h.onManageRecords)
    a.push({
      id: "manage-records",
      label: "Manage records",
      icon: <FileText size={18} />,
      onClick: h.onManageRecords,
    });
  if (h.onManageSocials)
    a.push({
      id: "manage-socials",
      label: "Manage social links",
      icon: <FileText size={18} />,
      onClick: h.onManageSocials,
    });
  if (h.onDelete)
    a.push({
      id: "delete",
      label: "Delete",
      icon: <Trash size={18} />,
      onClick: h.onDelete,
    });
  return a;
};

type IssuerHandlers = Partial<{
  onEdit: (r: IssuerRow) => void;
  onUploadMedia: (r: IssuerRow) => void;
  onManageMedia: (r: IssuerRow) => void;
  onManageSocials: (r: IssuerRow) => void;
  onDelete: (r: IssuerRow) => void;
}>;

export const issuerActions = (
  h: IssuerHandlers = {}
): RowAction<IssuerRow>[] => {
  const a: RowAction<IssuerRow>[] = [];
  if (h.onEdit)
    a.push({
      id: "edit",
      label: "Update details",
      icon: <Edit size={18} />,
      onClick: h.onEdit,
    });
  if (h.onUploadMedia)
    a.push({
      id: "upload-media",
      label: "Upload media",
      icon: <ImageUp size={18} />,
      onClick: h.onUploadMedia,
    });
  if (h.onManageMedia)
    a.push({
      id: "manage-media",
      label: "Manage media",
      icon: <Images size={18} />,
      onClick: h.onManageMedia,
    });
  if (h.onManageSocials)
    a.push({
      id: "manage-socials",
      label: "Manage social links",
      icon: <FileText size={18} />,
      onClick: h.onManageSocials,
    });
  if (h.onDelete)
    a.push({
      id: "delete",
      label: "Delete",
      icon: <Trash size={18} />,
      onClick: h.onDelete,
    });
  return a;
};

type SiteDetailHandlers = Partial<{
  onEdit: (r: SiteDetailRow) => void;
  onUploadMedia: (r: SiteDetailRow) => void;
  onManageMedia: (r: SiteDetailRow) => void;
  onDelete: (r: SiteDetailRow) => void;
}>;

export const siteDetailActions = (
  h: SiteDetailHandlers = {}
): RowAction<SiteDetailRow>[] => {
  const a: RowAction<SiteDetailRow>[] = [];
  if (h.onEdit)
    a.push({
      id: "edit",
      label: "Update details",
      icon: <Edit size={18} />,
      onClick: h.onEdit,
    });
  if (h.onUploadMedia)
    a.push({
      id: "upload-media",
      label: "Upload media",
      icon: <ImageUp size={18} />,
      onClick: h.onUploadMedia,
    });
  if (h.onManageMedia)
    a.push({
      id: "manage-media",
      label: "Manage media",
      icon: <Images size={18} />,
      onClick: h.onManageMedia,
    });
  if (h.onDelete)
    a.push({
      id: "delete",
      label: "Delete",
      icon: <Trash size={18} />,
      onClick: h.onDelete,
    });
  return a;
};

type EnrollmentHandlers = Partial<{
  onEdit: (r: EnrollmentRow) => void;
  onUploadMedia: (r: EnrollmentRow) => void;
  onManageMedia: (r: EnrollmentRow) => void;
  onDelete: (r: EnrollmentRow) => void;
}>;

export const enrollmentActions = (
  h: EnrollmentHandlers = {}
): RowAction<EnrollmentRow>[] => {
  const a: RowAction<EnrollmentRow>[] = [];
  if (h.onEdit)
    a.push({
      id: "edit",
      label: "Update details",
      icon: <Edit size={18} />,
      onClick: h.onEdit,
    });
  if (h.onUploadMedia)
    a.push({
      id: "upload-media",
      label: "Upload media",
      icon: <ImageUp size={18} />,
      onClick: h.onUploadMedia,
    });
  if (h.onManageMedia)
    a.push({
      id: "manage-media",
      label: "Manage media",
      icon: <Images size={18} />,
      onClick: h.onManageMedia,
    });
  if (h.onDelete)
    a.push({
      id: "delete",
      label: "Delete",
      icon: <Trash size={18} />,
      onClick: h.onDelete,
    });
  return a;
};
