import { useEffect, useMemo, useState } from "react";
import GenericTab from "../tabs/GenericTab";
import { useLoadList } from "../hooks/useLoadList";
import { mapStudentDto } from "../mappers/mapper";
import { studentActions } from "../components/TabConfig";
import { StudentRow, MediaEntityType } from "../types/admin";
import CreateStudentDialog from "../components/students/CreateStudentDialog";
import UpdateStudentDialog from "../components/students/UpdateStudentDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { api } from "../api/adminApi";
import UploadMediaDialog from "../components/media/UploadMediaDialog";
import ManageMediaDialog from "../components/media/ManageMediaDialog";
import ManageProfileRecordsDialog from "../components/profileRecords/ManageProfileRecordsDialog";
import ManageSocialLinksDialog from "../components/socialLinks/ManageSocialLinksDialog";
import { ColumnDef } from "../components/TableTypes";
import { Checkbox } from "@mui/material";

export default function StudentsTabContainer() {
  const { rows, reload } = useLoadList<any, StudentRow>({
    url: "/api/students/paged",
    query: { page: 1, pageSize: 50 },
    map: mapStudentDto,
  });
  const [localRows, setLocalRows] = useState<StudentRow[]>([]);
  const [togglingIds, setTogglingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  const [modal, setModal] = useState<
    | null
    | "create"
    | "update"
    | "delete"
    | "upload"
    | "manage-media"
    | "manage-records"
    | "manage-socials"
  >(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mediaEntity, setMediaEntity] = useState<{
    entityType: MediaEntityType | null;
    entityId: string | null;
  }>({ entityType: null, entityId: null });
  const [manageMediaEntity, setManageMediaEntity] = useState<{
    entityType: MediaEntityType | null;
    entityId: string | null;
  }>({ entityType: null, entityId: null });
  const [recordsOwnerId, setRecordsOwnerId] = useState<string | null>(null);
  const [recordsOwnerLabel, setRecordsOwnerLabel] = useState<string | null>(null);
  const [socialOwnerId, setSocialOwnerId] = useState<string | null>(null);
  const [socialOwnerLabel, setSocialOwnerLabel] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  const [selectedInitial, setSelectedInitial] = useState<any | null>(null);

  const open = (m: typeof modal, id?: string) => {
    setModal(m);
    setSelectedId(id ?? null);
    if (m === "delete") setDeleteError(undefined);
  };
  const close = () => {
    setModal(null);
    setDeleteError(undefined);
  };
  const saved = () => {
    close();
    reload();
  };

  const upsertRow = (id: string, patch: Partial<StudentRow>) => {
    setLocalRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const fetchStudentRow = async (id: string) => {
    const res = await api.get(`/api/students/${id}`);
    const payload = res?.data?.data ?? res?.data ?? {};
    const mapped = mapStudentDto(payload);
    upsertRow(id, mapped);
    return mapped;
  };

  const studentFlagConfig = {
    featured: {
      endpoint: "featured",
      responseKey: "featured",
      requestKey: "featured",
    },
    academyFavourite: {
      endpoint: "academy-favourite",
      responseKey: "academyFavourite",
      requestKey: "academyFavourite",
    },
    emailVisible: {
      endpoint: "email-visible",
      responseKey: "emailVisible",
      requestKey: "emailVisible",
    },
    phoneVisible: {
      endpoint: "phone-visible",
      responseKey: "phoneVisible",
      requestKey: "phoneVisible",
    },
  } as const;

  const mapStudentFlagPatch = (data: any, fallback: StudentRow): Partial<StudentRow> => ({
    featured: data.featured ?? data.Featured ?? fallback.featured ?? false,
    academyFavourite:
      data.academyFavourite ??
      data.AcademyFavourite ??
      fallback.academyFavourite ??
      false,
    emailVisible:
      data.emailVisible ?? data.EmailVisible ?? fallback.emailVisible ?? true,
    phoneVisible:
      data.phoneVisible ?? data.PhoneVisible ?? fallback.phoneVisible ?? true,
    version: data.version ?? data.Version ?? fallback.version,
  });

  const toggleStudentFlag = async (
    row: StudentRow,
    key: keyof typeof studentFlagConfig,
    value: boolean
  ) => {
    const config = studentFlagConfig[key];
    const endpoint = `/api/students/${row.id}/${config.endpoint}`;
    const body = { [config.requestKey]: value, version: row.version };

    setTogglingIds((s) => ({ ...s, [row.id]: true }));
    try {
      try {
        const res = await api.patch(endpoint, body);
        const data = res?.data?.data ?? {};
        upsertRow(row.id, mapStudentFlagPatch(data, row));
        return;
      } catch (e: any) {
        const message =
          e?.response?.data?.message?.toLowerCase?.() ??
          e?.message?.toLowerCase?.() ??
          "";
        const looksLikeVersionMismatch =
          message.includes("versionmismatch") || message.includes("version");

        if (!looksLikeVersionMismatch) {
          return;
        }
      }

      const fresh = await fetchStudentRow(row.id);
      const retryBody = { [config.requestKey]: value, version: fresh.version };
      const retryRes = await api.patch(endpoint, retryBody);
      const data = retryRes?.data?.data ?? {};
      upsertRow(row.id, mapStudentFlagPatch(data, fresh));
    } finally {
      setTogglingIds((s) => ({ ...s, [row.id]: false }));
    }
  };

  const columns = useMemo<ColumnDef<StudentRow>[]>(
    () => [
      { key: "n", header: "N", render: (_r, i) => i + 1 },
      { key: "fn", header: "First Name", render: (r) => r.firstName },
      { key: "ln", header: "Last Name", render: (r) => r.lastName },
      { key: "sex", header: "Sex", render: (r) => r.sexTypeName ?? "—" },
      { key: "birth", header: "Birth Date", render: (r) => r.birthDate ?? "—" },
      { key: "email", header: "Email", render: (r) => r.email ?? "—" },
      {
        key: "emailVisible",
        header: "Email Visible",
        render: (r) => (
          <Checkbox
            checked={!!r.emailVisible}
            disabled={!!togglingIds[r.id]}
            onChange={(_, checked) =>
              toggleStudentFlag(r, "emailVisible", checked)
            }
          />
        ),
      },
      { key: "phone", header: "Phone Number", render: (r) => r.phoneNumber ?? "—" },
      {
        key: "phoneVisible",
        header: "Phone Visible",
        render: (r) => (
          <Checkbox
            checked={!!r.phoneVisible}
            disabled={!!togglingIds[r.id]}
            onChange={(_, checked) =>
              toggleStudentFlag(r, "phoneVisible", checked)
            }
          />
        ),
      },
      { key: "title", header: "Title", render: (r) => r.title ?? "—" },
      {
        key: "fav",
        header: "Academy Favourite",
        render: (r) => (
          <Checkbox
            checked={!!r.academyFavourite}
            disabled={!!togglingIds[r.id]}
            onChange={(_, checked) =>
              toggleStudentFlag(r, "academyFavourite", checked)
            }
          />
        ),
      },
      {
        key: "feat",
        header: "Featured",
        render: (r) => (
          <Checkbox
            checked={!!r.featured}
            disabled={!!togglingIds[r.id]}
            onChange={(_, checked) => toggleStudentFlag(r, "featured", checked)}
          />
        ),
      },
    ],
    [togglingIds]
  );

  const actions = useMemo(
    () =>
      studentActions({
        onEdit: (r) => openUpdate(r),
        onUploadCover: (r) => {
          setMediaEntity({ entityType: "Student", entityId: r.id });
          open("upload", r.id);
        },
        onManageMedia: (r) => {
          setManageMediaEntity({ entityType: "Student", entityId: r.id });
          open("manage-media", r.id);
        },
        onManageRecords: (r) => {
          setRecordsOwnerId(r.id);
          setRecordsOwnerLabel(`${r.firstName} ${r.lastName}`);
          open("manage-records", r.id);
        },
        onManageSocials: (r) => {
          setSocialOwnerId(r.id);
          setSocialOwnerLabel(`${r.firstName} ${r.lastName}`);
          open("manage-socials", r.id);
        },
        onDelete: (r) => open("delete", r.id),
      }),
    [reload]
  );

  async function confirmDeleteStudent() {
    if (!selectedId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/students/${selectedId}`);
      saved();
    } catch (e: any) {
      setDeleteError(
        e?.response?.data?.message ?? e?.message ?? "Failed to delete."
      );
      setDeleting(false);
    }
  }

  const openUpdate = (row: StudentRow) => {
    setSelectedId(row.id);
    setSelectedInitial({
      firstName: row.firstName,
      lastName: row.lastName,
      birthDate: row.birthDate,
      email: row.email,
      phoneNumber: row.phoneNumber,
      title: row.title,
      emailVisible: row.emailVisible,
      phoneVisible: row.phoneVisible,
      academyFavourite: row.academyFavourite,
      featured: row.featured,
    });
    setModal("update");
  };

  return (
    <>
      <GenericTab<StudentRow>
        title="Students"
        columns={columns}
        rows={localRows}
        actions={actions}
        onAdd={() => open("create")}
        addLabel="Add student"
      />

      <CreateStudentDialog
        open={modal === "create"}
        onClose={close}
        onSaved={saved}
      />

      <UpdateStudentDialog
        open={modal === "update"}
        studentId={selectedId}
        initial={selectedInitial}
        onClose={close}
        onSaved={saved}
      />

      <ConfirmDialog
        open={modal === "delete"}
        title="Delete student?"
        message="This action cannot be undone."
        error={deleteError}
        onCancel={close}
        onConfirm={confirmDeleteStudent}
        loading={deleting}
      />

      <UploadMediaDialog
        open={modal === "upload"}
        entityType={mediaEntity.entityType}
        entityId={mediaEntity.entityId}
        onClose={close}
        onSaved={saved}
      />

      <ManageMediaDialog
        open={modal === "manage-media"}
        entityType={manageMediaEntity.entityType}
        entityId={manageMediaEntity.entityId}
        onClose={close}
      />

      <ManageProfileRecordsDialog
        open={modal === "manage-records"}
        ownerType="Student"
        ownerId={recordsOwnerId}
        ownerLabel={recordsOwnerLabel}
        onClose={close}
      />

      <ManageSocialLinksDialog
        open={modal === "manage-socials"}
        ownerType="Student"
        ownerId={socialOwnerId}
        ownerLabel={socialOwnerLabel}
        onClose={close}
      />
    </>
  );
}
