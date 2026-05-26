import {useState} from "react";
import {Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {ErrorText} from "../common/ErrorText";
import {useDetailsOnOpen} from "../../hooks/useDetailsOnOpen";
import {api} from "../../api/adminApi";

export interface UpdateAuthorDTO {
    id: string;
    version: number;
    firstName: string;
    firstNameGeo: string;
    lastName: string;
    lastNameGeo: string;
    title?: string;
    titleGeo?: string;
    description?: string;
    descriptionGeo?: string;
    shortDescription?: string;
    shortDescriptionGeo?: string;
}

export default function UpdateAuthorDialog({
                                               open,
                                               authorId,
                                               onClose,
                                               onSaved,
                                               initial,
                                           }: Readonly<{
    open: boolean;
    authorId: string | null;
    onClose: () => void;
    onSaved: () => void;
    initial?: Partial<UpdateAuthorDTO>;
}>) {
    const map = (d: any): UpdateAuthorDTO => ({
        id: d.id ?? d.Id,
        version: d.version ?? d.Version ?? 0,
        firstName: d.firstName ?? d.FirstName ?? "",
        firstNameGeo: d.firstNameGeo ?? d.FirstNameGeo ?? "",
        lastName: d.lastName ?? d.LastName ?? "",
        lastNameGeo: d.lastNameGeo ?? d.LastNameGeo ?? "",
        title: d.title ?? d.Title ?? "",
        titleGeo: d.titleGeo ?? d.TitleGeo ?? "",
        description: d.description ?? d.Description ?? "",
        descriptionGeo: d.descriptionGeo ?? d.DescriptionGeo ?? "",
        shortDescription: d.shortDescription ?? d.ShortDescription ?? "",
        shortDescriptionGeo:
            d.shortDescriptionGeo ?? d.ShortDescriptionGeo ?? "",
    });

    const {
        model: m,
        setModel: setM,
        error,
    } = useDetailsOnOpen<UpdateAuthorDTO>({
        open,
        id: authorId,
        url: (id) => `/api/authors/${id}`,
        map,
        initial,
    });

    const [submitErr, setSubmitErr] = useState<string>();
    const [saving, setSaving] = useState(false);

    const set = <K extends keyof UpdateAuthorDTO>(k: K, v: UpdateAuthorDTO[K]) =>
        setM((s) => (s ? {...s, [k]: v} : s));

    const submit = async () => {
        if (!m) return;
        setSaving(true);
        setSubmitErr(undefined);
        try {
            let version = m.version;
            if (!version) {
                const res = await api.get(`/api/authors/${m.id}`);
                const d = res?.data?.data ?? res?.data ?? {};
                version = d.version ?? d.Version ?? 0;
            }
            await api.put(`/api/authors/${m.id}`, {
                ...m,
                version,
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
            title="Update author"
            onClose={onClose}
            onSubmit={submit}
            disabled={!m || saving}
        >
            {!m ? (
                "Loading…"
            ) : (
                <Stack spacing={2}>
                    <TextField
                        label="First name"
                        value={m.firstName ?? ""}
                        onChange={(e) => set("firstName", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="First name (Geo)"
                        value={m.firstNameGeo ?? ""}
                        onChange={(e) => set("firstNameGeo", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Last name"
                        value={m.lastName ?? ""}
                        onChange={(e) => set("lastName", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Last name (Geo)"
                        value={m.lastNameGeo ?? ""}
                        onChange={(e) => set("lastNameGeo", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Title"
                        value={m.title ?? ""}
                        onChange={(e) => set("title", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Title (Geo)"
                        value={m.titleGeo ?? ""}
                        onChange={(e) => set("titleGeo", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        value={m.description ?? ""}
                        onChange={(e) => set("description", e.target.value)}
                        multiline
                        minRows={3}
                        fullWidth
                    />
                    <TextField
                        label="Description (Geo)"
                        value={m.descriptionGeo ?? ""}
                        onChange={(e) => set("descriptionGeo", e.target.value)}
                        multiline
                        minRows={3}
                        fullWidth
                    />
                    <TextField
                        label="Short description"
                        value={m.shortDescription ?? ""}
                        onChange={(e) => set("shortDescription", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Short description (Geo)"
                        value={m.shortDescriptionGeo ?? ""}
                        onChange={(e) => set("shortDescriptionGeo", e.target.value)}
                        fullWidth
                    />
                    <ErrorText text={error || submitErr}/>
                </Stack>
            )}
        </FormDialog>
    );
}
