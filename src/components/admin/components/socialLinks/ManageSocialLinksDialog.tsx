import {useMemo, useState, useCallback} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, Stack, Typography} from "@mui/material";
import GenericTable from "../GenericTable";
import {ColumnDef, RowAction} from "../TableTypes";
import {useLoadList} from "../../hooks/useLoadList";
import {api} from "../../api/adminApi";
import ConfirmDialog from "../common/ConfirmDialog";
import SocialLinkDialog, {SocialLinkFormModel} from "./SocialLinkDialog";
import {SocialLinkOwnerType} from "../../types/admin";
import {Edit, Trash} from "lucide-react";

type SocialLinkRow = {
    id: string;
    linkTypeName: string;
    linkUrl: string;
    title?: string;
    sortOrder?: number;
    version: number;
};

export default function ManageSocialLinksDialog({
                                                    open,
                                                    ownerType,
                                                    ownerId,
                                                    ownerLabel,
                                                    onClose,
                                                }: Readonly<{
    open: boolean;
    ownerType: SocialLinkOwnerType;
    ownerId: string | null;
    ownerLabel?: string | null;
    onClose: () => void;
}>) {
    const enabled = open && !!ownerId;
    const query = useMemo(
        () => (enabled ? {ownerType, ownerId} : undefined),
        [enabled, ownerType, ownerId]
    );

    const mapRow = useCallback(
        (d: any): SocialLinkRow => ({
            id: d.id ?? d.Id,
            linkTypeName: d.linkTypeName ?? d.LinkTypeName ?? "",
            linkUrl: d.linkUrl ?? d.LinkUrl ?? "",
            title: d.title ?? d.Title ?? undefined,
            sortOrder: d.sortOrder ?? d.SortOrder ?? undefined,
            version: d.version ?? d.Version ?? 0,
        }),
        []
    );

    const {rows, reload} = useLoadList<any, SocialLinkRow>({
        url: "/api/social-links",
        query,
        enabled,
        map: mapRow,
    });

    const columns: ColumnDef<SocialLinkRow>[] = [
        {key: "n", header: "N", render: (_r, i) => i + 1},
        {key: "type", header: "Link Type", render: (r) => r.linkTypeName},
        {key: "url", header: "Link URL", render: (r) => r.linkUrl},
        {key: "title", header: "Title", render: (r) => r.title ?? "—"},
        {key: "sort", header: "Sort Order", render: (r) => r.sortOrder ?? "—"},
    ];

    const [modal, setModal] = useState<null | "create" | "update" | "delete">(
        null
    );
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<SocialLinkFormModel>({
        ownerType,
        ownerId: ownerId ?? "",
        linkTypeId: "",
        linkUrl: "",
    });
    const [submitErr, setSubmitErr] = useState<string>();
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string>();

    const actions: RowAction<SocialLinkRow>[] = useMemo(
        () => [
            {
                id: "edit",
                label: "Update details",
                icon: <Edit size={18} />,
                onClick: async (r) => {
                    setSelectedId(r.id);
                    const res = await api.get(`/api/social-links/${r.id}`);
                    const d = res?.data?.data ?? res?.data ?? {};
                    setSelectedModel({
                        id: d.id ?? d.Id,
                        version: d.version ?? d.Version ?? 0,
                        ownerType,
                        ownerId: ownerId ?? "",
                        linkTypeId: d.linkTypeId ?? d.LinkTypeId ?? "",
                        linkUrl: d.linkUrl ?? d.LinkUrl ?? "",
                        title: d.title ?? d.Title ?? "",
                        titleGeo: d.titleGeo ?? d.TitleGeo ?? "",
                        sortOrder: d.sortOrder ?? d.SortOrder ?? "",
                    });
                    setModal("update");
                },
            },
            {
                id: "delete",
                label: "Delete",
                icon: <Trash size={18} />,
                onClick: (r) => {
                    setSelectedId(r.id);
                    setModal("delete");
                },
            },
        ],
        [ownerType, ownerId]
    );

    const openCreate = () => {
        setSelectedId(null);
        setSelectedModel({
            ownerType,
            ownerId: ownerId ?? "",
            linkTypeId: "",
            linkUrl: "",
        });
        setModal("create");
    };

    const close = () => {
        setModal(null);
        setSubmitErr(undefined);
        setSaving(false);
        setDeleting(false);
        setDeleteError(undefined);
    };
    const saved = () => {
        close();
        reload();
    };

    const submitCreate = async (model: SocialLinkFormModel) => {
        if (!ownerId) return;
        setSaving(true);
        setSubmitErr(undefined);
        try {
            await api.post("/api/social-links", {
                ownerType,
                ownerId,
                linkTypeId: model.linkTypeId,
                linkUrl: model.linkUrl,
                title: model.title || undefined,
                titleGeo: model.titleGeo || undefined,
                sortOrder: model.sortOrder === "" ? undefined : model.sortOrder,
            });
            saved();
        } catch (e: any) {
            setSubmitErr(e?.response?.data?.message ?? e?.message ?? "Failed.");
            setSaving(false);
        }
    };

    const submitUpdate = async (model: SocialLinkFormModel) => {
        if (!model.id || !ownerId) return;
        setSaving(true);
        setSubmitErr(undefined);
        try {
            await api.put("/api/social-links", {
                id: model.id,
                version: model.version ?? 0,
                ownerType,
                ownerId,
                linkTypeId: model.linkTypeId,
                linkUrl: model.linkUrl,
                title: model.title || undefined,
                titleGeo: model.titleGeo || undefined,
                sortOrder: model.sortOrder === "" ? undefined : model.sortOrder,
            });
            saved();
        } catch (e: any) {
            setSubmitErr(e?.response?.data?.message ?? e?.message ?? "Failed.");
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!selectedId) return;
        setDeleting(true);
        try {
            await api.delete(`/api/social-links/${selectedId}`);
            saved();
        } catch (e: any) {
            setDeleteError(
                e?.response?.data?.message ?? e?.message ?? "Failed to delete."
            );
            setDeleting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>Manage social links</DialogTitle>
            <DialogContent dividers>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                    flexWrap="wrap"
                    mb={2}
                >
                    <Typography variant="subtitle2">
                        Owner: {ownerLabel ?? `${ownerType} ${ownerId ?? ""}`}
                    </Typography>
                    <Button variant="contained" onClick={openCreate}>
                        Add link
                    </Button>
                </Stack>

                <GenericTable columns={columns} rows={rows} actions={actions}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>

            <SocialLinkDialog
                open={modal === "create"}
                title="Add social link"
                initial={selectedModel}
                onClose={close}
                onSubmit={submitCreate}
                submitLabel="Create"
                loading={saving}
                error={submitErr}
                hideOwnerFields
            />

            <SocialLinkDialog
                open={modal === "update"}
                title="Update social link"
                initial={selectedModel}
                onClose={close}
                onSubmit={submitUpdate}
                submitLabel="Update"
                loading={saving}
                error={submitErr}
                hideOwnerFields
            />

            <ConfirmDialog
                open={modal === "delete"}
                title="Delete social link?"
                message="This action cannot be undone."
                error={deleteError}
                onCancel={close}
                onConfirm={confirmDelete}
                loading={deleting}
            />
        </Dialog>
    );
}
