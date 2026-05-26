import {useState} from "react";
import {Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {api} from "../../api/adminApi";
import {ErrorText} from "../common/ErrorText";

export interface CreateIssuerDTO {
    issuerName: string;
    issuerNameGeo: string;
    issuerDescription: string;
    issuerDescriptionGeo: string;
    establishedDate?: string;
}

export default function CreateIssuerDialog({
                                               open,
                                               onClose,
                                               onSaved,
                                           }: Readonly<{
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}>) {
    const [m, setM] = useState<CreateIssuerDTO>({
        issuerName: "",
        issuerNameGeo: "",
        issuerDescription: "",
        issuerDescriptionGeo: "",
        establishedDate: "",
    });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string>();
    const set = (k: keyof CreateIssuerDTO, v: any) =>
        setM((s) => ({...s, [k]: v}));

    const submit = async () => {
        if (
            !m.issuerName ||
            !m.issuerNameGeo ||
            !m.issuerDescription ||
            !m.issuerDescriptionGeo
        ) {
            setErr("Please fill required fields.");
            return;
        }
        setSaving(true);
        try {
            await api.post("/api/issuers", {
                ...m,
                establishedDate: m.establishedDate || undefined,
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
            title="Add issuer"
            onClose={onClose}
            onSubmit={submit}
            disabled={saving}
        >
            <Stack spacing={2}>
                <TextField
                    label="Name"
                    value={m.issuerName}
                    onChange={(e) => set("issuerName", e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Name (Geo)"
                    value={m.issuerNameGeo}
                    onChange={(e) => set("issuerNameGeo", e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Description"
                    value={m.issuerDescription}
                    onChange={(e) => set("issuerDescription", e.target.value)}
                    required
                    multiline
                    minRows={3}
                    fullWidth
                />
                <TextField
                    label="Description (Geo)"
                    value={m.issuerDescriptionGeo}
                    onChange={(e) => set("issuerDescriptionGeo", e.target.value)}
                    required
                    multiline
                    minRows={3}
                    fullWidth
                />
                <TextField
                    type="date"
                    label="Established date"
                    value={m.establishedDate ?? ""}
                    onChange={(e) => set("establishedDate", e.target.value)}
                    InputLabelProps={{shrink: true}}
                    fullWidth
                />
                <ErrorText text={err}/>
            </Stack>
        </FormDialog>
    );
}
