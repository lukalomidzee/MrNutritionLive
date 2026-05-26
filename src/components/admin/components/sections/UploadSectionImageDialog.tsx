import {useRef, useState} from "react";
import {LinearProgress, Stack} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {ErrorText} from "../common/ErrorText";
import {api} from "../../api/adminApi";

export default function UploadSectionImageDialog({
                                                     open,
                                                     courseId,
                                                     sectionId,
                                                     onClose,
                                                     onSaved,
                                                 }: Readonly<{
    open: boolean;
    courseId: string | null;
    sectionId: string | null;
    onClose: () => void;
    onSaved: () => void;
}>) {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [err, setErr] = useState<string>();
    const [saving, setSaving] = useState(false);
    const [progress, setProgress] = useState<number>(0);

    const submit = async () => {
        if (!courseId || !sectionId) return;
        const file = fileRef.current?.files?.[0];
        if (!file) return;

        setSaving(true);
        setErr(undefined);
        setProgress(0);

        try {
            const fd = new FormData();
            fd.append("file", file);

            await api.post(
                `/api/Sections/Course/${courseId}/Section/${sectionId}`,
                fd,
                {
                    onUploadProgress: (e) => {
                        if (!e.total) return;
                        setProgress(Math.round((e.loaded * 100) / e.total));
                    },
                }
            );

            onClose();
            onSaved();
        } catch (e: any) {
            setErr(e?.response?.data?.message ?? e?.message ?? "Upload failed.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <FormDialog
            open={open}
            title="Upload section cover"
            onClose={onClose}
            onSubmit={submit}
            disabled={saving || !courseId || !sectionId}
        >
            <Stack spacing={2}>
                <input type="file" accept="image/*" ref={fileRef}/>
                {saving && <LinearProgress variant="determinate" value={progress}/>}
                <ErrorText text={err}/>
            </Stack>
        </FormDialog>
    );
}
