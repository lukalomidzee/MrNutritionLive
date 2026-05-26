import {useMemo, useState, useCallback} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Button} from "@mui/material";
import GenericTable from "../GenericTable";
import {ColumnDef, RowAction} from "../TableTypes";
import {useLoadList} from "../../hooks/useLoadList";
import {api} from "../../api/adminApi";
import ConfirmDialog from "../common/ConfirmDialog";
import {MediaEntityType} from "../../types/admin";
import {Trash} from "lucide-react";

type MediaRow = {
    id: string;
    mediaRoleTypeName?: string;
    mimeType?: string;
    mediaKind?: string;
    publicUrl?: string;
    storageProvider?: string;
    createdAt?: string;
    sortOrder?: number;
};

export default function ManageMediaDialog({
                                             open,
                                             entityType,
                                             entityId,
                                             onClose,
                                         }: Readonly<{
    open: boolean;
    entityType: MediaEntityType | null;
    entityId: string | null;
    onClose: () => void;
}>) {
    const enabled = open && !!entityType && !!entityId;
    const query = useMemo(
        () => (enabled ? {entityType, entityId, includeAll: true} : undefined),
        [enabled, entityType, entityId]
    );

    const mapRow = useCallback(
        (d: any): MediaRow => ({
            id: d.mediaAssetId ?? d.MediaAssetId ?? d.id ?? d.Id,
            mediaRoleTypeName: d.mediaRoleTypeName ?? d.MediaRoleTypeName ?? "",
            mimeType: d.mimeType ?? d.MimeType ?? "",
            mediaKind: d.mediaKind ?? d.MediaKind ?? "",
            publicUrl: d.publicUrl ?? d.PublicUrl ?? "",
            storageProvider: d.storageProvider ?? d.StorageProvider ?? "",
            createdAt: d.createdAt ?? d.CreatedAt ?? "",
            sortOrder: d.sortOrder ?? d.SortOrder ?? undefined,
        }),
        []
    );

    const {rows, reload} = useLoadList<any, MediaRow>({
        url: "/api/media",
        query,
        enabled,
        map: mapRow,
    });

    const columns: ColumnDef<MediaRow>[] = useMemo(
        () => [
            {key: "n", header: "N", render: (_r, i) => i + 1},
            {key: "role", header: "Role", render: (r) => r.mediaRoleTypeName ?? "—"},
            {key: "kind", header: "Kind", render: (r) => r.mediaKind ?? "—"},
            {key: "mime", header: "Mime", render: (r) => r.mimeType ?? "—"},
            {
                key: "url",
                header: "URL",
                render: (r) => r.publicUrl ?? "—",
            },
            {
                key: "sort",
                header: "Sort",
                render: (r) => (r.sortOrder !== undefined ? r.sortOrder : "—"),
            },
            {
                key: "created",
                header: "Created",
                render: (r) =>
                    r.createdAt ? r.createdAt.slice(0, 19).replace("T", " ") : "—",
            },
        ],
        [],
    );

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string>();

    const actions: RowAction<MediaRow>[] = useMemo(
        () => [
            {
                id: "delete",
                label: "Delete",
                icon: <Trash size={18} />,
                onClick: (r) => setDeleteId(r.id),
            },
        ],
        [],
    );

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        setDeleteError(undefined);
        try {
            await api.delete(`/api/media/${deleteId}`);
            setDeleteId(null);
            reload();
        } catch (e: any) {
            setDeleteError(
                e?.response?.data?.message ?? e?.message ?? "Failed to delete."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>Manage media</DialogTitle>
            <DialogContent dividers>
                <GenericTable columns={columns} rows={rows} actions={actions}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>

            <ConfirmDialog
                open={!!deleteId}
                title="Delete media?"
                message="This action cannot be undone."
                error={deleteError}
                onCancel={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                loading={deleting}
            />
        </Dialog>
    );
}
