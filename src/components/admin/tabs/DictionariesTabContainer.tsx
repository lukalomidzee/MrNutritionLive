import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import GenericTable from "../components/GenericTable";
import { ColumnDef, RowAction } from "../components/TableTypes";
import { Edit, Trash } from "lucide-react";
import { useLoadList } from "../hooks/useLoadList";
import { api } from "../api/adminApi";
import DictionaryItemDialog, {
  DictionaryItemFormModel,
} from "../components/dictionaries/DictionaryItemDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";

type DictionaryRow = {
  id: string;
  kind: string;
  parentId?: string;
  parentName?: string;
  parentNameGeo?: string;
  name: string;
  nameGeo: string;
  version: number;
};

const DICTIONARY_KINDS = [
  { label: "Country", value: 1 },
  { label: "City", value: 2 },
  { label: "District", value: 3 },
  { label: "WorkType", value: 4 },
  { label: "ProfessionType", value: 5 },
  { label: "SexType", value: 6 },
  { label: "LanguageType", value: 7 },
  { label: "PageType", value: 8 },
  { label: "LinkType", value: 9 },
  { label: "EducationType", value: 10 },
  { label: "CourseStatusType", value: 11 },
  { label: "CourseType", value: 12 },
  //   { label: "MediaRoleType", value: 13 },
  { label: "CertificationType", value: 14 },
];

export default function DictionariesTabContainer() {
  const [kind, setKind] = useState<number>(1);
  const kindName =
    DICTIONARY_KINDS.find((k) => k.value === kind)?.label ?? "Country";

  const query = useMemo(() => ({ kind, page: 1, pageSize: 50 }), [kind]);

  const mapRow = useCallback(
    (d: any): DictionaryRow => ({
      id: d.id ?? d.Id,
      kind:
        typeof (d.kind ?? d.Kind) === "number"
          ? (DICTIONARY_KINDS.find((k) => k.value === (d.kind ?? d.Kind))
              ?.label ?? String(d.kind ?? d.Kind ?? ""))
          : (d.kind ?? d.Kind ?? ""),
      parentId: d.parentId ?? d.ParentId ?? undefined,
      parentName: d.parentName ?? d.ParentName ?? undefined,
      parentNameGeo: d.parentNameGeo ?? d.ParentNameGeo ?? undefined,
      name: d.name ?? d.Name ?? "",
      nameGeo: d.nameGeo ?? d.NameGeo ?? "",
      version: d.version ?? d.Version ?? 0,
    }),
    [],
  );

  const selectItems = useCallback(
    (raw: any) => raw?.items ?? raw?.Items ?? raw ?? [],
    [],
  );

  const { rows, reload } = useLoadList<any, DictionaryRow>({
    url: "/api/dictionaries/paged",
    query,
    map: mapRow,
    select: selectItems,
  });

  const columns: ColumnDef<DictionaryRow>[] = [
    { key: "n", header: "N", render: (_r, i) => i + 1 },
    { key: "kind", header: "Kind", render: (r) => r.kind },
    { key: "name", header: "Name", render: (r) => r.name },
    { key: "nameGeo", header: "Name (Geo)", render: (r) => r.nameGeo },
    { key: "parentName", header: "Parent", render: (r) => r.parentName ?? "—" },
    {
      key: "parentNameGeo",
      header: "Parent (Geo)",
      render: (r) => r.parentNameGeo ?? "—",
    },
    // { key: "parent", header: "Parent ID", render: (r) => r.parentId ?? "—" },
  ];

  const [modal, setModal] = useState<null | "create" | "update" | "delete">(
    null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<DictionaryItemFormModel>({
    kindId: kind,
    kindName,
    name: "",
    nameGeo: "",
  });
  const [submitErr, setSubmitErr] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  const actions: RowAction<DictionaryRow>[] = useMemo(
    () => [
      {
        id: "edit",
        label: "Update details",
        icon: <Edit size={18} />,
        onClick: async (r) => {
          setSelectedId(r.id);
          const res = await api.get(`/api/dictionaries/${r.id}`);
          const d = res?.data?.data ?? res?.data ?? {};
          setSelectedModel({
            id: d.id ?? d.Id,
            version: d.version ?? d.Version ?? 0,
            kindId: d.kind ?? d.Kind ?? kind,
            kindName:
              typeof (d.kind ?? d.Kind) === "number"
                ? (DICTIONARY_KINDS.find((k) => k.value === (d.kind ?? d.Kind))
                    ?.label ?? kindName)
                : (d.kind ?? d.Kind ?? kindName),
            parentId: d.parentId ?? d.ParentId ?? "",
            name: d.name ?? d.Name ?? "",
            nameGeo: d.nameGeo ?? d.NameGeo ?? "",
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
    [kind],
  );

  const openCreate = () => {
    setSelectedId(null);
    setSelectedModel({
      kindId: kind,
      kindName,
      name: "",
      nameGeo: "",
    });
    setModal("create");
  };

  const close = () => {
    setModal(null);
    setSubmitErr(undefined);
    setSaving(false);
    setDeleting(false);
    setDeleteError(undefined);
    setSelectedId(null);
    setSelectedModel({
      kindId: kind,
      kindName,
      name: "",
      nameGeo: "",
    });
  };
  const saved = () => {
    close();
    reload();
  };

  const submitCreate = async (model: DictionaryItemFormModel) => {
    setSaving(true);
    setSubmitErr(undefined);
    try {
      await api.post("/api/dictionaries", {
        kind: model.kindId,
        parentId: model.parentId || undefined,
        name: model.name,
        nameGeo: model.nameGeo,
      });
      saved();
    } catch (e: any) {
      setSubmitErr(e?.response?.data?.message ?? e?.message ?? "Failed.");
      setSaving(false);
    }
  };

  const submitUpdate = async (model: DictionaryItemFormModel) => {
    if (!model.id) return;
    setSaving(true);
    setSubmitErr(undefined);
    try {
      await api.put("/api/dictionaries", {
        id: model.id,
        kind: model.kindId,
        parentId: model.parentId || undefined,
        name: model.name,
        nameGeo: model.nameGeo,
        version: model.version ?? 0,
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
      await api.delete(`/api/dictionaries/${selectedId}`);
      saved();
    } catch (e: any) {
      setDeleteError(
        e?.response?.data?.message ?? e?.message ?? "Failed to delete.",
      );
      setDeleting(false);
    }
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        flexWrap="wrap"
      >
        <Typography variant="h5" fontWeight={700}>
          Dictionaries
        </Typography>
        <Stack direction={"row"} spacing={2}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField
              select
              label="Kind"
              value={kind}
              onChange={(e) => setKind(Number(e.target.value))}
              size="small"
              sx={{
                width: 200,
              }}
            >
              {DICTIONARY_KINDS.map((k) => (
                <MenuItem key={k.value} value={k.value}>
                  {k.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Button variant="contained" onClick={openCreate}>
            Add item
          </Button>
        </Stack>
      </Stack>

      <GenericTable columns={columns} rows={rows} actions={actions} />

      <DictionaryItemDialog
        open={modal === "create"}
        title="Add dictionary item"
        initial={selectedModel}
        onClose={close}
        onSubmit={submitCreate}
        submitLabel="Create"
        loading={saving}
        error={submitErr}
      />

      <DictionaryItemDialog
        open={modal === "update"}
        title="Update dictionary item"
        initial={selectedModel}
        onClose={close}
        onSubmit={submitUpdate}
        submitLabel="Update"
        loading={saving}
        error={submitErr}
      />

      <ConfirmDialog
        open={modal === "delete"}
        title="Delete item?"
        message="This action cannot be undone."
        error={deleteError}
        onCancel={close}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </Box>
  );
}
