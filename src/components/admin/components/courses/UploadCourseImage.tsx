import {useState} from "react";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {api} from "../../api/adminApi";
import {ErrorText} from "../common/ErrorText";

export default function UploadCourseImageDialog(props: Readonly<{
    open: boolean;
    courseId: string | null;
    onClose: () => void;
    onSaved: () => void;
}>) {
    const {open, courseId, onClose, onSaved} = props;
    const [type, setType] = useState<"cover" | "background">("cover");
    const [file, setFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string>();

    const submit = async () => {
        if (!courseId || !file) {
            setErr("Select a file.");
            return;
        }
        setSaving(true);
        setErr(undefined);
        try {
            const fd = new FormData();
            fd.append("file", file);
            await api.post(`/api/Courses/${courseId}/${type}`, fd, {
                headers: {"Content-Type": "multipart/form-data"},
            });
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
            title="Upload course image"
            onClose={onClose}
            onSubmit={submit}
            submitLabel="Upload"
            disabled={saving}
        >
            <Box display="flex" gap={2} alignItems="center">
                <FormControl sx={{minWidth: 180}}>
                    <InputLabel id="img-type">Type</InputLabel>
                    <Select
                        labelId="img-type"
                        label="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                    >
                        <MenuItem value="cover">Cover</MenuItem>
                        <MenuItem value="background">Background</MenuItem>
                    </Select>
                </FormControl>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
            </Box>
            <ErrorText text={err}/>
        </FormDialog>
    );
}
