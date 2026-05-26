import GenericTab from "../tabs/GenericTab";
import { useLoadList } from "../hooks/useLoadList";
import { mapCourseDto } from "../mappers/mapper";
import { courseActions, courseColumns } from "../components/TabConfig";
import { CourseRow, MediaEntityType } from "../types/admin";
import { useMemo, useState } from "react";
import UpdateCourseDialog from "../components/courses/UpdateCourseDialog";
import CreateCourseDialog from "../components/courses/CreateCourseDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { api } from "../api/adminApi";
import ManageSectionsDialog from "../components/sections/ManageSectionsDialog";
import UploadMediaDialog from "../components/media/UploadMediaDialog";
import ManageMediaDialog from "../components/media/ManageMediaDialog";

export default function CoursesTabContainer() {
  const { rows, reload } = useLoadList<any, CourseRow>({
    url: "/api/courses/paged",
    query: { page: 1, pageSize: 50 },
    map: mapCourseDto,
  });

  const [modal, setModal] = useState<
    null | "create" | "update" | "delete" | "sections" | "upload" | "manage-media"
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

  const [selectedInitial, setSelectedInitial] = useState<any | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  const openUpdate = (row: CourseRow) => {
    setSelectedId(row.id);
    setSelectedInitial({
      courseName: row.courseName,
      shortDescription: row.shortDescription,
      priceGEL: row.priceGEL,
      priceUSD: row.priceUSD,
    });
    setModal("update");
  };

  const open = (m: typeof modal, id?: string) => {
    setSelectedId(id ?? null);
    if (m === "delete") setDeleteError(undefined);
    setModal(m);
  };
  const close = () => {
    setModal(null);
    setDeleteError(undefined);
  };
  const saved = () => {
    close();
    reload();
  };

  const actions = useMemo(
    () =>
      courseActions({
        onEdit: (r) => openUpdate(r),
        onUploadMedia: async (r) => {
          try {
            const res = await api.get(`/api/courses/${r.id}/admin`);
            const data = res?.data?.data ?? res?.data ?? {};
            const materialsId =
              data.courseMaterials?.id ??
              data.CourseMaterials?.Id ??
              data.courseMaterialsId ??
              data.CourseMaterialsId ??
              null;
            setMediaEntity({
              entityType: "CourseMaterials",
              entityId: materialsId,
            });
            setModal("upload");
          } catch {
            setMediaEntity({ entityType: null, entityId: null });
          }
        },
        onManageMedia: async (r) => {
          try {
            const res = await api.get(`/api/courses/${r.id}/admin`);
            const data = res?.data?.data ?? res?.data ?? {};
            const materialsId =
              data.courseMaterials?.id ??
              data.CourseMaterials?.Id ??
              data.courseMaterialsId ??
              data.CourseMaterialsId ??
              null;
            setManageMediaEntity({
              entityType: "CourseMaterials",
              entityId: materialsId,
            });
            setModal("manage-media");
          } catch {
            setManageMediaEntity({ entityType: null, entityId: null });
          }
        },
        onManageSections: (r) => open("sections", r.id),
        onDelete: (r) => open("delete", r.id),
      }),
    [reload]
  );

  async function confirmDeleteCourse() {
    if (!selectedId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/courses/${selectedId}`);
      saved();
      return;
    } catch (e: any) {
      setDeleteError(
        e?.response?.data?.message ?? e?.message ?? "Failed to delete."
      );
      setDeleting(false);
    }
  }

  return (
    <>
      <GenericTab
        title="Courses"
        columns={courseColumns}
        rows={rows}
        actions={actions}
        onAdd={() => open("create")}
        addLabel="Add course"
      />

      <CreateCourseDialog
        open={modal === "create"}
        onClose={close}
        onSaved={saved}
      />
      <UpdateCourseDialog
        open={modal === "update"}
        courseId={selectedId}
        initial={selectedInitial}
        onClose={close}
        onSaved={saved}
      />

      <ConfirmDialog
        open={modal === "delete"}
        title="Delete course?"
        message="This action cannot be undone."
        error={deleteError}
        onCancel={close}
        onConfirm={confirmDeleteCourse}
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

      {modal === "sections" && (
        <ManageSectionsDialog
          open={modal === "sections"}
          courseId={selectedId}
          onClose={close}
        />
      )}
    </>
  );
}
