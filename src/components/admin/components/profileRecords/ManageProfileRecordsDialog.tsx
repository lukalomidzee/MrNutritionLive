import {useMemo, useState, useCallback} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Stack, TextField, Typography} from "@mui/material";
import GenericTable from "../GenericTable";
import {ColumnDef, RowAction} from "../TableTypes";
import {useLoadList} from "../../hooks/useLoadList";
import {api} from "../../api/adminApi";
import ConfirmDialog from "../common/ConfirmDialog";
import {ProfileOwnerType, ProfileRecordKind} from "../../types/admin";
import ProfileRecordDialog from "./ProfileRecordDialog";
import UploadMediaDialog from "../media/UploadMediaDialog";
import ManageMediaDialog from "../media/ManageMediaDialog";
import {ProfileRecordFormModel} from "./ProfileRecordFormTypes";
import {Trash, Edit} from "lucide-react";

type ProfileRecordRow = {
    id: string;
    typeName: string;
    mediaPublicUrl?: string;
    startDate?: string;
    endDate?: string;
    title?: string;
    about?: string;
    certified?: boolean;
    certificationDate?: string;
    workDescription?: string;
    version: number;
};

const KIND_LABELS: Record<ProfileRecordKind, string> = {
    education: "Education",
    language: "Language",
    profession: "Profession",
    "work-experience": "Work Experience",
    district: "District",
};

export default function ManageProfileRecordsDialog({
                                                       open,
                                                       ownerType,
                                                       ownerId,
                                                       ownerLabel,
                                                       onClose,
                                                   }: Readonly<{
    open: boolean;
    ownerType: ProfileOwnerType;
    ownerId: string | null;
    ownerLabel?: string | null;
    onClose: () => void;
}>) {
    const [kind, setKind] = useState<ProfileRecordKind>("education");
    const enabled = open && !!ownerId;

    const query = useMemo(
        () =>
            enabled
                ? {
                      ownerType,
                      ownerId,
                  }
                : undefined,
        [enabled, ownerType, ownerId]
    );

    const mapRow = useCallback(
        (d: any): ProfileRecordRow => ({
            id: d.id ?? d.Id,
            typeName:
                d.educationTypeName ??
                d.languageTypeName ??
                d.professionTypeName ??
                d.workTypeName ??
                d.districtName ??
                d.EducationTypeName ??
                d.LanguageTypeName ??
                d.ProfessionTypeName ??
                d.WorkTypeName ??
                d.DistrictName ??
                "",
            startDate: d.startDate ?? d.StartDate ?? undefined,
            endDate: d.endDate ?? d.EndDate ?? undefined,
            title: d.title ?? d.Title ?? undefined,
            about: d.about ?? d.About ?? undefined,
            certified: d.certified ?? d.Certified ?? undefined,
            certificationDate:
                d.certificationDate ?? d.CertificationDate ?? undefined,
            workDescription:
                d.workDescription ?? d.WorkDescription ?? undefined,
            mediaPublicUrl:
                d.media?.publicUrl ??
                d.Media?.PublicUrl ??
                d.mediaPublicUrl ??
                d.MediaPublicUrl ??
                undefined,
            version: d.version ?? d.Version ?? 0,
        }),
        []
    );

    const {rows, reload} = useLoadList<any, ProfileRecordRow>({
        url: `/api/profile-records/${kind}`,
        query,
        enabled,
        map: mapRow,
    });

    const columns: ColumnDef<ProfileRecordRow>[] = useMemo(() => {
        const base: ColumnDef<ProfileRecordRow>[] = [
            {key: "n", header: "N", render: (_r, i) => i + 1},
            {key: "type", header: "Type", render: (r) => r.typeName},
        ];
        if (kind === "education") {
            base.push(
                {key: "title", header: "Title", render: (r) => r.title ?? "—"},
                {key: "about", header: "About", render: (r) => r.about ?? "—"},
                {
                    key: "media",
                    header: "Media",
                    render: (r) => r.mediaPublicUrl ?? "—",
                },
                {key: "start", header: "Start", render: (r) => r.startDate ?? "—"},
                {key: "end", header: "End", render: (r) => r.endDate ?? "—"}
            );
        } else if (kind === "profession") {
            base.push(
                {
                    key: "certified",
                    header: "Certified",
                    render: (r) => (r.certified ? "Yes" : "No"),
                },
                {
                    key: "certDate",
                    header: "Cert Date",
                    render: (r) => r.certificationDate ?? "—",
                }
            );
        } else if (kind === "work-experience") {
            base.push(
                {
                    key: "work",
                    header: "Work Description",
                    render: (r) => r.workDescription ?? "—",
                },
                {key: "start", header: "Start", render: (r) => r.startDate ?? "—"},
                {key: "end", header: "End", render: (r) => r.endDate ?? "—"}
            );
        }
        return base;
    }, [kind]);

    const [modal, setModal] = useState<
        null | "create" | "update" | "delete" | "upload-media" | "manage-media"
    >(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<ProfileRecordFormModel>({
        ownerType,
        ownerId: ownerId ?? "",
        typeId: "",
    });
    const [submitErr, setSubmitErr] = useState<string>();
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string>();
    const [mediaEntityId, setMediaEntityId] = useState<string | null>(null);
    const [manageMediaEntityId, setManageMediaEntityId] = useState<string | null>(
        null
    );

    const loadDetails = async (id: string) => {
        const res = await api.get(`/api/profile-records/${kind}/${id}`);
        const d = res?.data?.data ?? res?.data ?? {};
        return {
            id: d.id ?? d.Id,
            version: d.version ?? d.Version ?? 0,
            ownerType,
            ownerId: ownerId ?? "",
            typeId:
                d.educationTypeId ??
                d.languageTypeId ??
                d.professionTypeId ??
                d.workTypeId ??
                d.districtId ??
                d.EducationTypeId ??
                d.LanguageTypeId ??
                d.ProfessionTypeId ??
                d.WorkTypeId ??
                d.DistrictId ??
                "",
            startDate: d.startDate ?? d.StartDate ?? undefined,
            endDate: d.endDate ?? d.EndDate ?? undefined,
            title: d.title ?? d.Title ?? undefined,
            titleGeo: d.titleGeo ?? d.TitleGeo ?? undefined,
            about: d.about ?? d.About ?? undefined,
            aboutGeo: d.aboutGeo ?? d.AboutGeo ?? undefined,
            certified: d.certified ?? d.Certified ?? undefined,
            certificationDate:
                d.certificationDate ?? d.CertificationDate ?? undefined,
            workDescription: d.workDescription ?? d.WorkDescription ?? undefined,
        } as ProfileRecordFormModel;
    };

    const actions: RowAction<ProfileRecordRow>[] = useMemo(
        () => [
            {
                id: "edit",
                label: "Update details",
                icon: <Edit size={18} />,
                onClick: async (r) => {
                    setSelectedId(r.id);
                    const model = await loadDetails(r.id);
                    setSelectedModel(model);
                    setModal("update");
                },
            },
            ...(kind === "education"
                ? [
                      {
                          id: "upload-media",
                          label: "Upload media",
                          icon: <Edit size={18} />,
                          onClick: (r: ProfileRecordRow) => {
                              setMediaEntityId(r.id);
                              setModal("upload-media");
                          },
                      },
                      {
                          id: "manage-media",
                          label: "Manage media",
                          icon: <Edit size={18} />,
                          onClick: (r: ProfileRecordRow) => {
                              setManageMediaEntityId(r.id);
                              setModal("manage-media");
                          },
                      },
                  ]
                : []),
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
        [kind]
    );

    const openCreate = () => {
        setSelectedId(null);
        setSelectedModel({
            ownerType,
            ownerId: ownerId ?? "",
            typeId: "",
        });
        setModal("create");
    };

    const close = () => {
        setModal(null);
        setSubmitErr(undefined);
        setSaving(false);
        setDeleting(false);
        setDeleteError(undefined);
        setMediaEntityId(null);
        setManageMediaEntityId(null);
    };
    const saved = () => {
        close();
        reload();
    };

    const submitCreate = async (model: ProfileRecordFormModel) => {
        if (!ownerId) return;
        setSaving(true);
        setSubmitErr(undefined);
        try {
            const payload: any = {
                ownerType,
                ownerId,
            };
            if (kind === "education") {
                payload.educationTypeId = model.typeId;
                payload.startDate = model.startDate || undefined;
                payload.endDate = model.endDate || undefined;
                payload.title = model.title || undefined;
                payload.titleGeo = model.titleGeo || undefined;
                payload.about = model.about || undefined;
                payload.aboutGeo = model.aboutGeo || undefined;
            } else if (kind === "language") {
                payload.languageTypeId = model.typeId;
            } else if (kind === "profession") {
                payload.professionTypeId = model.typeId;
                payload.certified = !!model.certified;
                payload.certificationDate = model.certificationDate || undefined;
            } else if (kind === "work-experience") {
                payload.workTypeId = model.typeId;
                payload.startDate = model.startDate || undefined;
                payload.endDate = model.endDate || undefined;
                payload.workDescription = model.workDescription || undefined;
            } else if (kind === "district") {
                payload.districtId = model.typeId;
            }

            await api.post(`/api/profile-records/${kind}`, payload);
            saved();
        } catch (e: any) {
            setSubmitErr(e?.response?.data?.message ?? e?.message ?? "Failed.");
            setSaving(false);
        }
    };

    const submitUpdate = async (model: ProfileRecordFormModel) => {
        if (!model.id || !ownerId) return;
        setSaving(true);
        setSubmitErr(undefined);
        try {
            const payload: any = {
                id: model.id,
                version: model.version ?? 0,
                ownerType,
                ownerId,
            };
            if (kind === "education") {
                payload.educationTypeId = model.typeId;
                payload.startDate = model.startDate || undefined;
                payload.endDate = model.endDate || undefined;
                payload.title = model.title || undefined;
                payload.titleGeo = model.titleGeo || undefined;
                payload.about = model.about || undefined;
                payload.aboutGeo = model.aboutGeo || undefined;
            } else if (kind === "language") {
                payload.languageTypeId = model.typeId;
            } else if (kind === "profession") {
                payload.professionTypeId = model.typeId;
                payload.certified = !!model.certified;
                payload.certificationDate = model.certificationDate || undefined;
            } else if (kind === "work-experience") {
                payload.workTypeId = model.typeId;
                payload.startDate = model.startDate || undefined;
                payload.endDate = model.endDate || undefined;
                payload.workDescription = model.workDescription || undefined;
            } else if (kind === "district") {
                payload.districtId = model.typeId;
            }

            await api.put(`/api/profile-records/${kind}`, payload);
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
            await api.delete(`/api/profile-records/${kind}/${selectedId}`);
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
            <DialogTitle>Manage records</DialogTitle>
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
                    <Stack direction="row" spacing={2}>
                        <TextField
                            select
                            label="Kind"
                            value={kind}
                            onChange={(e) =>
                                setKind(e.target.value as ProfileRecordKind)
                            }
                            size="small"
                        >
                            {Object.keys(KIND_LABELS).map((k) => (
                                <MenuItem key={k} value={k}>
                                    {KIND_LABELS[k as ProfileRecordKind]}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Button variant="contained" onClick={openCreate}>
                            Add record
                        </Button>
                    </Stack>
                </Stack>

                <GenericTable columns={columns} rows={rows} actions={actions}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>

            <ProfileRecordDialog
                open={modal === "create"}
                kind={kind}
                title={`Add ${KIND_LABELS[kind]}`}
                initial={selectedModel}
                onClose={close}
                onSubmit={submitCreate}
                submitLabel="Create"
                loading={saving}
                error={submitErr}
                hideOwnerFields
                hideSortOrder
            />

            <ProfileRecordDialog
                open={modal === "update"}
                kind={kind}
                title={`Update ${KIND_LABELS[kind]}`}
                initial={selectedModel}
                onClose={close}
                onSubmit={submitUpdate}
                submitLabel="Update"
                loading={saving}
                error={submitErr}
                hideOwnerFields
                hideSortOrder
            />

            <ConfirmDialog
                open={modal === "delete"}
                title="Delete record?"
                message="This action cannot be undone."
                error={deleteError}
                onCancel={close}
                onConfirm={confirmDelete}
                loading={deleting}
            />

            <UploadMediaDialog
                open={modal === "upload-media"}
                entityType="EducationRecord"
                entityId={mediaEntityId}
                onClose={close}
                onSaved={saved}
            />

            <ManageMediaDialog
                open={modal === "manage-media"}
                entityType="EducationRecord"
                entityId={manageMediaEntityId}
                onClose={close}
            />
        </Dialog>
    );
}
