import { useMemo, useState, useEffect } from "react";
import GenericTab from "../tabs/GenericTab";
import { useLoadList } from "../hooks/useLoadList";
import { mapAuthorDto } from "../mappers/mapper";
import { authorColumns, authorActions } from "../components/TabConfig";
import { AuthorRow, MediaEntityType } from "../types/admin";
import CreateAuthorDialog from "../components/authors/CreateAuthorDialog";
import UpdateAuthorDialog from "../components/authors/UpdateAuthorDialog";
import { api } from "../api/adminApi";
import ConfirmDialog from "../components/common/ConfirmDialog";
import UploadMediaDialog from "../components/media/UploadMediaDialog";
import ManageMediaDialog from "../components/media/ManageMediaDialog";
import ManageProfileRecordsDialog from "../components/profileRecords/ManageProfileRecordsDialog";
import ManageSocialLinksDialog from "../components/socialLinks/ManageSocialLinksDialog";

export default function AuthorsTabContainer() {
  const { rows, reload } = useLoadList<any, AuthorRow>({
    url: "/api/authors/paged",
    query: { page: 1, pageSize: 50 },
    map: mapAuthorDto,
  });

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
  const [selectedInitial, setSelectedInitial] = useState<Partial<any> | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
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
  const [deleteError, setDeleteError] = useState<string>();

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

  const openUpdate = (row: AuthorRow) => {
    setSelectedId(row.id);
    setSelectedInitial({
      version: row.version,
      firstName: row.firstName,
      lastName: row.lastName,
      title: row.title,
      description: row.description,
      shortDescription: row.shortDescription,
    });
    setModal("update");
  };

  const actions = useMemo(
    () =>
      authorActions({
        onEdit: (r) => openUpdate(r),
        onUploadCover: (r) => {
          setMediaEntity({ entityType: "Author", entityId: r.id });
          open("upload", r.id);
        },
        onManageMedia: (r) => {
          setManageMediaEntity({ entityType: "Author", entityId: r.id });
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
    [reload],
  );

  async function confirmDeleteAuthor() {
    if (!selectedId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/authors/${selectedId}`);
      saved();
    } catch (e) {
      const message =
        (e as any)?.response?.data?.message ??
        (e as any)?.message ??
        "Failed to delete.";
      setDeleteError(message);
      setDeleting(false);
    }
  }

  return (
    <>
      <GenericTab<AuthorRow>
        title="Authors"
        columns={authorColumns}
        rows={rows}
        actions={actions}
        onAdd={() => open("create")}
        addLabel="Add author"
      />

      <CreateAuthorDialog
        open={modal === "create"}
        onClose={close}
        onSaved={saved}
      />

      <UpdateAuthorDialog
        open={modal === "update"}
        authorId={selectedId}
        initial={selectedInitial ?? undefined}
        onClose={close}
        onSaved={saved}
      />

      <ConfirmDialog
        open={modal === "delete"}
        title="Delete author?"
        message="This action cannot be undone."
        error={deleteError}
        onCancel={close}
        onConfirm={confirmDeleteAuthor}
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
        ownerType="Author"
        ownerId={recordsOwnerId}
        ownerLabel={recordsOwnerLabel}
        onClose={close}
      />

      <ManageSocialLinksDialog
        open={modal === "manage-socials"}
        ownerType="Author"
        ownerId={socialOwnerId}
        ownerLabel={socialOwnerLabel}
        onClose={close}
      />
    </>
  );
}
