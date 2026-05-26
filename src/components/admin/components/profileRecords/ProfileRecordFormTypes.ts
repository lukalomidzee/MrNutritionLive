export interface ProfileRecordFormModel {
  id?: string;
  version?: number;
  ownerType: "Author" | "Student";
  ownerId: string;
  typeId: string;
  startDate?: string;
  endDate?: string;
  title?: string;
  titleGeo?: string;
  about?: string;
  aboutGeo?: string;
  certified?: boolean;
  certificationDate?: string;
  workDescription?: string;
  sortOrder?: number | "";
}
