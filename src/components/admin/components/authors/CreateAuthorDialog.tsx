import { useState, useEffect } from "react";
import { Stack, TextField } from "@mui/material";
import FormDialog from "../common/FormDialog";
import { api } from "../../api/adminApi";
import { ErrorText } from "../common/ErrorText";

export interface CreateAuthorDTO {
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

export default function CreateAuthorDialog({
  open,
  onClose,
  onSaved,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}>) {
  const initialState: CreateAuthorDTO = {
    firstName: "",
    firstNameGeo: "",
    lastName: "",
    lastNameGeo: "",
    title: "",
    titleGeo: "",
    description: "",
    descriptionGeo: "",
    shortDescription: "",
    shortDescriptionGeo: "",
  };
  const [m, setM] = useState<CreateAuthorDTO>(initialState);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string>();
  const set = (k: keyof CreateAuthorDTO, v: any) =>
    setM((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    if (!open) {
      setM(initialState);
      setErr(undefined);
      setSaving(false);
    }
  }, [open]);

  const submit = async () => {
    setSaving(true);
    try {
      await api.post("/api/authors", m);
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
      title="Add author"
      onClose={onClose}
      onSubmit={submit}
      disabled={saving}
    >
      <Stack spacing={2}>
        <TextField
          label="First name"
          value={m.firstName}
          onChange={(e) => set("firstName", e.target.value)}
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
          label="Description"
          value={m.description}
          onChange={(e) => set("description", e.target.value)}
          multiline
          minRows={3}
          fullWidth
        />
        <TextField
          label="Description (Geo)"
          value={m.descriptionGeo}
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
        <ErrorText text={err} />
      </Stack>
    </FormDialog>
  );
}
