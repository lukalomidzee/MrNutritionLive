import {useMemo, useState} from "react";
import GenericTab from "../tabs/GenericTab";
import {useLoadList} from "../hooks/useLoadList";
import {mapSiteDetailDto} from "../mappers/mapper";
import {siteDetailActions, siteDetailColumns} from "../components/TabConfig";
import {SiteDetailRow, MediaEntityType} from "../types/admin";
import CreateSiteDetailDialog from "../components/siteDetails/CreateSiteDetailDialog";
import UpdateSiteDetailDialog from "../components/siteDetails/UpdateSiteDetailDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import {api} from "../api/adminApi";
import UploadMediaDialog from "../components/media/UploadMediaDialog";
import ManageMediaDialog from "../components/media/ManageMediaDialog";

export default function SiteDetailsTabContainer() {
    const {rows, reload} = useLoadList<any, SiteDetailRow>({
        url: "/api/sitedetails",
        map: mapSiteDetailDto,
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

    const openUpdate = (row: SiteDetailRow) => {
        setSelectedId(row.id);
        setSelectedInitial({
            title: row.title,
            titleGeo: row.titleGeo,
            subtitle: row.subtitle,
            subtitleGeo: row.subtitleGeo,
            titleColor: row.titleColor,
            subtitleColor: row.subtitleColor,
        });
        setModal("update");
    };

    const actions = useMemo(
        () =>
            siteDetailActions({
                onEdit: (r) => openUpdate(r),
                onUploadMedia: (r) => {
                    setMediaEntity({entityType: "SiteDetail", entityId: r.id});
                    open("upload", r.id);
                },
                onManageMedia: (r) => {
                    setManageMediaEntity({entityType: "SiteDetail", entityId: r.id});
                    open("manage-media", r.id);
                },
                onDelete: (r) => open("delete", r.id),
            }),
        [reload]
    );

    async function confirmDeleteSiteDetail() {
        if (!selectedId) return;
        setDeleting(true);
        try {
            await api.delete(`/api/sitedetails/${selectedId}`);
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
            <GenericTab<SiteDetailRow>
                title="Site Details"
                columns={siteDetailColumns}
                rows={rows}
                actions={actions}
                onAdd={() => open("create")}
                addLabel="Add site detail"
            />

            <CreateSiteDetailDialog
                open={modal === "create"}
                onClose={close}
                onSaved={saved}
            />

            <UpdateSiteDetailDialog
                open={modal === "update"}
                siteDetailId={selectedId}
                initial={selectedInitial ?? undefined}
                onClose={close}
                onSaved={saved}
            />

            <ConfirmDialog
                open={modal === "delete"}
                title="Delete site detail?"
                message="This action cannot be undone."
                error={deleteError}
                onCancel={close}
                onConfirm={confirmDeleteSiteDetail}
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
