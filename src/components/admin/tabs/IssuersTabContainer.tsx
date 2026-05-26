import {useMemo, useState} from "react";
import GenericTab from "../tabs/GenericTab";
import {useLoadList} from "../hooks/useLoadList";
import {mapIssuerDto} from "../mappers/mapper";
import {issuerColumns, issuerActions} from "../components/TabConfig";
import {IssuerRow, MediaEntityType} from "../types/admin";
import CreateIssuerDialog from "../components/issuers/CreateIssuerDialog";
import UpdateIssuerDialog from "../components/issuers/UpdateIssuerDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import {api} from "../api/adminApi";
import UploadMediaDialog from "../components/media/UploadMediaDialog";
import ManageMediaDialog from "../components/media/ManageMediaDialog";
import ManageSocialLinksDialog from "../components/socialLinks/ManageSocialLinksDialog";

export default function IssuersTabContainer() {
    const {rows, reload} = useLoadList<any, IssuerRow>({
        url: "/api/issuers",
        map: mapIssuerDto,
    });

    const [modal, setModal] = useState<null | "create" | "update" | "delete" | "upload" | "manage-media" | "manage-socials">(
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

    const openUpdate = (row: IssuerRow) => {
        setSelectedId(row.id);
        setSelectedInitial({
            issuerName: row.issuerName,
            issuerNameGeo: row.issuerNameGeo,
            issuerDescription: row.issuerDescription,
            issuerDescriptionGeo: row.issuerDescriptionGeo,
            establishedDate: row.establishedDate,
        });
        setModal("update");
    };

    const actions = useMemo(
        () =>
            issuerActions({
                onEdit: (r) => openUpdate(r),
                onUploadMedia: (r) => {
                    setMediaEntity({entityType: "Issuer", entityId: r.id});
                    open("upload", r.id);
                },
                onManageMedia: (r) => {
                    setManageMediaEntity({entityType: "Issuer", entityId: r.id});
                    open("manage-media", r.id);
                },
                onManageSocials: (r) => {
                    setSocialOwnerId(r.id);
                    setSocialOwnerLabel(r.issuerName);
                    open("manage-socials", r.id);
                },
                onDelete: (r) => open("delete", r.id),
            }),
        [reload]
    );

    async function confirmDeleteIssuer() {
        if (!selectedId) return;
        setDeleting(true);
        try {
            await api.delete(`/api/issuers/${selectedId}`);
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
            <GenericTab<IssuerRow>
                title="Issuers"
                columns={issuerColumns}
                rows={rows}
                actions={actions}
                onAdd={() => open("create")}
                addLabel="Add issuer"
            />

            <CreateIssuerDialog
                open={modal === "create"}
                onClose={close}
                onSaved={saved}
            />

            <UpdateIssuerDialog
                open={modal === "update"}
                issuerId={selectedId}
                initial={selectedInitial ?? undefined}
                onClose={close}
                onSaved={saved}
            />

            <ConfirmDialog
                open={modal === "delete"}
                title="Delete issuer?"
                message="This action cannot be undone."
                error={deleteError}
                onCancel={close}
                onConfirm={confirmDeleteIssuer}
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

            <ManageSocialLinksDialog
                open={modal === "manage-socials"}
                ownerType="Issuer"
                ownerId={socialOwnerId}
                ownerLabel={socialOwnerLabel}
                onClose={close}
            />
        </>
    );
}
