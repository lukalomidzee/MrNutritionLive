import {useEffect, useMemo, useState} from "react";
import {MenuItem, Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {ErrorText} from "../common/ErrorText";
import {api} from "../../api/adminApi";
import {ProfileRecordKind} from "../../types/admin";
import {ProfileRecordFormModel} from "./ProfileRecordFormTypes";

interface DictionaryOption {
    id: string;
    name: string;
}

const TYPE_KIND_MAP: Record<ProfileRecordKind, string> = {
    education: "EducationType",
    language: "LanguageType",
    profession: "ProfessionType",
    "work-experience": "WorkType",
    district: "District",
};

export default function ProfileRecordDialog({
                                                open,
                                                kind,
                                                title,
                                                initial,
                                                onClose,
                                                onSubmit,
                                                submitLabel,
                                                loading,
                                                error,
                                                hideOwnerFields = false,
                                                hideSortOrder = false,
                                            }: Readonly<{
    open: boolean;
    kind: ProfileRecordKind;
    title: string;
    initial: ProfileRecordFormModel;
    onClose: () => void;
    onSubmit: (model: ProfileRecordFormModel) => Promise<void>;
    submitLabel?: string;
    loading?: boolean;
    error?: string;
    hideOwnerFields?: boolean;
    hideSortOrder?: boolean;
}>) {
    const [m, setM] = useState<ProfileRecordFormModel>(initial);
    const [typeOptions, setTypeOptions] = useState<DictionaryOption[]>([]);
    const [localErr, setLocalErr] = useState<string>();

    useEffect(() => {
        if (open) setM(initial);
    }, [open, JSON.stringify(initial)]);

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const r = await api.get("/api/dictionaries", {
                    params: {kind: TYPE_KIND_MAP[kind]},
                });
                const list = r?.data?.data ?? r?.data ?? [];
                const items = Array.isArray(list) ? list : list.items ?? [];
                setTypeOptions(
                    items.map((i: any) => ({
                        id: i.id ?? i.Id,
                        name: i.name ?? i.Name ?? "",
                    }))
                );
            } catch {
                setTypeOptions([]);
            }
        })();
    }, [open, kind]);

    const set = <K extends keyof ProfileRecordFormModel>(
        k: K,
        v: ProfileRecordFormModel[K]
    ) => setM((s) => ({...s, [k]: v}));

    const requiresDates = kind === "education" || kind === "work-experience";
    const requiresCertificationDate = kind === "profession";

    const primaryLabel = useMemo(() => {
        switch (kind) {
            case "education":
                return "Education Type";
            case "language":
                return "Language Type";
            case "profession":
                return "Profession Type";
            case "work-experience":
                return "Work Type";
            case "district":
                return "District";
            default:
                return "Type";
        }
    }, [kind]);

    const submit = async () => {
        setLocalErr(undefined);
        if (!m.ownerType || !m.ownerId || !m.typeId) {
            setLocalErr("Owner and type are required.");
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
                                set(
                                    "ownerType",
                                    e.target.value as ProfileRecordFormModel["ownerType"]
                                )
                            }
                            fullWidth
                            required
                        >
                            <MenuItem value="Author">Author</MenuItem>
                            <MenuItem value="Student">Student</MenuItem>
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
                    label={primaryLabel}
                    value={m.typeId}
                    onChange={(e) => set("typeId", e.target.value)}
                    fullWidth
                    required
                >
                    <MenuItem value="">— Select —</MenuItem>
                    {typeOptions.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                            {t.name}
                        </MenuItem>
                    ))}
                </TextField>

                {requiresDates && (
                    <>
                        <TextField
                            type="date"
                            label="Start Date"
                            value={m.startDate ?? ""}
                            onChange={(e) => set("startDate", e.target.value)}
                            InputLabelProps={{shrink: true}}
                            fullWidth
                        />
                        <TextField
                            type="date"
                            label="End Date"
                            value={m.endDate ?? ""}
                            onChange={(e) => set("endDate", e.target.value)}
                            InputLabelProps={{shrink: true}}
                            fullWidth
                        />
                    </>
                )}

                {(kind === "education") && (
                    <>
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
                    </>
                )}

                {kind === "profession" && (
                    <>
                        <TextField
                            select
                            label="Certified"
                            value={m.certified ? "true" : "false"}
                            onChange={(e) => set("certified", e.target.value === "true")}
                            fullWidth
                        >
                            <MenuItem value="false">No</MenuItem>
                            <MenuItem value="true">Yes</MenuItem>
                        </TextField>
                        {requiresCertificationDate && (
                            <TextField
                                type="date"
                                label="Certification Date"
                                value={m.certificationDate ?? ""}
                                onChange={(e) => set("certificationDate", e.target.value)}
                                InputLabelProps={{shrink: true}}
                                fullWidth
                            />
                        )}
                    </>
                )}

                {kind === "work-experience" && (
                    <TextField
                        label="Work Description"
                        value={m.workDescription ?? ""}
                        onChange={(e) => set("workDescription", e.target.value)}
                        fullWidth
                    />
                )}

                {!hideSortOrder && (
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
                )}
                <ErrorText text={error ?? localErr}/>
            </Stack>
        </FormDialog>
    );
}
