import {useEffect, useState} from "react";
import {MenuItem, Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {ErrorText} from "../common/ErrorText";
import {api} from "../../api/adminApi";
import {SocialLinkOwnerType} from "../../types/admin";

interface DictionaryOption {
    id: string;
    name: string;
}

export interface SocialLinkFormModel {
    id?: string;
    version?: number;
    ownerType: SocialLinkOwnerType;
    ownerId: string;
    linkTypeId: string;
    linkUrl: string;
    title?: string;
    titleGeo?: string;
    sortOrder?: number | "";
}

export default function SocialLinkDialog({
                                             open,
                                             title,
                                             initial,
                                             onClose,
                                             onSubmit,
                                             submitLabel,
                                             loading,
                                             error,
                                             hideOwnerFields = false,
                                         }: Readonly<{
    open: boolean;
    title: string;
    initial: SocialLinkFormModel;
    onClose: () => void;
    onSubmit: (model: SocialLinkFormModel) => Promise<void>;
    submitLabel?: string;
    loading?: boolean;
    error?: string;
    hideOwnerFields?: boolean;
}>) {
    const [m, setM] = useState<SocialLinkFormModel>(initial);
    const [linkTypes, setLinkTypes] = useState<DictionaryOption[]>([]);
    const [localErr, setLocalErr] = useState<string>();

    useEffect(() => {
        if (open) setM(initial);
    }, [open, JSON.stringify(initial)]);

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const r = await api.get("/api/dictionaries", {
                    params: {kind: "LinkType"},
                });
                const list = r?.data?.data ?? r?.data ?? [];
                const items = Array.isArray(list) ? list : list.items ?? [];
                setLinkTypes(
                    items.map((i: any) => ({
                        id: i.id ?? i.Id,
                        name: i.name ?? i.Name ?? "",
                    }))
                );
            } catch {
                setLinkTypes([]);
            }
        })();
    }, [open]);

    const set = <K extends keyof SocialLinkFormModel>(
        k: K,
        v: SocialLinkFormModel[K]
    ) => setM((s) => ({...s, [k]: v}));

    const submit = async () => {
        setLocalErr(undefined);
        if (!m.ownerType || !m.ownerId || !m.linkTypeId || !m.linkUrl) {
            setLocalErr("Owner, type, and link URL are required.");
            return;
        }
        await onSubmit(m);
    };

    return (
        <FormDialog
            open={open}
            title={title}
            onClose={onClose}
            onSubmit={submit}
            submitLabel={submitLabel}
            disabled={loading}
        >
            <Stack spacing={2}>
                {!hideOwnerFields && (
                    <>
                        <TextField
                            select
                            label="Owner Type"
                            value={m.ownerType}
                            onChange={(e) =>
                                set("ownerType", e.target.value as SocialLinkOwnerType)
                            }
                            fullWidth
                            required
                        >
                            <MenuItem value="Author">Author</MenuItem>
                            <MenuItem value="Student">Student</MenuItem>
                            <MenuItem value="Issuer">Issuer</MenuItem>
                            <MenuItem value="SiteDetail">SiteDetail</MenuItem>
                        </TextField>
                        <TextField
                            label="Owner ID"
                            value={m.ownerId}
                            onChange={(e) => set("ownerId", e.target.value)}
                            fullWidth
                            required
                        />
                    </>
                )}
                <TextField
                    select
                    label="Link Type"
                    value={m.linkTypeId}
                    onChange={(e) => set("linkTypeId", e.target.value)}
                    fullWidth
                    required
                >
                    <MenuItem value="">— Select —</MenuItem>
                    {linkTypes.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                            {t.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Link URL"
                    value={m.linkUrl}
                    onChange={(e) => set("linkUrl", e.target.value)}
                    fullWidth
                    required
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
                    type="number"
                    label="Sort Order"
                    value={m.sortOrder ?? ""}
                    onChange={(e) =>
                        set(
                            "sortOrder",
                            e.target.value === "" ? "" : Number(e.target.value)
                        )
                    }
                    fullWidth
                />
                <ErrorText text={error ?? localErr}/>
            </Stack>
        </FormDialog>
    );
}
