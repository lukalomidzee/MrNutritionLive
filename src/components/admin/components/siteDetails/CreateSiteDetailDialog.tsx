import {useEffect, useState} from "react";
import {MenuItem, Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {api} from "../../api/adminApi";
import {ErrorText} from "../common/ErrorText";

interface DictionaryOption {
    id: string;
    name: string;
}

export interface CreateSiteDetailDTO {
    pageTypeId: string;
    title: string;
    titleGeo: string;
    subtitle: string;
    subtitleGeo: string;
    titleColor: string;
    subtitleColor: string;
}

export default function CreateSiteDetailDialog({
                                                   open,
                                                   onClose,
                                                   onSaved,
                                               }: Readonly<{
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}>) {
    const [m, setM] = useState<CreateSiteDetailDTO>({
        pageTypeId: "",
        title: "",
        titleGeo: "",
        subtitle: "",
        subtitleGeo: "",
        titleColor: "",
        subtitleColor: "",
    });
    const [pageTypes, setPageTypes] = useState<DictionaryOption[]>([]);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string>();
    const set = (k: keyof CreateSiteDetailDTO, v: any) =>
        setM((s) => ({...s, [k]: v}));

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const r = await api.get("/api/dictionaries", {
                    params: {kind: "PageType"},
                });
                const list = r?.data?.data ?? r?.data ?? [];
                const items = Array.isArray(list) ? list : list.items ?? [];
                setPageTypes(
                    items.map((i: any) => ({
                        id: i.id ?? i.Id,
                        name: i.name ?? i.Name ?? "",
                    }))
                );
            } catch {
                setPageTypes([]);
            }
        })();
    }, [open]);

    const submit = async () => {
        if (
            !m.pageTypeId ||
            !m.title ||
            !m.titleGeo
        ) {
            setErr("Please fill required fields.");
            return;
        }
        setSaving(true);
        try {
            await api.post("/api/sitedetails", {
                ...m,
                subtitle: m.subtitle.trim() || null,
                subtitleGeo: m.subtitleGeo.trim() || null,
                titleColor: m.titleColor.trim() || null,
                subtitleColor: m.subtitleColor.trim() || null,
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
            title="Add site detail"
            onClose={onClose}
            onSubmit={submit}
            disabled={saving}
        >
            <Stack spacing={2}>
                <TextField
                    select
                    label="Page Type"
                    value={m.pageTypeId}
                    onChange={(e) => set("pageTypeId", e.target.value)}
                    required
                    fullWidth
                >
                    <MenuItem value="">— Select —</MenuItem>
                    {pageTypes.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                            {t.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Title"
                    value={m.title}
                    onChange={(e) => set("title", e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Title (Geo)"
                    value={m.titleGeo}
                    onChange={(e) => set("titleGeo", e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Subtitle"
                    value={m.subtitle}
                    onChange={(e) => set("subtitle", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Subtitle (Geo)"
                    value={m.subtitleGeo}
                    onChange={(e) => set("subtitleGeo", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Title Color"
                    value={m.titleColor}
                    onChange={(e) => set("titleColor", e.target.value)}
                    placeholder="#FFFFFF"
                    fullWidth
                />
                <TextField
                    label="Subtitle Color"
                    value={m.subtitleColor}
                    onChange={(e) => set("subtitleColor", e.target.value)}
                    placeholder="#FFFFFF"
                    fullWidth
                />
                <ErrorText text={err}/>
            </Stack>
        </FormDialog>
    );
}
