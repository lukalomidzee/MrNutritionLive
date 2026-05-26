import {useEffect, useState} from "react";
import {MenuItem, Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {ErrorText} from "../common/ErrorText";
import {useDetailsOnOpen} from "../../hooks/useDetailsOnOpen";
import {api} from "../../api/adminApi";

interface DictionaryOption {
    id: string;
    name: string;
}

export interface UpdateSiteDetailDTO {
    id: string;
    version: number;
    pageTypeId: string;
    title: string;
    titleGeo: string;
    subtitle: string;
    subtitleGeo: string;
    titleColor: string;
    subtitleColor: string;
}

export default function UpdateSiteDetailDialog({
                                                   open,
                                                   siteDetailId,
                                                   onClose,
                                                   onSaved,
                                                   initial,
                                               }: Readonly<{
    open: boolean;
    siteDetailId: string | null;
    onClose: () => void;
    onSaved: () => void;
    initial?: Partial<UpdateSiteDetailDTO>;
}>) {
    const map = (d: any): UpdateSiteDetailDTO => ({
        id: d.id ?? d.Id,
        version: d.version ?? d.Version ?? 0,
        pageTypeId: d.pageTypeId ?? d.PageTypeId ?? "",
        title: d.title ?? d.Title ?? "",
        titleGeo: d.titleGeo ?? d.TitleGeo ?? "",
        subtitle: d.subtitle ?? d.Subtitle ?? "",
        subtitleGeo: d.subtitleGeo ?? d.SubtitleGeo ?? "",
        titleColor: d.titleColor ?? d.TitleColor ?? "",
        subtitleColor: d.subtitleColor ?? d.SubtitleColor ?? "",
    });

    const {
        model: m,
        setModel: setM,
        error,
    } = useDetailsOnOpen<UpdateSiteDetailDTO>({
        open,
        id: siteDetailId,
        url: (id) => `/api/sitedetails/${id}`,
        map,
        initial,
    });

    const set = <K extends keyof UpdateSiteDetailDTO>(
        k: K,
        v: UpdateSiteDetailDTO[K]
    ) => setM((s) => (s ? {...s, [k]: v} : s));

    const [pageTypes, setPageTypes] = useState<DictionaryOption[]>([]);
    const [submitErr, setSubmitErr] = useState<string>();
    const [saving, setSaving] = useState(false);

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
        if (!m) return;
        setSaving(true);
        setSubmitErr(undefined);
        try {
            await api.put("/api/sitedetails", {
                ...m,
                subtitle: m.subtitle.trim() || null,
                subtitleGeo: m.subtitleGeo.trim() || null,
                titleColor: m.titleColor.trim() || null,
                subtitleColor: m.subtitleColor.trim() || null,
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
            title="Update site detail"
            onClose={onClose}
            onSubmit={submit}
            disabled={!m || saving}
        >
            {!m ? (
                "Loading…"
            ) : (
                <Stack spacing={2}>
                    <TextField
                        select
                        label="Page Type"
                        value={m.pageTypeId ?? ""}
                        onChange={(e) => set("pageTypeId", e.target.value)}
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
                        label="Subtitle"
                        value={m.subtitle ?? ""}
                        onChange={(e) => set("subtitle", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Subtitle (Geo)"
                        value={m.subtitleGeo ?? ""}
                        onChange={(e) => set("subtitleGeo", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Title Color"
                        value={m.titleColor ?? ""}
                        onChange={(e) => set("titleColor", e.target.value)}
                        placeholder="#FFFFFF"
                        fullWidth
                    />
                    <TextField
                        label="Subtitle Color"
                        value={m.subtitleColor ?? ""}
                        onChange={(e) => set("subtitleColor", e.target.value)}
                        placeholder="#FFFFFF"
                        fullWidth
                    />
                    <ErrorText text={error || submitErr}/>
                </Stack>
            )}
        </FormDialog>
    );
}
