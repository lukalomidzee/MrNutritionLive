import {useState} from "react";
import {Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {ErrorText} from "../common/ErrorText";
import {useDetailsOnOpen} from "../../hooks/useDetailsOnOpen";
import {api} from "../../api/adminApi";

export interface UpdateIssuerDTO {
    id: string;
    version: number;
    issuerName: string;
    issuerNameGeo: string;
    issuerDescription: string;
    issuerDescriptionGeo: string;
    establishedDate?: string;
}

export default function UpdateIssuerDialog({
                                               open,
                                               issuerId,
                                               onClose,
                                               onSaved,
                                               initial,
                                           }: Readonly<{
    open: boolean;
    issuerId: string | null;
    onClose: () => void;
    onSaved: () => void;
    initial?: Partial<UpdateIssuerDTO>;
}>) {
    const map = (d: any): UpdateIssuerDTO => ({
        id: d.id ?? d.Id,
        version: d.version ?? d.Version ?? 0,
        issuerName: d.issuerName ?? d.IssuerName ?? "",
        issuerNameGeo: d.issuerNameGeo ?? d.IssuerNameGeo ?? "",
        issuerDescription: d.issuerDescription ?? d.IssuerDescription ?? "",
        issuerDescriptionGeo:
            d.issuerDescriptionGeo ?? d.IssuerDescriptionGeo ?? "",
        establishedDate: d.establishedDate ?? d.EstablishedDate ?? "",
    });

    const {
        model: m,
        setModel: setM,
        error,
    } = useDetailsOnOpen<UpdateIssuerDTO>({
        open,
        id: issuerId,
        url: (id) => `/api/issuers/${id}`,
        map,
        initial,
    });

    const [submitErr, setSubmitErr] = useState<string>();
    const [saving, setSaving] = useState(false);

    const set = <K extends keyof UpdateIssuerDTO>(k: K, v: UpdateIssuerDTO[K]) =>
        setM((s) => (s ? {...s, [k]: v} : s));

    const submit = async () => {
        if (!m) return;
        setSaving(true);
        setSubmitErr(undefined);
        try {
            await api.put(`/api/issuers`, {
                ...m,
                establishedDate: m.establishedDate || undefined,
            });
            onClose();
            onSaved();
        } catch (e: any) {
            setSubmitErr(
                e?.response?.data?.message ?? e?.message ?? "Failed to update."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <FormDialog
            open={open}
            title="Update issuer"
            onClose={onClose}
            onSubmit={submit}
            disabled={!m || saving}
        >
            {!m ? (
                "Loading…"
            ) : (
                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        value={m.issuerName ?? ""}
                        onChange={(e) => set("issuerName", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Name (Geo)"
                        value={m.issuerNameGeo ?? ""}
                        onChange={(e) => set("issuerNameGeo", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        value={m.issuerDescription ?? ""}
                        onChange={(e) => set("issuerDescription", e.target.value)}
                        multiline
                        minRows={3}
                        fullWidth
                    />
                    <TextField
                        label="Description (Geo)"
                        value={m.issuerDescriptionGeo ?? ""}
                        onChange={(e) => set("issuerDescriptionGeo", e.target.value)}
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
                    <ErrorText text={error || submitErr}/>
                </Stack>
            )}
        </FormDialog>
    );
}
