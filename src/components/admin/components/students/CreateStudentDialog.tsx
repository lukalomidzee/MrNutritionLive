import {useEffect, useState} from "react";
import {MenuItem, Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {api} from "../../api/adminApi";
import {ErrorText} from "../common/ErrorText";

export interface CreateStudentDTO {
    firstName: string;
    firstNameGeo: string;
    lastName: string;
    lastNameGeo: string;
    title: string;
    titleGeo: string;
    sexTypeId: string;
    birthDate?: string;
    email?: string;
    phoneNumber?: string;
    about?: string;
    aboutGeo?: string;
    emailVisible: boolean;
    phoneVisible: boolean;
    academyFavourite: boolean;
    featured: boolean;
}

export default function CreateStudentDialog({
                                                open,
                                                onClose,
                                                onSaved,
                                            }: Readonly<{
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}>) {
    const [m, setM] = useState<CreateStudentDTO>({
        firstName: "",
        firstNameGeo: "",
        lastName: "",
        lastNameGeo: "",
        title: "",
        titleGeo: "",
        sexTypeId: "",
        birthDate: "",
        email: "",
        phoneNumber: "",
        about: "",
        aboutGeo: "",
        emailVisible: true,
        phoneVisible: true,
        academyFavourite: false,
        featured: false,
    });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string>();
    const [sexOptions, setSexOptions] = useState<{id: string; name: string}[]>([]);
    const set = (k: keyof CreateStudentDTO, v: any) =>
        setM((s) => ({...s, [k]: v}));

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const r = await api.get("/api/dictionaries", {
                    params: {kind: "SexType"},
                });
                const list = r?.data?.data ?? r?.data ?? [];
                const items = Array.isArray(list) ? list : list.items ?? [];
                setSexOptions(
                    items.map((i: any) => ({
                        id: i.id ?? i.Id,
                        name: i.name ?? i.Name ?? "",
                    }))
                );
            } catch {
                setSexOptions([]);
            }
        })();
    }, [open]);

    const submit = async () => {
        if (
            !m.firstName ||
            !m.firstNameGeo ||
            !m.lastName ||
            !m.lastNameGeo ||
            !m.title ||
            !m.titleGeo ||
            !m.sexTypeId
        ) {
            setErr("Please fill all required fields.");
            return;
        }
        setSaving(true);
        try {
            await api.post("/api/students", m);
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
            title="Add student"
            onClose={onClose}
            onSubmit={submit}
            disabled={saving}
        >
            <Stack spacing={2}>
                <TextField
                    label="First name"
                    value={m.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="First name (Geo)"
                    value={m.firstNameGeo}
                    onChange={(e) => set("firstNameGeo", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Last name"
                    value={m.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Last name (Geo)"
                    value={m.lastNameGeo}
                    onChange={(e) => set("lastNameGeo", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Title"
                    value={m.title}
                    onChange={(e) => set("title", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Title (Geo)"
                    value={m.titleGeo}
                    onChange={(e) => set("titleGeo", e.target.value)}
                    fullWidth
                />
                <TextField
                    select
                    label="Sex"
                    value={m.sexTypeId}
                    onChange={(e) => set("sexTypeId", e.target.value)}
                    fullWidth
                    required
                >
                    <MenuItem value="">— Select —</MenuItem>
                    {sexOptions.map((opt) => (
                        <MenuItem key={opt.id} value={opt.id}>
                            {opt.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    type="date"
                    label="Birth date"
                    value={m.birthDate ?? ""}
                    onChange={(e) => set("birthDate", e.target.value)}
                    InputLabelProps={{shrink: true}}
                    fullWidth
                />
                <TextField
                    label="Email"
                    value={m.email}
                    onChange={(e) => set("email", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Phone"
                    value={m.phoneNumber ?? ""}
                    onChange={(e) => set("phoneNumber", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="About"
                    value={m.about ?? ""}
                    onChange={(e) => set("about", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="About (Geo)"
                    value={m.aboutGeo ?? ""}
                    onChange={(e) => set("aboutGeo", e.target.value)}
                    fullWidth
                />
                <ErrorText text={err}/>
            </Stack>
        </FormDialog>
    );
}
