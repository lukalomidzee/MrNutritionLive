import {useEffect, useMemo, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography,} from "@mui/material";
import GenericTable from "../../components/GenericTable";
import {ColumnDef, RowAction} from "../../components/TableTypes";
import {SectionRow, MediaEntityType} from "../../types/admin";
import {useLoadList} from "../../hooks/useLoadList";
import {mapSectionDto} from "../../mappers/mapper";
import {Edit, ImageUp, Trash} from "lucide-react";
import ConfirmDialog from "../common/ConfirmDialog";
import {api} from "../../api/adminApi";
import CreateSectionDialog from "./CreateSectionsDialog";
import UpdateSectionDialog from "./UpdateSectionsDialog";
import UploadMediaDialog from "../media/UploadMediaDialog";
import ManageMediaDialog from "../media/ManageMediaDialog";

export default function ManageSectionsDialog({
                                                 open,
                                                 courseId,
                                                 onClose,
                                             }: Readonly<{
    open: boolean;
    courseId: string | null;
    onClose: () => void;
}>) {
    const enabled = open && !!courseId;
    const listUrl = enabled ? `/api/courses/${courseId}/sections` : undefined;

    const {rows, reload} = useLoadList<any, SectionRow>({
        url: listUrl,
        map: mapSectionDto,
        enabled,
    });

    const [modal, setModal] = useState<
        null | "create" | "update" | "delete" | "upload" | "manage-media"
    >(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
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

    const openM = (m: typeof modal, id?: string) => {
        setModal(m);
        setSelectedId(id ?? null);
        if (m === "delete") setDeleteError(undefined);
    };
    const closeM = () => {
        setModal(null);
        setSelectedId(null);
        setDeleting(false);
        setDeleteError(undefined);
    };
    const saved = () => {
        closeM();
        reload();
    };

    useEffect(() => {
        if (modal !== "delete") setDeleting(false);
    }, [modal]);

    const columns: ColumnDef<SectionRow>[] = useMemo(
        () => [
            {key: "n", header: "N", render: (_r, i) => i + 1},
            {key: "order", header: "Order", render: (r, _i) => r.order ?? "—"},
            {key: "heading", header: "Heading", render: (r, _i) => r.heading},
            {
                key: "headingGeo",
                header: "Heading (Geo)",
                render: (r, _i) => r.headingGeo ?? "—",
            },
            {
                key: "paragraph",
                header: "Paragraph",
                render: (r, _i) => (
                    <span
                        style={{
                            display: "inline-block",
                            maxWidth: 380,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
            {r.paragraph ?? "—"}
          </span>
                ),
            },
            {
                key: "cover",
                header: "Cover",
                render: (r, _i) =>
                    r.coverUrl ? (
                        <img
                            src={r.coverUrl}
                            alt="cover"
                            style={{
                                height: 40,
                                width: 60,
                                objectFit: "cover",
                                borderRadius: 4,
                            }}
                        />
                    ) : (
                        "—"
                    ),
            },
        ],
        []
    );

    const actions: RowAction<SectionRow>[] = useMemo(
        () => [
            {
                id: "edit",
                label: "Edit",
                icon: <Edit size={18}/>,
                onClick: (r) => openM("update", r.id),
            },
            {
                id: "upload-media",
                label: "Upload media",
                icon: <ImageUp size={18}/>,
                onClick: (r) => {
                    setMediaEntity({entityType: "Section", entityId: r.id});
                    openM("upload", r.id);
                },
            },
            {
                id: "manage-media",
                label: "Manage media",
                icon: <ImageUp size={18}/>,
                onClick: (r) => {
                    setManageMediaEntity({entityType: "Section", entityId: r.id});
                    openM("manage-media", r.id);
                },
            },
            {
                id: "delete",
                label: "Delete",
                icon: <Trash size={18}/>,
                onClick: (r) => openM("delete", r.id),
            },
        ],
        []
    );

    async function confirmDelete() {
        if (!selectedId || !courseId) return;
        setDeleting(true);
        try {
            await api.delete(`/api/courses/${courseId}/sections/${selectedId}`);
            saved();
        } catch (e: any) {
            setDeleteError(
                e?.response?.data?.message ?? e?.message ?? "Failed to delete."
            );
            setDeleting(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>Manage sections</DialogTitle>
            <DialogContent dividers>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography variant="subtitle2">
                        Course ID: {courseId ?? "—"}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => openM("create")}
                        size="small"
                    >
                        Add section
                    </Button>
                </Stack>

                <GenericTable<SectionRow>
                    columns={columns}
                    rows={rows}
                    actions={actions}
                    maxHeight="50vh"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>

            {/* child modals */}
            <CreateSectionDialog
                open={modal === "create"}
                courseId={courseId}
                onClose={closeM}
                onSaved={saved}
            />
            <UpdateSectionDialog
                open={modal === "update"}
                courseId={courseId}
                sectionId={selectedId}
                onClose={closeM}
                onSaved={saved}
            />
            <ConfirmDialog
                open={modal === "delete"}
                title="Delete section?"
                message="This action cannot be undone."
                error={deleteError}
                onCancel={closeM}
                onConfirm={confirmDelete}
                loading={deleting}
            />
            <UploadMediaDialog
                open={modal === "upload"}
                entityType={mediaEntity.entityType}
                entityId={mediaEntity.entityId}
                onClose={closeM}
                onSaved={saved}
            />
            <ManageMediaDialog
                open={modal === "manage-media"}
                entityType={manageMediaEntity.entityType}
                entityId={manageMediaEntity.entityId}
                onClose={closeM}
            />
        </Dialog>
    );
}
