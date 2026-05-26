import {useEffect, useState} from "react";
import {MenuItem, Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {api} from "../../api/adminApi";
import {ErrorText} from "../common/ErrorText";

interface CourseOption {
    id: string;
    name: string;
}

interface StudentOption {
    id: string;
    name: string;
}

interface IssuerOption {
    id: string;
    name: string;
}

export interface CreateEnrollmentDTO {
    courseId: string;
    studentId: string;
    issuerId?: string;
    certificationDate?: string;
    validityPeriodInDays: number;
    certificateUniqueKey?: string;
}

export default function CreateEnrollmentDialog({
                                                   open,
                                                   onClose,
                                                   onSaved,
                                               }: Readonly<{
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}>) {
    const [m, setM] = useState<CreateEnrollmentDTO>({
        courseId: "",
        studentId: "",
        issuerId: "",
        certificationDate: "",
        validityPeriodInDays: 720,
        certificateUniqueKey: "",
    });
    const [courses, setCourses] = useState<CourseOption[]>([]);
    const [students, setStudents] = useState<StudentOption[]>([]);
    const [issuers, setIssuers] = useState<IssuerOption[]>([]);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string>();
    const set = (k: keyof CreateEnrollmentDTO, v: any) =>
        setM((s) => ({...s, [k]: v}));

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const [coursesRes, studentsRes, issuersRes] = await Promise.all([
                    api.get("/api/courses"),
                    api.get("/api/students"),
                    api.get("/api/issuers"),
                ]);
                const mapList = (r: any) => r?.data?.data ?? r?.data ?? [];
                const cList = mapList(coursesRes);
                const sList = mapList(studentsRes);
                const iList = mapList(issuersRes);
                setCourses(
                    (Array.isArray(cList) ? cList : cList.items ?? []).map((c: any) => ({
                        id: c.id ?? c.Id,
                        name: c.courseName ?? c.CourseName ?? "",
                    }))
                );
                setStudents(
                    (Array.isArray(sList) ? sList : sList.items ?? []).map((s: any) => ({
                        id: s.id ?? s.Id,
                        name: `${s.firstName ?? s.FirstName ?? ""} ${
                            s.lastName ?? s.LastName ?? ""
                        }`.trim(),
                    }))
                );
                setIssuers(
                    (Array.isArray(iList) ? iList : iList.items ?? []).map((i: any) => ({
                        id: i.id ?? i.Id,
                        name: i.issuerName ?? i.IssuerName ?? "",
                    }))
                );
            } catch {
                setCourses([]);
                setStudents([]);
                setIssuers([]);
            }
        })();
    }, [open]);

    const submit = async () => {
        if (!m.courseId || !m.studentId) {
            setErr("Course and student are required.");
            return;
        }
        setSaving(true);
        try {
            await api.post("/api/enrollments", {
                ...m,
                issuerId: m.issuerId || undefined,
                certificationDate: m.certificationDate || undefined,
                certificateUniqueKey: m.certificateUniqueKey || undefined,
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
            title="Add enrollment"
            onClose={onClose}
            onSubmit={submit}
            disabled={saving}
        >
            <Stack spacing={2}>
                <TextField
                    select
                    label="Course"
                    value={m.courseId}
                    onChange={(e) => set("courseId", e.target.value)}
                    required
                    fullWidth
                >
                    <MenuItem value="">— Select —</MenuItem>
                    {courses.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                            {c.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Student"
                    value={m.studentId}
                    onChange={(e) => set("studentId", e.target.value)}
                    required
                    fullWidth
                >
                    <MenuItem value="">— Select —</MenuItem>
                    {students.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                            {s.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Issuer"
                    value={m.issuerId ?? ""}
                    onChange={(e) => set("issuerId", e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">— None —</MenuItem>
                    {issuers.map((i) => (
                        <MenuItem key={i.id} value={i.id}>
                            {i.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    type="date"
                    label="Certification Date"
                    value={m.certificationDate ?? ""}
                    onChange={(e) => set("certificationDate", e.target.value)}
                    InputLabelProps={{shrink: true}}
                    fullWidth
                />
                <TextField
                    type="number"
                    label="Validity (days)"
                    value={m.validityPeriodInDays}
                    onChange={(e) =>
                        set("validityPeriodInDays", Number(e.target.value))
                    }
                    fullWidth
                />
                <TextField
                    label="Certificate Unique Key"
                    value={m.certificateUniqueKey ?? ""}
                    onChange={(e) => set("certificateUniqueKey", e.target.value)}
                    fullWidth
                />
                <ErrorText text={err}/>
            </Stack>
        </FormDialog>
    );
}
