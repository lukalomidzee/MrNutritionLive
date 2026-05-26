import {useMemo, useState} from "react";
import GenericTab from "../tabs/GenericTab";
import {useLoadList} from "../hooks/useLoadList";
import {mapEnrollmentDto} from "../mappers/mapper";
import {enrollmentActions, enrollmentColumns} from "../components/TabConfig";
import {EnrollmentRow, MediaEntityType} from "../types/admin";
import CreateEnrollmentDialog from "../components/enrollments/CreateEnrollmentDialog";
import UpdateEnrollmentDialog from "../components/enrollments/UpdateEnrollmentDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import {api} from "../api/adminApi";
import UploadMediaDialog from "../components/media/UploadMediaDialog";
import ManageMediaDialog from "../components/media/ManageMediaDialog";

export default function EnrollmentsTabContainer() {
    const {rows, reload} = useLoadList<any, EnrollmentRow>({
        url: "/api/enrollments",
        map: mapEnrollmentDto,
    });

    const [modal, setModal] = useState<null | "create" | "update" | "delete" | "upload" | "manage-media">(
        null
    );
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedInitial, setSelectedInitial] = useState<Partial<any> | null>(
        null
    );
    const [deleting, setDeleting] = useState(false);
    const [mediaEntity, setMediaEntity] = useState<{
        entityType: MediaEntityType | null;
        entityId: string | null;
    }>({entityType: null, entityId: null});
    const [manageMediaEntity, setManageMediaEntity] = useState<{
        entityType: MediaEntityType | null;
        entityId: string | null;
    }>({entityType: null, entityId: null});
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

    const openUpdate = (row: EnrollmentRow) => {
        setSelectedId(row.id);
        setSelectedInitial({
            certificationDate: row.certificationDate,
            validityPeriodInDays: row.validityPeriodInDays,
            certificateUniqueKey: row.certificateUniqueKey,
        });
        setModal("update");
    };

    const actions = useMemo(
        () =>
            enrollmentActions({
                onEdit: (r) => openUpdate(r),
                onUploadMedia: (r) => {
                    setMediaEntity({entityType: "Enrollment", entityId: r.id});
                    open("upload", r.id);
                },
                onManageMedia: (r) => {
                    setManageMediaEntity({entityType: "Enrollment", entityId: r.id});
                    open("manage-media", r.id);
                },
                onDelete: (r) => open("delete", r.id),
            }),
        [reload]
    );

    async function confirmDeleteEnrollment() {
        if (!selectedId) return;
        setDeleting(true);
        try {
            await api.delete(`/api/enrollments/${selectedId}`);
            saved();
        } catch (e: any) {
            setDeleteError(
                e?.response?.data?.message ?? e?.message ?? "Failed to delete."
            );
            setDeleting(false);
        }
    }

    return (
        <>
            <GenericTab<EnrollmentRow>
                title="Enrollments"
                columns={enrollmentColumns}
                rows={rows}
                actions={actions}
                onAdd={() => open("create")}
                addLabel="Add enrollment"
            />

            <CreateEnrollmentDialog
                open={modal === "create"}
                onClose={close}
                onSaved={saved}
            />

            <UpdateEnrollmentDialog
                open={modal === "update"}
                enrollmentId={selectedId}
                initial={selectedInitial ?? undefined}
                onClose={close}
                onSaved={saved}
            />

            <ConfirmDialog
                open={modal === "delete"}
                title="Delete enrollment?"
                message="This action cannot be undone."
                error={deleteError}
                onCancel={close}
                onConfirm={confirmDeleteEnrollment}
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
        </>
    );
}
