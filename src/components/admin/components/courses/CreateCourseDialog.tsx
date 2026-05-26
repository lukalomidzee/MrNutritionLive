import {useEffect, useState} from "react";
import {MenuItem, Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {api} from "../../api/adminApi";
import {ErrorText} from "../common/ErrorText";

interface DictionaryOption {
    id: string;
    name: string;
}

interface AuthorOption {
    id: string;
    firstName: string;
    lastName: string;
}

interface IssuerOption {
    id: string;
    name: string;
}

interface CourseOption {
    id: string;
    name: string;
}

export interface CreateCourseDTO {
    courseTypeId: string;
    courseStatusTypeId: string;
    certificationTypeId: string;
    courseName: string;
    courseNameGeo: string;
    description: string;
    descriptionGeo: string;
    shortDescription: string;
    shortDescriptionGeo: string;
    priceGEL: number | "";
    priceUSD: number | "";
    authorIds: string[];
    issuerIds: string[];
    prerequisiteCourseIds: string[];
}

export default function CreateCourseDialog({
                                               open,
                                               onClose,
                                               onSaved,
                                           }: Readonly<{
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}>) {
    const [m, setM] = useState<CreateCourseDTO>({
        courseTypeId: "",
        courseStatusTypeId: "",
        certificationTypeId: "",
        courseName: "",
        courseNameGeo: "",
        description: "",
        descriptionGeo: "",
        shortDescription: "",
        shortDescriptionGeo: "",
        priceGEL: "",
        priceUSD: "",
        authorIds: [],
        issuerIds: [],
        prerequisiteCourseIds: [],
    });
    const [authors, setAuthors] = useState<AuthorOption[]>([]);
    const [issuers, setIssuers] = useState<IssuerOption[]>([]);
    const [courses, setCourses] = useState<CourseOption[]>([]);
    const [courseTypes, setCourseTypes] = useState<DictionaryOption[]>([]);
    const [courseStatusTypes, setCourseStatusTypes] = useState<DictionaryOption[]>(
        []
    );
    const [certificationTypes, setCertificationTypes] = useState<
        DictionaryOption[]
    >([]);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string>();

    const set = (k: keyof CreateCourseDTO, v: any) =>
        setM((s) => ({...s, [k]: v}));

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const [
                    authorsRes,
                    issuersRes,
                    coursesRes,
                    courseTypeRes,
                    courseStatusRes,
                    certRes,
                ] = await Promise.all([
                    api.get("/api/authors"),
                    api.get("/api/issuers"),
                    api.get("/api/courses"),
                    api.get("/api/dictionaries", {params: {kind: "CourseType"}}),
                    api.get("/api/dictionaries", {params: {kind: "CourseStatusType"}}),
                    api.get("/api/dictionaries", {
                        params: {kind: "CertificationType"},
                    }),
                ]);

                const mapList = (r: any) => r?.data?.data ?? r?.data ?? [];
                const aList = mapList(authorsRes);
                const iList = mapList(issuersRes);
                const cList = mapList(coursesRes);
                const ctList = mapList(courseTypeRes);
                const csList = mapList(courseStatusRes);
                const certList = mapList(certRes);

                setAuthors(
                    (Array.isArray(aList) ? aList : aList.items ?? []).map((a: any) => ({
                        id: a.id ?? a.Id,
                        firstName: a.firstName ?? a.FirstName ?? "",
                        lastName: a.lastName ?? a.LastName ?? "",
                    }))
                );
                setIssuers(
                    (Array.isArray(iList) ? iList : iList.items ?? []).map((i: any) => ({
                        id: i.id ?? i.Id,
                        name: i.issuerName ?? i.IssuerName ?? "",
                    }))
                );
                setCourses(
                    (Array.isArray(cList) ? cList : cList.items ?? []).map((c: any) => ({
                        id: c.id ?? c.Id,
                        name: c.courseName ?? c.CourseName ?? "",
                    }))
                );
                setCourseTypes(
                    (Array.isArray(ctList) ? ctList : ctList.items ?? []).map(
                        (d: any) => ({
                            id: d.id ?? d.Id,
                            name: d.name ?? d.Name ?? "",
                        })
                    )
                );
                setCourseStatusTypes(
                    (Array.isArray(csList) ? csList : csList.items ?? []).map(
                        (d: any) => ({
                            id: d.id ?? d.Id,
                            name: d.name ?? d.Name ?? "",
                        })
                    )
                );
                setCertificationTypes(
                    (Array.isArray(certList) ? certList : certList.items ?? []).map(
                        (d: any) => ({
                            id: d.id ?? d.Id,
                            name: d.name ?? d.Name ?? "",
                        })
                    )
                );
            } catch {
                setAuthors([]);
                setIssuers([]);
                setCourses([]);
                setCourseTypes([]);
                setCourseStatusTypes([]);
                setCertificationTypes([]);
            }
        })();
    }, [open]);

    const submit = async () => {
        setErr(undefined);
        if (
            !m.courseTypeId ||
            !m.courseStatusTypeId ||
            !m.certificationTypeId ||
            !m.courseName
        ) {
            setErr("Please fill required fields.");
            return;
        }
        const priceGelNum = m.priceGEL === "" ? 0 : Number(m.priceGEL);
        const priceUsdNum = m.priceUSD === "" ? 0 : Number(m.priceUSD);
        if (Number.isNaN(priceGelNum) || Number.isNaN(priceUsdNum)) {
            setErr("Prices must be numbers.");
            return;
        }

        setSaving(true);
        try {
            await api.post("/api/courses", {
                ...m,
                priceGEL: priceGelNum,
                priceUSD: priceUsdNum,
            });
            onClose();
            onSaved();
        } catch (e: any) {
            setErr(e?.response?.data?.message ?? e?.message ?? "Failed to create.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <FormDialog
            open={open}
            title="Add course"
            onClose={onClose}
            onSubmit={submit}
            disabled={saving}
        >
            <Stack spacing={2}>
                <TextField
                    select
                    label="Course Type"
                    value={m.courseTypeId}
                    onChange={(e) => set("courseTypeId", e.target.value)}
                    required
                    fullWidth
                >
                    <MenuItem value="">— Select —</MenuItem>
                    {courseTypes.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                            {t.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Course Status"
                    value={m.courseStatusTypeId}
                    onChange={(e) => set("courseStatusTypeId", e.target.value)}
                    required
                    fullWidth
                >
                    <MenuItem value="">— Select —</MenuItem>
                    {courseStatusTypes.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                            {t.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Certification Type"
                    value={m.certificationTypeId}
                    onChange={(e) => set("certificationTypeId", e.target.value)}
                    required
                    fullWidth
                >
                    <MenuItem value="">— Select —</MenuItem>
                    {certificationTypes.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                            {t.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Course Name"
                    value={m.courseName}
                    onChange={(e) => set("courseName", e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Course Name (Geo)"
                    value={m.courseNameGeo}
                    onChange={(e) => set("courseNameGeo", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Description"
                    value={m.description}
                    onChange={(e) => set("description", e.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                />
                <TextField
                    label="Description (Geo)"
                    value={m.descriptionGeo}
                    onChange={(e) => set("descriptionGeo", e.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                />
                <TextField
                    label="Short Description"
                    value={m.shortDescription}
                    onChange={(e) => set("shortDescription", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Short Description (Geo)"
                    value={m.shortDescriptionGeo}
                    onChange={(e) => set("shortDescriptionGeo", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Price (GEL)"
                    value={m.priceGEL}
                    onChange={(e) => set("priceGEL", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Price (USD)"
                    value={m.priceUSD}
                    onChange={(e) => set("priceUSD", e.target.value)}
                    fullWidth
                />

                <TextField
                    select
                    label="Authors"
                    value={m.authorIds}
                    onChange={(e) => set("authorIds", e.target.value as string[])}
                    SelectProps={{multiple: true}}
                    fullWidth
                >
                    {authors.map((a) => (
                        <MenuItem key={a.id} value={a.id}>
                            {a.firstName} {a.lastName}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Issuers"
                    value={m.issuerIds}
                    onChange={(e) => set("issuerIds", e.target.value as string[])}
                    SelectProps={{multiple: true}}
                    fullWidth
                >
                    {issuers.map((i) => (
                        <MenuItem key={i.id} value={i.id}>
                            {i.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Prerequisites"
                    value={m.prerequisiteCourseIds}
                    onChange={(e) =>
                        set("prerequisiteCourseIds", e.target.value as string[])
                    }
                    SelectProps={{multiple: true}}
                    fullWidth
                >
                    {courses.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                            {c.name}
                        </MenuItem>
                    ))}
                </TextField>

                <ErrorText text={err}/>
            </Stack>
        </FormDialog>
    );
}
