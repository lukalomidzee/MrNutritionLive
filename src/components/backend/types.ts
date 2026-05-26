export type CourseMediaDTO = {
    mediaAssetId: string;
    storageKey: string;
    storageProvider: string;
    publicUrl: string;
    mimeType: string;
    mediaKind: string;
    sizeBites: number;
    createdAt: string;
    mediaRoleTypeId: string | null;
    mediaRoleTypeName: string | null;
    mediaRoleTypeNameGeo: string | null;
    sortOrder: number | null;
};

export type RawCourseListDTO = {
    id: string;
    createdAt: string;
    courseTypeId: string;
    courseTypeName: string;
    courseTypeNameGeo: string;
    courseName: string;
    courseNameGeo: string;
    shortDescription: string;
    shortDescriptionGeo: string;
    priceGEL: number;
    priceUSD: number;
    courseStatusTypeId: string;
    courseStatusName: string;
    courseStatusNameGeo: string;
    certificationTypeId: string;
    certificationTypeName: string;
    certificationTypeNameGeo: string;
    version: number;
};

export type RawAuthorDTO = {
    id: string;
    createdAt: string;
    firstName: string;
    firstNameGeo: string;
    lastName: string;
    lastNameGeo: string;
    title: string;
    titleGeo: string;
    description: string;
    descriptionGeo: string;
    shortDescription: string;
    shortDescriptionGeo: string;
    version: number;
    socialLinks?: RawAuthorSocialLinkDTO[];
    educationRecords?: unknown[];
    languageRecords?: unknown[];
    professionRecords?: unknown[];
    workExperienceRecords?: unknown[];
    districtRecords?: unknown[];
    media?: CourseMediaDTO[];
};

export type RawAuthorSocialLinkDTO = {
    id: string;
    ownerType: string;
    ownerId: string;
    linkTypeId: string;
    linkTypeName: string;
    linkUrl: string;
    title: string | null;
    titleGeo: string | null;
    sortOrder: number | null;
    version: number;
};

export type RawCourseSectionDTO = {
    id: string;
    order: number;
    heading: string;
    headingGeo: string;
    paragraph: string;
    paragraphGeo: string;
    mediaAssetId: string | null;
    media?: CourseMediaDTO | null;
    version: number;
};

export type RawCourseMaterialsDTO = {
    id: string;
    sections: RawCourseSectionDTO[];
    media: CourseMediaDTO[];
};

export type RawCourseDetailDTO = RawCourseListDTO & {
    description: string;
    descriptionGeo: string;
    authors: RawAuthorDTO[];
    issuers: unknown[];
    prerequisites: unknown[];
    courseMaterials: RawCourseMaterialsDTO | null;
};

export type CourseListDTO = {
    id: string;
    createdAt: string;
    courseTypeId: string;
    courseType: string;
    courseTypeGeo: string;
    courseName: string;
    courseNameGeo: string;
    shortDescription: string;
    shortDescriptionGeo: string;
    price: number;
    priceCurrency: string;
    priceGEL: number;
    priceUSD: number;
    status: "Active" | "Draft" | "Archived" | string;
    statusGeo: string;
    certificationTypeId: string;
    certificationTypeName: string;
    certificationTypeNameGeo: string;
    coverUrl: string | null;
    version: number;
};

export type CoursesResponse = {
    data: RawCourseListDTO[];
    message: string;
    success: boolean;
};

export type AuthorDTO = {
    id: string;
    createdAt: string;
    firstName: string;
    firstNameGeo: string;
    lastName: string;
    lastNameGeo: string;
    title: string;
    titleGeo: string;
    description: string;
    descriptionGeo: string;
    shortDescription: string;
    shortDescriptionGeo: string;
    coverUrl: string | null;
    backgroundUrl: string | null;
    videoUrl: string | null;
    playlistUrl: string | null;
    version: number;
    socialLinks: AuthorSocialLinkDTO[];
    educationRecords: unknown[];
    languageRecords: unknown[];
    professionRecords: unknown[];
    workExperienceRecords: unknown[];
    districtRecords: unknown[];
    media: CourseMediaDTO[];
};

export type AuthorSocialLinkDTO = {
    id: string;
    linkTypeId: string;
    linkTypeName: string;
    linkUrl: string;
    title: string | null;
    titleGeo: string | null;
    sortOrder: number | null;
    version: number;
};

export type CourseSectionDTO = {
    id: string;
    order: number;
    heading: string;
    headingGeo: string;
    paragraph: string;
    paragraphGeo: string;
    coverUrl: string | null;
    version: number;
};

export type CourseDetailDTO = {
    id: string;
    createdAt: string;
    courseTypeId: string;
    courseType: string;
    courseTypeGeo: string;
    courseName: string;
    courseNameGeo: string;
    description: string;
    descriptionGeo: string;
    shortDescription: string;
    shortDescriptionGeo: string;
    price: number;
    priceCurrency: string;
    priceGEL: number;
    priceUSD: number;
    status: "Active" | "Draft" | "Archived" | string;
    statusGeo: string;
    certificationTypeId: string;
    certificationTypeName: string;
    certificationTypeNameGeo: string;
    version: number;
    authors: AuthorDTO[];
    author: AuthorDTO | null;
    courseMaterials: {
        id: string;
        coverUrl: string | null;
        backgroundUrl: string | null;
        videoUrl: string | null;
        syllabusUrl: string | null;
        sections: CourseSectionDTO[];
        media: CourseMediaDTO[];
    } | null;
};

export type CourseDetailResponse = {
    data: RawCourseDetailDTO;
    message: string;
    success: boolean;
};

export type AuthorDetailResponse = {
    data: RawAuthorDTO;
    message: string;
    success: boolean;
};

export type RawStudentRecordDTO = {
    id: string;
    ownerType: string;
    ownerId: string;
    sortOrder: number | null;
    version: number;
} & Record<string, unknown>;

export type RawStudentDTO = {
    id: string;
    createdAt: string;
    userId: string | null;
    firstName: string;
    firstNameGeo: string;
    lastName: string;
    lastNameGeo: string;
    title: string;
    titleGeo: string;
    sexTypeId: string;
    sexTypeName: string;
    sexTypeNameGeo: string;
    birthDate: string;
    email: string;
    phoneNumber: string;
    about: string;
    aboutGeo: string;
    emailVisible: boolean;
    phoneVisible: boolean;
    academyFavourite: boolean;
    featured: boolean;
    version: number;
    socialLinks: RawAuthorSocialLinkDTO[];
    educationRecords: RawStudentRecordDTO[];
    languageRecords: RawStudentRecordDTO[];
    professionRecords: RawStudentRecordDTO[];
    workExperienceRecords: RawStudentRecordDTO[];
    districtRecords: RawStudentRecordDTO[];
    enrollments: unknown[];
    media: CourseMediaDTO[];
};

export type StudentDTO = {
    id: string;
    createdAt: string;
    userId: string | null;
    firstName: string;
    firstNameGeo: string;
    lastName: string;
    lastNameGeo: string;
    title: string;
    titleGeo: string;
    sex: "male" | "female" | string;
    sexTypeId: string;
    sexTypeName: string;
    sexTypeNameGeo: string;
    gender: string;
    genderGeo: string;
    birthDate: string;
    age: number;
    email: string;
    phoneNumber: string;
    about: string;
    aboutGeo: string;
    description: string;
    descriptionGeo: string;
    emailVisible: boolean;
    phoneVisible: boolean;
    academyFavourite: boolean;
    featured: boolean;
    certificationType: string;
    certificationTypeGeo: string;
    socialLinks: AuthorSocialLinkDTO[];
    educationRecords: RawStudentRecordDTO[];
    languageRecords: RawStudentRecordDTO[];
    professionRecords: RawStudentRecordDTO[];
    workExperienceRecords: RawStudentRecordDTO[];
    districtRecords: RawStudentRecordDTO[];
    enrollments: unknown[];
    media: CourseMediaDTO[];
    coverUrl: string | null;
    version: number;
};

export type StudentsResponse = {
    data: RawStudentDTO[];
    message: string;
    success: boolean;
};

export type RawSiteDetailDTO = {
    id: string;
    pageTypeId: string;
    pageTypeName: string;
    pageTypeNameGeo: string;
    createdAt: string;
    title: string;
    titleGeo: string;
    titleColor: string | null;
    subtitle: string;
    subtitleColor: string | null;
    subtitleGeo: string;
    version: number;
    media: CourseMediaDTO[];
};

export type SiteDetailDTO = {
    id: string;
    pageTypeId: string;
    pageTypeName: string;
    pageTypeNameGeo: string;
    createdAt: string;
    title: string;
    titleGeo: string;
    titleColor: string | null;
    subtitle: string;
    subtitleColor: string | null;
    subtitleGeo: string;
    version: number;
    backgroundUrl: string | null;
    videoUrl: string | null;
    media: CourseMediaDTO[];
};

export type SiteDetailsResponse = {
    data: RawSiteDetailDTO[];
    message: string;
    success: boolean;
};
