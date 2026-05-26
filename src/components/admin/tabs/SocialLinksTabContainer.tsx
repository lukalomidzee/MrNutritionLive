import {useCallback, useMemo, useState} from "react";
import {Box, Button, MenuItem, Stack, TextField, Typography} from "@mui/material";
import GenericTable from "../components/GenericTable";
import {ColumnDef, RowAction} from "../components/TableTypes";
import {useLoadList} from "../hooks/useLoadList";
import {api} from "../api/adminApi";
import {SocialLinkOwnerType} from "../types/admin";
import SocialLinkDialog, {
    SocialLinkFormModel,
} from "../components/socialLinks/SocialLinkDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";

type SocialLinkRow = {
    id: string;
    ownerType: string;
    ownerId: string;
    linkTypeName: string;
    linkUrl: string;
    title?: string;
    sortOrder?: number;
    version: number;
};

export default function SocialLinksTabContainer() {
    const [ownerType, setOwnerType] = useState<SocialLinkOwnerType | "">("");
    const [ownerId, setOwnerId] = useState<string>("");

    const query = useMemo(
        () => ({
            ownerType: ownerType || undefined,
            ownerId: ownerId || undefined,
        }),
        [ownerType, ownerId]
    );

    const mapRow = useCallback(
        (d: any): SocialLinkRow => ({
            id: d.id ?? d.Id,
            ownerType: d.ownerType ?? d.OwnerType ?? "",
            ownerId: d.ownerId ?? d.OwnerId ?? "",
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
        map: mapRow,
    });

    const columns: ColumnDef<SocialLinkRow>[] = [
        {key: "n", header: "N", render: (_r, i) => i + 1},
        {key: "ownerType", header: "Owner Type", render: (r) => r.ownerType},
        {key: "ownerId", header: "Owner ID", render: (r) => r.ownerId},
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
        ownerType: "Author",
        ownerId: "",
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
                onClick: async (r) => {
                    setSelectedId(r.id);
                    const res = await api.get(`/api/social-links/${r.id}`);
                    const d = res?.data?.data ?? res?.data ?? {};
                    setSelectedModel({
                        id: d.id ?? d.Id,
                        version: d.version ?? d.Version ?? 0,
                        ownerType: d.ownerType ?? d.OwnerType ?? "Author",
                        ownerId: d.ownerId ?? d.OwnerId ?? "",
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
                onClick: (r) => {
                    setSelectedId(r.id);
                    setModal("delete");
                },
            },
        ],
        []
    );

    const openCreate = () => {
        setSelectedId(null);
        setSelectedModel({
            ownerType: "Author",
            ownerId: "",
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
        setSaving(true);
        setSubmitErr(undefined);
        try {
            await api.post("/api/social-links", {
                ownerType: model.ownerType,
                ownerId: model.ownerId,
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
        if (!model.id) return;
        setSaving(true);
        setSubmitErr(undefined);
        try {
            await api.put("/api/social-links", {
                id: model.id,
                version: model.version ?? 0,
                ownerType: model.ownerType,
                ownerId: model.ownerId,
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
        <Box sx={{width: "100%", display: "flex", flexDirection: "column", gap: 3}}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                flexWrap="wrap"
            >
                <Typography variant="h5" fontWeight={700}>
                    Social Links
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                    <TextField
                        select
                        label="Owner Type"
                        value={ownerType}
                        onChange={(e) =>
                            setOwnerType(e.target.value as SocialLinkOwnerType | "")
                        }
                        size="small"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Author">Author</MenuItem>
                        <MenuItem value="Student">Student</MenuItem>
                        <MenuItem value="Issuer">Issuer</MenuItem>
                        <MenuItem value="SiteDetail">SiteDetail</MenuItem>
                    </TextField>
                    <TextField
                        label="Owner ID"
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        size="small"
                    />
                </Stack>
                <Button variant="contained" onClick={openCreate}>
                    Add link
                </Button>
            </Stack>

            <GenericTable columns={columns} rows={rows} actions={actions} />

            <SocialLinkDialog
                open={modal === "create"}
                title="Add social link"
                initial={selectedModel}
                onClose={close}
                onSubmit={submitCreate}
                submitLabel="Create"
                loading={saving}
                error={submitErr}
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
        </Box>
    );
}
