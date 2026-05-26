import {useEffect, useState} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {api} from "../../api/adminApi";
import {ErrorText} from "../common/ErrorText";

export default function ChangeCourseStatusDialog(props: Readonly<{
    open: boolean;
    courseId: string | null;
    onClose: () => void;
    onSaved: () => void;
}>) {
    const {open, courseId, onClose, onSaved} = props;

    const [status, setStatus] = useState<"Active" | "Inactive">("Active");
    const [version, setVersion] = useState<number>(0);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string>();

    useEffect(() => {
        if (!open || !courseId) return;
        (async () => {
            setErr(undefined);
            try {
                const r = await api.get(`/api/Courses/${courseId}`);
                setStatus(
                    (r.data.data.status ?? r.data.data.Status) === "Inactive"
                        ? "Inactive"
                        : "Active"
                );
                setVersion(r.data.data.version ?? r.data.data.Version ?? 0);
            } catch (e: any) {
                setErr(
                    e?.response?.data?.message ??
                    e?.message ??
                    "Failed to load current status."
                );
            }
        })();
    }, [open, courseId]);

    const submit = async () => {
        if (!courseId) return;
        setSaving(true);
        setErr(undefined);
        try {
            await api.patch(`/api/Courses/${courseId}`, {
                newStatus: status,
                version,
            });
            onClose();
            onSaved();
        } catch (e: any) {
            setErr(
                e?.response?.data?.message ?? e?.message ?? "Failed to change status."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <FormDialog
            open={open}
            title="Change course status"
            onClose={onClose}
            onSubmit={submit}
            disabled={saving}
        >
            <FormControl fullWidth>
                <InputLabel id="status">Status</InputLabel>
                <Select
                    labelId="status"
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
            </FormControl>
            <ErrorText text={err}/>
        </FormDialog>
    );
}
