import { useState } from "react";
import FormDialog from "../common/FormDialog";
import { api } from "../../api/adminApi";
import { ErrorText } from "../common/ErrorText";

export default function UploadStudentPhotoDialog({
  open,
  studentId,
  onClose,
  onSaved,
}: {
  open: boolean;
  studentId: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string>();

  const submit = async () => {
    if (!studentId || !file) {
      setErr("Pick a file.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await api.post(`/api/Students/image/${studentId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
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
      title="Upload student photo"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="Upload"
      disabled={saving}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <ErrorText text={err} />
    </FormDialog>
  );
}
