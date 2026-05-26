import { Box } from "@mui/material";
import GenericHeader from "../components/GenericHeader";
import GenericTable from "../components/GenericTable";
import { ColumnDef, RowAction } from "../components/TableTypes";

interface GenericTabProps<T extends { id: string }> {
  title: string;
  columns: ColumnDef<T>[];
  rows: T[];
  actions: RowAction<T>[];
  onAdd: () => void;
  addLabel: string;
}

export default function GenericTab<T extends { id: string }>(
  props: GenericTabProps<T>
) {
  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}
    >
      <GenericHeader
        title={props.title}
        onAdd={props.onAdd}
        addLabel={props.addLabel}
      />
      <GenericTable
        columns={props.columns}
        rows={props.rows}
        actions={props.actions}
      />
    </Box>
  );
}
