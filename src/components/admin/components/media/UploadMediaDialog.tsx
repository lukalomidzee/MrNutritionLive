import {useEffect, useMemo, useRef, useState} from "react";
import {MenuItem, Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {api} from "../../api/adminApi";
import {ErrorText} from "../common/ErrorText";
import {MediaEntityType, StorageProvider} from "../../types/admin";
import {MEDIA_ROLE_NAMES_BY_ENTITY} from "./mediaRoles";

interface DictionaryOption {
    id: string;
    name: string;
}

export default function UploadMediaDialog({
                                              open,
                                              entityType,
                                              entityId,
                                              onClose,
                                              onSaved,
                                          }: Readonly<{
    open: boolean;
    entityType: MediaEntityType | null;
    entityId: string | null;
    onClose: () => void;
    onSaved: () => void;
}>) {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [roles, setRoles] = useState<DictionaryOption[]>([]);
    const [roleId, setRoleId] = useState("");
    const [storageProvider, setStorageProvider] =
        useState<StorageProvider>("Local");
    const [externalUrl, setExternalUrl] = useState("");
    const [sortOrder, setSortOrder] = useState<number | "">("");
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string>();

    const allowedRoleNames = useMemo(() => {
        if (!entityType) return [];
        if (
            entityType === "Enrollment" ||
            entityType === "Section" ||
            entityType === "EducationRecord"
        )
            return [];
        return MEDIA_ROLE_NAMES_BY_ENTITY[entityType] ?? [];
    }, [entityType]);

    const requireRole =
        !!entityType &&
        entityType !== "Enrollment" &&
        entityType !== "Section" &&
        entityType !== "EducationRecord";

    const selectedRoleName =
        roles.find((r) => r.id === roleId)?.name ?? "";

    const allowExternal =
        !!selectedRoleName &&
        (selectedRoleName.includes("Video") ||
            selectedRoleName.includes("Playlist"));

    const showSortOrder =
        selectedRoleName === "CourseGalleryItem" ||
        selectedRoleName === "AuthorGallery";

    useEffect(() => {
        if (!open) return;
        setErr(undefined);
        setStorageProvider("Local");
        setExternalUrl("");
        setSortOrder("");
    }, [roleId, open]);

    useEffect(() => {
        if (!open) return;
        if (!allowExternal && storageProvider === "External") {
            setStorageProvider("Local");
            setExternalUrl("");
        }
    }, [allowExternal, storageProvider, open]);

    useEffect(() => {
        if (!open || !entityType || allowedRoleNames.length === 0) {
            setRoles([]);
            setRoleId("");
            return;
        }
        (async () => {
            try {
                const r = await api.get("/api/dictionaries", {
                    params: {kind: "MediaRoleType"},
                });
                const list = r?.data?.data ?? r?.data ?? [];
                const items = Array.isArray(list) ? list : list.items ?? [];
                const filtered = items.filter((i: any) =>
                    allowedRoleNames.includes(i.name ?? i.Name ?? "")
                );
                setRoles(
                    filtered.map((i: any) => ({
                        id: i.id ?? i.Id,
                        name: i.name ?? i.Name ?? "",
                    }))
                );
            } catch {
                setRoles([]);
            }
        })();
    }, [open, entityType, allowedRoleNames.join("|")]);

    useEffect(() => {
        if (!open) {
            setRoleId("");
            setStorageProvider("Local");
            setExternalUrl("");
            setSortOrder("");
            setErr(undefined);
        }
    }, [open]);

    const submit = async () => {
        if (!entityType || !entityId) {
            setErr("Missing entity.");
            return;
        }
        if (requireRole && !roleId) {
            setErr("Select a media role.");
            return;
        }
        if (storageProvider === "Local") {
            const file = fileRef.current?.files?.[0];
            if (!file) {
                setErr("Select a file.");
                return;
            }
        } else {
            if (!allowExternal) {
                setErr("External upload is only allowed for video roles.");
                return;
            }
            if (!externalUrl) {
                setErr("External URL is required.");
                return;
            }
        }

        setSaving(true);
        setErr(undefined);
        try {
            const fd = new FormData();
            fd.append("entityType", entityType);
            fd.append("entityId", entityId);
            if (roleId) fd.append("mediaRoleTypeId", roleId);
            fd.append("storageProvider", storageProvider);
            if (storageProvider === "Local") {
                const file = fileRef.current?.files?.[0];
                if (file) fd.append("file", file);
            } else {
                fd.append("externalUrl", externalUrl);
                fd.append("externalMimeType", "ExternalVideo");
            }
            if (showSortOrder && sortOrder !== "")
                fd.append("sortOrder", String(sortOrder));

            await api.post("/api/media", fd, {
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
            title="Upload media"
            onClose={onClose}
            onSubmit={submit}
            submitLabel="Upload"
            disabled={saving || !entityType || !entityId}
        >
            <Stack spacing={2}>
                {requireRole && (
                    <TextField
                        select
                        label="Role"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        required
                        fullWidth
                    >
                        <MenuItem value="">— Select —</MenuItem>
                        {roles.map((r) => (
                            <MenuItem key={r.id} value={r.id}>
                                {r.name}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
                <TextField
                    select
                    label="Storage Provider"
                    value={storageProvider}
                    onChange={(e) =>
                        setStorageProvider(e.target.value as StorageProvider)
                    }
                    fullWidth
                >
                    <MenuItem value="Local">Local</MenuItem>
                    {allowExternal && <MenuItem value="External">External</MenuItem>}
                </TextField>
                {storageProvider === "Local" ? (
                    <input type="file" ref={fileRef}/>
                ) : (
                    <>
                        <TextField
                            label="External URL"
                            value={externalUrl}
                            onChange={(e) => setExternalUrl(e.target.value)}
                            fullWidth
                        />
                    </>
                )}
                {showSortOrder && (
                    <TextField
                        type="number"
                        label="Sort Order"
                        value={sortOrder}
                        onChange={(e) =>
                            setSortOrder(
                                e.target.value === "" ? "" : Number(e.target.value)
                            )
                        }
                        fullWidth
                    />
                )}
                <ErrorText text={err}/>
            </Stack>
        </FormDialog>
    );
}
