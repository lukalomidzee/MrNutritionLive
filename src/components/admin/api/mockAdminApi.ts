import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { mockAuthors, mockCourseList, mockSiteDetails, mockStudents } from "@/components/backend/mockData";

const dictionaries = [
    { id: "dict-paid", kind: 1, name: "Paid", nameGeo: "ფასიანი", version: 1 },
    { id: "dict-mini", kind: 1, name: "Mini", nameGeo: "მინი", version: 1 },
    { id: "dict-active", kind: 2, name: "Active", nameGeo: "აქტიური", version: 1 },
    { id: "dict-instagram", kind: 6, name: "Instagram", nameGeo: "Instagram", version: 1 },
];

const issuers = [
    {
        id: "issuer-academy",
        issuerName: "Mr. Nutrition Academy",
        issuerNameGeo: "Mr. Nutrition Academy",
        issuerDescription: "Demo certificate issuer",
        issuerDescriptionGeo: "დემო სერტიფიკატის გამცემი",
        establishedDate: "2024-01-01",
        version: 1,
    },
];

const enrollments = [
    {
        id: "enrollment-mariam",
        courseName: "Nutrition Coach Certification",
        studentFirstName: "Mariam",
        studentLastName: "Gelashvili",
        issuerName: "Mr. Nutrition Academy",
        certificationDate: "2026-02-20",
        validityPeriodInDays: 720,
        certificateUniqueKey: "DEMO-2026-001",
        version: 1,
    },
];

const socialLinks = [
    {
        id: "social-mariam",
        ownerType: "Student",
        ownerId: "mariam-gelashvili",
        linkTypeId: "instagram",
        linkTypeName: "Instagram",
        linkUrl: "https://instagram.com/m.rnutrition",
        title: "Instagram",
        titleGeo: "Instagram",
        sortOrder: 1,
        version: 1,
    },
];

const profileRecords = [
    {
        id: "record-mariam-education",
        ownerType: "Student",
        ownerId: "mariam-gelashvili",
        title: "Nutrition Academy graduate",
        titleGeo: "Nutrition Academy-ის კურსდამთავრებული",
        sortOrder: 1,
        version: 1,
    },
];

function listForUrl(url: string): any[] {
    const normalized = url.toLowerCase();

    if (normalized.includes("/api/courses")) return mockCourseList;
    if (normalized.includes("/api/students")) return mockStudents;
    if (normalized.includes("/api/authors")) return mockAuthors;
    if (normalized.includes("/api/issuers")) return issuers;
    if (normalized.includes("/api/sitedetails")) return mockSiteDetails;
    if (normalized.includes("/api/enrollments")) return enrollments;
    if (normalized.includes("/api/social-links")) return socialLinks;
    if (normalized.includes("/api/profile-records")) return profileRecords;
    if (normalized.includes("/api/dictionaries")) return dictionaries;
    if (normalized.includes("/api/media")) return [];
    return [];
}

function detailForUrl(url: string): any {
    const parts = url.split("/").filter(Boolean);
    const id = parts[parts.length - 1];
    const list = listForUrl(url);
    return list.find((item) => item.id === id) ?? list[0] ?? { id, version: 1 };
}

export const mockAdminAdapter: AxiosAdapter = async (
    config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> => {
    const method = (config.method ?? "get").toLowerCase();
    const url = config.url ?? "";
    const isDetailGet = method === "get" && /\/[^/?]+$/.test(url) && !url.endsWith("/paged");
    const payload =
        method === "get"
            ? isDetailGet
                ? detailForUrl(url)
                : listForUrl(url)
            : { success: true, data: config.data ?? null };

    return {
        data: { data: payload, success: true, message: "Static demo data" },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
    };
};
