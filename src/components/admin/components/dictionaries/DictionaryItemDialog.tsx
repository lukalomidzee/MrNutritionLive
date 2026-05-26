import {useEffect, useState} from "react";
import {MenuItem, Stack, TextField} from "@mui/material";
import FormDialog from "../common/FormDialog";
import {ErrorText} from "../common/ErrorText";
import {api} from "../../api/adminApi";

interface DictionaryOption {
    id: string;
    name: string;
}

export interface DictionaryItemFormModel {
    id?: string;
    version?: number;
    kindId: number;
    kindName: string;
    parentId?: string;
    name: string;
    nameGeo: string;
}

export default function DictionaryItemDialog({
                                                 open,
                                                 title,
                                                 initial,
                                                 onClose,
                                                 onSubmit,
                                                 submitLabel,
                                                 loading,
                                                 error,
                                             }: Readonly<{
    open: boolean;
    title: string;
    initial: DictionaryItemFormModel;
    onClose: () => void;
    onSubmit: (model: DictionaryItemFormModel) => Promise<void>;
    submitLabel?: string;
    loading?: boolean;
    error?: string;
}>) {
    const [m, setM] = useState<DictionaryItemFormModel>(initial);
    const [parentOptions, setParentOptions] = useState<DictionaryOption[]>([]);
    const [localErr, setLocalErr] = useState<string>();

    const parentKindId =
        m.kindId === 2
            ? 1
            : m.kindId === 3
              ? 2
              : null;

    useEffect(() => {
        if (open) setM(initial);
    }, [open, JSON.stringify(initial)]);

    useEffect(() => {
        if (!open || !parentKindId) {
            setParentOptions([]);
            return;
        }
        (async () => {
            try {
                const r = await api.get("/api/dictionaries", {
                    params: {kind: parentKindId},
                });
                const list = r?.data?.data ?? r?.data ?? [];
                const items = Array.isArray(list) ? list : list.items ?? [];
                setParentOptions(
                    items.map((i: any) => ({
                        id: i.id ?? i.Id,
                        name: i.name ?? i.Name ?? "",
                    }))
                );
            } catch {
                setParentOptions([]);
            }
        })();
    }, [open, parentKindId]);

    const set = <K extends keyof DictionaryItemFormModel>(
        k: K,
        v: DictionaryItemFormModel[K]
    ) => setM((s) => ({...s, [k]: v}));

    const submit = async () => {
        setLocalErr(undefined);
        if (!m.kindId || !m.name || !m.nameGeo) {
            setLocalErr("Kind, name, and nameGeo are required.");
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
                <TextField
                    label="Kind"
                    value={m.kindName}
                    fullWidth
                    required
                    disabled
                />
                {parentKindId && (
                    <TextField
                        select
                        label={m.kindId === 2 ? "Country" : "City"}
                        value={m.parentId ?? ""}
                        onChange={(e) => set("parentId", e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="">— None —</MenuItem>
                        {parentOptions.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
                <TextField
                    label="Name"
                    value={m.name}
                    onChange={(e) => set("name", e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Name (Geo)"
                    value={m.nameGeo}
                    onChange={(e) => set("nameGeo", e.target.value)}
                    fullWidth
                    required
                />
                <ErrorText text={error ?? localErr}/>
            </Stack>
        </FormDialog>
    );
}
