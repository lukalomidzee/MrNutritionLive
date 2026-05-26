import {useEffect, useState} from "react";
import {Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {ErrorText} from "../common/ErrorText";
import {api} from "../../api/adminApi";

interface CreateSectionDTO {
    courseId: string;
    order?: number;
    heading: string;
    headingGeo: string;
    paragraph: string;
    paragraphGeo: string;
}

export default function CreateSectionDialog({
                                                open,
                                                courseId,
                                                onClose,
                                                onSaved,
                                            }: Readonly<{
    open: boolean;
    courseId: string | null;
    onClose: () => void;
    onSaved: () => void;
}>) {
    const [m, setM] = useState<CreateSectionDTO>({
        courseId: "",
        order: undefined,
        heading: "",
        headingGeo: "",
        paragraph: "",
        paragraphGeo: "",
    });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string>();

    const set = <K extends keyof CreateSectionDTO>(
        k: K,
        v: CreateSectionDTO[K]
    ) => setM((s) => ({...s, [k]: v}));

    useEffect(() => {
        if (open && courseId) {
            setM((s) => ({...s, courseId}));
        }
        if (!open) {
            setM({
                courseId: courseId ?? "",
                order: undefined,
                heading: "",
                headingGeo: "",
                paragraph: "",
                paragraphGeo: "",
            });
            setErr(undefined);
        }
    }, [open, courseId]);

    const submit = async () => {
        if (!courseId) return;
        setSaving(true);
        setErr(undefined);
        try {
            await api.post(`/api/courses/${courseId}/sections`, {
                order: m.order,
                heading: m.heading,
                headingGeo: m.headingGeo,
                paragraph: m.paragraph,
                paragraphGeo: m.paragraphGeo,
            });
            onClose();
            onSaved();
        } catch (e: any) {
            setErr(
                e?.response?.data?.message ?? e?.message ?? "Failed to create section."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <FormDialog
            open={open}
            title="Add section"
            onClose={onClose}
            onSubmit={submit}
            disabled={saving || !courseId}
        >
            <Stack spacing={2}>
                <TextField
                    label="Order"
                    type="number"
                    value={m.order ?? ""}
                    onChange={(e) =>
                        set(
                            "order",
                            e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                        )
                    }
                    fullWidth
                />
                <TextField
                    label="Heading"
                    value={m.heading}
                    onChange={(e) => set("heading", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Heading (Geo)"
                    value={m.headingGeo}
                    onChange={(e) => set("headingGeo", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Paragraph"
                    value={m.paragraph}
                    onChange={(e) => set("paragraph", e.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                />
                <TextField
                    label="Paragraph (Geo)"
                    value={m.paragraphGeo}
                    onChange={(e) => set("paragraphGeo", e.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                />
                <ErrorText text={err}/>
            </Stack>
        </FormDialog>
    );
}
