import {useEffect, useState } from "react";
import { Stack, TextField, MenuItem } from "@mui/material";
import FormDialog from "../common/FormDialog";
import { ErrorText } from "../common/ErrorText";
import { useDetailsOnOpen } from "../../hooks/useDetailsOnOpen";
import { api } from "../../api/adminApi";

interface UpdateStudentDTO {
  id: string;
  version: number;
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

const DEFAULTS: Partial<UpdateStudentDTO> = {
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
};

export default function UpdateStudentDialog({
  open,
  studentId,
  initial,
  onClose,
  onSaved,
}: Readonly<{
  open: boolean;
  studentId: string | null;
  initial?: Partial<UpdateStudentDTO>;
  onClose: () => void;
  onSaved: () => void;
}>) {
  const map = (d: any): UpdateStudentDTO => ({
    id: d.id ?? d.Id,
    version: d.version ?? d.Version ?? 0,
    firstName: d.firstName ?? d.FirstName ?? "",
    firstNameGeo: d.firstNameGeo ?? d.FirstNameGeo ?? "",
    lastName: d.lastName ?? d.LastName ?? "",
    lastNameGeo: d.lastNameGeo ?? d.LastNameGeo ?? "",
    title: d.title ?? d.Title ?? "",
    titleGeo: d.titleGeo ?? d.TitleGeo ?? "",
    sexTypeId: d.sexTypeId ?? d.SexTypeId ?? "",
    birthDate: d.birthDate ?? d.BirthDate ?? "",
    email: d.email ?? d.Email ?? "",
    phoneNumber: d.phoneNumber ?? d.PhoneNumber ?? "",
    about: d.about ?? d.About ?? "",
    aboutGeo: d.aboutGeo ?? d.AboutGeo ?? "",
    emailVisible: d.emailVisible ?? d.EmailVisible ?? true,
    phoneVisible: d.phoneVisible ?? d.PhoneVisible ?? true,
    academyFavourite: d.academyFavourite ?? d.AcademyFavourite ?? false,
    featured: d.featured ?? d.Featured ?? false,
  });

  const {
    model: m,
    setModel: setM,
    error,
  } = useDetailsOnOpen<UpdateStudentDTO>({
    open,
    id: studentId,
    url: (id) => `/api/students/${id}`,
    map,
    initial,
    defaults: DEFAULTS,
  });

  const set = <K extends keyof UpdateStudentDTO>(
    k: K,
    v: UpdateStudentDTO[K]
  ) => setM((s) => (s ? { ...s, [k]: v } : s));

  const [submitErr, setSubmitErr] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [sexOptions, setSexOptions] = useState<{id: string; name: string}[]>([]);

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
    if (!m) return;
    setSaving(true);
    setSubmitErr(undefined);
    try {
      const payload = { ...m };
      await api.put(`/api/students`, payload);
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
      title="Update student"
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
            select
            label="Sex"
            value={m.sexTypeId ?? ""}
            onChange={(e) => set("sexTypeId", e.target.value)}
            fullWidth
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
            value={m.email ?? ""}
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

          <ErrorText text={error ?? submitErr} />
        </Stack>
      )}
    </FormDialog>
  );
}
