import { http } from "@/lib/http";
import {
    mockAuthors,
    mockCourseList,
    mockCourses,
    mockSiteDetails,
    mockStudents,
} from "./mockData";
import { sitePath } from "@/lib/sitePath";
import { STATIC_DEMO_ENABLED } from "@/lib/staticDemo";
import type {
    AuthorDetailResponse,
    AuthorDTO,
    AuthorSocialLinkDTO,
    CourseDetailDTO,
    CourseDetailResponse,
    CourseListDTO,
    CourseMediaDTO,
    CoursesResponse,
    RawAuthorDTO,
    RawCourseDetailDTO,
    RawCourseListDTO,
    RawSiteDetailDTO,
    RawStudentDTO,
    SiteDetailDTO,
    SiteDetailsResponse,
    StudentDTO,
    StudentsResponse,
} from "./types.ts";

const DEFAULT_COURSE_IMAGE = sitePath("/images/courses/course1.jpg");

function pickCoursePrice(course: RawCourseListDTO | RawCourseDetailDTO): Pick<CourseListDTO, "price" | "priceCurrency"> {
    if ((course.priceGEL ?? 0) > 0) {
        return { price: course.priceGEL, priceCurrency: "GEL" };
    }

    if ((course.priceUSD ?? 0) > 0) {
        return { price: course.priceUSD, priceCurrency: "USD" };
    }

    return { price: 0, priceCurrency: "GEL" };
}

function findMediaByRole(media: CourseMediaDTO[] | undefined, roleName: string): string | null {
    const match = (media ?? []).find(
        (item) => item.mediaRoleTypeName?.toLowerCase() === roleName.toLowerCase()
    );

    return match?.publicUrl ?? null;
}

function normalizeAuthorSocialLinks(socialLinks: RawAuthorDTO["socialLinks"]): AuthorSocialLinkDTO[] {
    return (socialLinks ?? []).map((link) => ({
        id: link.id,
        linkTypeId: link.linkTypeId,
        linkTypeName: link.linkTypeName,
        linkUrl: link.linkUrl,
        title: link.title,
        titleGeo: link.titleGeo,
        sortOrder: link.sortOrder,
        version: link.version,
    }));
}

function normalizeAuthor(author: RawAuthorDTO): AuthorDTO {
    const media = author.media ?? [];

    return {
        id: author.id,
        createdAt: author.createdAt,
        firstName: author.firstName,
        firstNameGeo: author.firstNameGeo,
        lastName: author.lastName,
        lastNameGeo: author.lastNameGeo,
        title: author.title,
        titleGeo: author.titleGeo,
        description: author.description,
        descriptionGeo: author.descriptionGeo,
        shortDescription: author.shortDescription,
        shortDescriptionGeo: author.shortDescriptionGeo,
        coverUrl:
            findMediaByRole(media, "AuthorThumbnail") ??
            media.find((item) => item.mediaKind?.toLowerCase() === "image")?.publicUrl ??
            null,
        backgroundUrl: findMediaByRole(media, "AuthorBackground"),
        videoUrl: findMediaByRole(media, "AuthorVideo"),
        playlistUrl: findMediaByRole(media, "AuthorPlaylist"),
        version: author.version,
        socialLinks: normalizeAuthorSocialLinks(author.socialLinks ?? []),
        educationRecords: author.educationRecords ?? [],
        languageRecords: author.languageRecords ?? [],
        professionRecords: author.professionRecords ?? [],
        workExperienceRecords: author.workExperienceRecords ?? [],
        districtRecords: author.districtRecords ?? [],
        media,
    };
}

function calculateAgeFromBirthDate(birthDate: string | null | undefined): number {
    if (!birthDate) return 0;

    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return 0;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age -= 1;
    }

    return Math.max(age, 0);
}

function normalizeStudent(student: RawStudentDTO): StudentDTO {
    const media = student.media ?? [];
    const sex = (student.sexTypeName ?? "").toLowerCase();

    return {
        id: student.id,
        createdAt: student.createdAt,
        userId: student.userId,
        firstName: student.firstName,
        firstNameGeo: student.firstNameGeo,
        lastName: student.lastName,
        lastNameGeo: student.lastNameGeo,
        title: student.title,
        titleGeo: student.titleGeo,
        sex,
        sexTypeId: student.sexTypeId,
        sexTypeName: student.sexTypeName,
        sexTypeNameGeo: student.sexTypeNameGeo,
        gender: student.sexTypeName,
        genderGeo: student.sexTypeNameGeo,
        birthDate: student.birthDate,
        age: calculateAgeFromBirthDate(student.birthDate),
        email: student.email,
        phoneNumber: student.phoneNumber,
        about: student.about,
        aboutGeo: student.aboutGeo,
        description: student.about,
        descriptionGeo: student.aboutGeo,
        emailVisible: student.emailVisible,
        phoneVisible: student.phoneVisible,
        academyFavourite: student.academyFavourite,
        featured: student.featured,
        certificationType: student.title,
        certificationTypeGeo: student.titleGeo,
        socialLinks: normalizeAuthorSocialLinks(student.socialLinks ?? []),
        educationRecords: student.educationRecords ?? [],
        languageRecords: student.languageRecords ?? [],
        professionRecords: student.professionRecords ?? [],
        workExperienceRecords: student.workExperienceRecords ?? [],
        districtRecords: student.districtRecords ?? [],
        enrollments: student.enrollments ?? [],
        media,
        coverUrl:
            findMediaByRole(media, "StudentThumbnail") ??
            media.find((item) => item.mediaKind?.toLowerCase() === "image")?.publicUrl ??
            null,
        version: student.version,
    };
}

function normalizeCourseListItem(course: RawCourseListDTO): CourseListDTO {
    const { price, priceCurrency } = pickCoursePrice(course);

    return {
        id: course.id,
        createdAt: course.createdAt,
        courseTypeId: course.courseTypeId,
        courseType: course.courseTypeName,
        courseTypeGeo: course.courseTypeNameGeo,
        courseName: course.courseName,
        courseNameGeo: course.courseNameGeo,
        shortDescription: course.shortDescription,
        shortDescriptionGeo: course.shortDescriptionGeo,
        price,
        priceCurrency,
        priceGEL: course.priceGEL,
        priceUSD: course.priceUSD,
        status: course.courseStatusName,
        statusGeo: course.courseStatusNameGeo,
        certificationTypeId: course.certificationTypeId,
        certificationTypeName: course.certificationTypeName,
        certificationTypeNameGeo: course.certificationTypeNameGeo,
        coverUrl: DEFAULT_COURSE_IMAGE,
        version: course.version,
    };
}

function normalizeSiteDetail(siteDetail: RawSiteDetailDTO): SiteDetailDTO {
    const media = siteDetail.media ?? [];

    return {
        id: siteDetail.id,
        pageTypeId: siteDetail.pageTypeId,
        pageTypeName: siteDetail.pageTypeName,
        pageTypeNameGeo: siteDetail.pageTypeNameGeo,
        createdAt: siteDetail.createdAt,
        title: siteDetail.title,
        titleGeo: siteDetail.titleGeo,
        titleColor: siteDetail.titleColor,
        subtitle: siteDetail.subtitle,
        subtitleColor: siteDetail.subtitleColor,
        subtitleGeo: siteDetail.subtitleGeo,
        version: siteDetail.version,
        backgroundUrl:
            findMediaByRole(media, "SiteDetailBackground") ??
            media.find((item) => item.mediaKind?.toLowerCase() === "image")?.publicUrl ??
            null,
        videoUrl:
            findMediaByRole(media, "SiteDetailVideo") ??
            media.find((item) => item.mediaKind?.toLowerCase() === "video")?.publicUrl ??
            null,
        media,
    };
}

function normalizeCourseDetail(course: RawCourseDetailDTO): CourseDetailDTO {
    const { price, priceCurrency } = pickCoursePrice(course);
    const authors = (course.authors ?? []).map(normalizeAuthor);
    const materialsMedia = course.courseMaterials?.media ?? [];

    return {
        id: course.id,
        createdAt: course.createdAt,
        courseTypeId: course.courseTypeId,
        courseType: course.courseTypeName,
        courseTypeGeo: course.courseTypeNameGeo,
        courseName: course.courseName,
        courseNameGeo: course.courseNameGeo,
        description: course.description,
        descriptionGeo: course.descriptionGeo,
        shortDescription: course.shortDescription,
        shortDescriptionGeo: course.shortDescriptionGeo,
        price,
        priceCurrency,
        priceGEL: course.priceGEL,
        priceUSD: course.priceUSD,
        status: course.courseStatusName,
        statusGeo: course.courseStatusNameGeo,
        certificationTypeId: course.certificationTypeId,
        certificationTypeName: course.certificationTypeName,
        certificationTypeNameGeo: course.certificationTypeNameGeo,
        version: course.version,
        authors,
        author: authors[0] ?? null,
        courseMaterials: course.courseMaterials
            ? {
                id: course.courseMaterials.id,
                coverUrl: findMediaByRole(materialsMedia, "CourseCover") ?? DEFAULT_COURSE_IMAGE,
                backgroundUrl: findMediaByRole(materialsMedia, "CourseBackground"),
                videoUrl: findMediaByRole(materialsMedia, "CourseVideo"),
                syllabusUrl: findMediaByRole(materialsMedia, "CourseSyllabus"),
                sections: (course.courseMaterials.sections ?? [])
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((section) => ({
                        id: section.id,
                        order: section.order,
                        heading: section.heading,
                        headingGeo: section.headingGeo,
                        paragraph: section.paragraph,
                        paragraphGeo: section.paragraphGeo,
                        coverUrl: section.media?.publicUrl ?? null,
                        version: section.version,
                    })),
                media: materialsMedia,
            }
            : null,
    };
}

function sortCoursesByDateDesc(items: CourseListDTO[]): CourseListDTO[] {
    return items
        .slice()
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
}

export async function fetchCourses(): Promise<CourseListDTO[]> {
    if (STATIC_DEMO_ENABLED) {
        return sortCoursesByDateDesc(mockCourseList).filter((course) => course.status === "Active");
    }

    const { data } = await http.get<CoursesResponse>("/api/Courses");
    const normalized = (data.data ?? []).map(normalizeCourseListItem);

    return sortCoursesByDateDesc(normalized).filter((course) => course.status === "Active");
}

export async function fetchCoursesAdmin(): Promise<CourseListDTO[]> {
    if (STATIC_DEMO_ENABLED) {
        return sortCoursesByDateDesc(mockCourseList);
    }

    const { data } = await http.get<CoursesResponse>("/api/Courses");
    return sortCoursesByDateDesc((data.data ?? []).map(normalizeCourseListItem));
}

export async function fetchCourseById(id: string): Promise<CourseDetailDTO> {
    if (STATIC_DEMO_ENABLED) {
        const course = mockCourses.find((item) => item.id === id);
        if (!course) throw new Error("Course not found");
        return course;
    }

    const { data } = await http.get<CourseDetailResponse>(`/api/Courses/${id}`);
    return normalizeCourseDetail(data.data);
}

export async function fetchAuthorById(id: string): Promise<AuthorDTO> {
    if (STATIC_DEMO_ENABLED) {
        const author = mockAuthors.find((item) => item.id === id);
        if (!author) throw new Error("Author not found");
        return author;
    }

    const { data } = await http.get<AuthorDetailResponse>(`/api/Authors/${id}`, {
        params: { includeAllMedia: true },
    });
    return normalizeAuthor(data.data);
}

export async function fetchStudents(): Promise<StudentDTO[]> {
    if (STATIC_DEMO_ENABLED) {
        return mockStudents;
    }

    const { data } = await http.get<StudentsResponse>("/api/Students", {
        params: { includeAllMedia: true },
    });
    return (data.data ?? []).map(normalizeStudent);
}

export async function fetchStudentById(id: string): Promise<StudentDTO> {
    if (STATIC_DEMO_ENABLED) {
        const student = mockStudents.find((item) => item.id === id);
        if (!student) throw new Error("Student not found");
        return student;
    }

    const { data } = await http.get<{ data: RawStudentDTO; message: string; success: boolean }>(
        `/api/Students/${id}`,
        { params: { includeAllMedia: true } }
    );
    return normalizeStudent(data.data);
}

export async function fetchSiteDetails(): Promise<SiteDetailDTO[]> {
    if (STATIC_DEMO_ENABLED) {
        return mockSiteDetails;
    }

    const { data } = await http.get<SiteDetailsResponse>("/api/sitedetails", {
        params: { includeAllMedia: true },
    });
    return (data.data ?? []).map(normalizeSiteDetail);
}
