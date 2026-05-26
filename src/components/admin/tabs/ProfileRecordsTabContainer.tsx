import {useCallback, useMemo, useState} from "react";
import {Box, Button, MenuItem, Stack, TextField, Typography} from "@mui/material";
import GenericTable from "../components/GenericTable";
import {ColumnDef, RowAction} from "../components/TableTypes";
import {useLoadList} from "../hooks/useLoadList";
import {api} from "../api/adminApi";
import {
    ProfileOwnerType,
    ProfileRecordKind,
} from "../types/admin";
import ProfileRecordDialog from "../components/profileRecords/ProfileRecordDialog";
import {ProfileRecordFormModel} from "../components/profileRecords/ProfileRecordFormTypes";
import ConfirmDialog from "../components/common/ConfirmDialog";

type ProfileRecordRow = {
    id: string;
    ownerType: string;
    ownerId: string;
    typeName: string;
    typeNameGeo?: string;
    startDate?: string;
    endDate?: string;
    title?: string;
    about?: string;
    certified?: boolean;
    certificationDate?: string;
    workDescription?: string;
    sortOrder?: number;
    version: number;
};

const KIND_LABELS: Record<ProfileRecordKind, string> = {
    education: "Education",
    language: "Language",
    profession: "Profession",
    "work-experience": "Work Experience",
    district: "District",
};

export default function ProfileRecordsTabContainer() {
    const [kind, setKind] = useState<ProfileRecordKind>("education");
    const [ownerType, setOwnerType] = useState<ProfileOwnerType | "">("");
    const [ownerId, setOwnerId] = useState<string>("");

    const query = useMemo(
        () => ({
            ownerType: ownerType || undefined,
            ownerId: ownerId || undefined,
        }),
        [ownerType, ownerId]
    );

    const mapRow = useCallback(
        (d: any): ProfileRecordRow => ({
            id: d.id ?? d.Id,
            ownerType: d.ownerType ?? d.OwnerType ?? "",
            ownerId: d.ownerId ?? d.OwnerId ?? "",
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
            typeNameGeo:
                d.educationTypeNameGeo ??
                d.languageTypeNameGeo ??
                d.professionTypeNameGeo ??
                d.workTypeNameGeo ??
                d.districtNameGeo ??
                d.EducationTypeNameGeo ??
                d.LanguageTypeNameGeo ??
                d.ProfessionTypeNameGeo ??
                d.WorkTypeNameGeo ??
                d.DistrictNameGeo ??
                undefined,
            startDate: d.startDate ?? d.StartDate ?? undefined,
            endDate: d.endDate ?? d.EndDate ?? undefined,
            title: d.title ?? d.Title ?? undefined,
            about: d.about ?? d.About ?? undefined,
            certified: d.certified ?? d.Certified ?? undefined,
            certificationDate:
                d.certificationDate ?? d.CertificationDate ?? undefined,
            workDescription:
                d.workDescription ?? d.WorkDescription ?? undefined,
            sortOrder: d.sortOrder ?? d.SortOrder ?? undefined,
            version: d.version ?? d.Version ?? 0,
        }),
        [kind]
    );

    const {rows, reload} = useLoadList<any, ProfileRecordRow>({
        url: `/api/profile-records/${kind}`,
        query,
        map: mapRow,
    });

    const columns: ColumnDef<ProfileRecordRow>[] = useMemo(() => {
        const base: ColumnDef<ProfileRecordRow>[] = [
            {key: "n", header: "N", render: (_r, i) => i + 1},
            {key: "ownerType", header: "Owner Type", render: (r) => r.ownerType},
            {key: "ownerId", header: "Owner ID", render: (r) => r.ownerId},
            {key: "type", header: "Type", render: (r) => r.typeName},
        ];
        if (kind === "education") {
            base.push(
                {key: "title", header: "Title", render: (r) => r.title ?? "—"},
                {key: "about", header: "About", render: (r) => r.about ?? "—"},
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
        base.push({
            key: "sort",
            header: "Sort Order",
            render: (r) => r.sortOrder ?? "—",
        });
        return base;
    }, [kind]);

    const [modal, setModal] = useState<null | "create" | "update" | "delete">(
        null
    );
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<ProfileRecordFormModel>({
        ownerType: "Author",
        ownerId: "",
        typeId: "",
    });
    const [submitErr, setSubmitErr] = useState<string>();
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string>();

    const loadDetails = async (id: string) => {
        const res = await api.get(`/api/profile-records/${kind}/${id}`);
        const d = res?.data?.data ?? res?.data ?? {};
        return {
            id: d.id ?? d.Id,
            version: d.version ?? d.Version ?? 0,
            ownerType: (d.ownerType ?? d.OwnerType) as ProfileOwnerType,
            ownerId: d.ownerId ?? d.OwnerId ?? "",
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
            sortOrder: d.sortOrder ?? d.SortOrder ?? undefined,
        } as ProfileRecordFormModel;
    };

    const actions: RowAction<ProfileRecordRow>[] = useMemo(
        () => [
            {
                id: "edit",
                label: "Update details",
                onClick: async (r) => {
                    setSelectedId(r.id);
                    const model = await loadDetails(r.id);
                    setSelectedModel(model);
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
        [kind]
    );

    const openCreate = () => {
        setSelectedId(null);
        setSelectedModel({
            ownerType: (ownerType || "Author") as ProfileOwnerType,
            ownerId: ownerId || "",
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
    };
    const saved = () => {
        close();
        reload();
    };

    const submitCreate = async (model: ProfileRecordFormModel) => {
        setSaving(true);
        setSubmitErr(undefined);
        try {
            const payload: any = {
                ownerType: model.ownerType,
                ownerId: model.ownerId,
                sortOrder: model.sortOrder === "" ? undefined : model.sortOrder,
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
        if (!model.id) return;
        setSaving(true);
        setSubmitErr(undefined);
        try {
            const payload: any = {
                id: model.id,
                version: model.version ?? 0,
                ownerType: model.ownerType,
                ownerId: model.ownerId,
                sortOrder: model.sortOrder === "" ? undefined : model.sortOrder,
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
        <Box sx={{width: "100%", display: "flex", flexDirection: "column", gap: 3}}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                flexWrap="wrap"
            >
                <Typography variant="h5" fontWeight={700}>
                    Profile Records
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                    <TextField
                        select
                        label="Kind"
                        value={kind}
                        onChange={(e) => setKind(e.target.value as ProfileRecordKind)}
                        size="small"
                    >
                        {Object.keys(KIND_LABELS).map((k) => (
                            <MenuItem key={k} value={k}>
                                {KIND_LABELS[k as ProfileRecordKind]}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Owner Type"
                        value={ownerType}
                        onChange={(e) =>
                            setOwnerType(e.target.value as ProfileOwnerType | "")
                        }
                        size="small"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Author">Author</MenuItem>
                        <MenuItem value="Student">Student</MenuItem>
                    </TextField>
                    <TextField
                        label="Owner ID"
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        size="small"
                    />
                </Stack>
                <Button variant="contained" onClick={openCreate}>
                    Add record
                </Button>
            </Stack>

            <GenericTable columns={columns} rows={rows} actions={actions} />

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
        </Box>
    );
}
