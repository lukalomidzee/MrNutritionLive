import {useState} from "react";
import FormDialog from "../common/FormDialog";
import {api} from "../../api/adminApi";
import {ErrorText} from "../common/ErrorText";

export default function UploadAuthorPhotoDialog({
                                                    open,
                                                    authorId,
                                                    onClose,
                                                    onSaved,
                                                }: Readonly<{
    open: boolean;
    authorId: string | null;
    onClose: () => void;
    onSaved: () => void;
}>) {
    const [file, setFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string>();

    const submit = async () => {
        if (!authorId || !file) {
            setErr("Pick a file.");
            return;
        }
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            await api.post(`/api/Authors/image/${authorId}`, fd, {
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
            title="Upload author photo"
            onClose={onClose}
            onSubmit={submit}
            submitLabel="Upload"
            disabled={saving}
        >
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <ErrorText text={err}/>
        </FormDialog>
    );
}
