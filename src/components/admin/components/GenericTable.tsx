import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { EllipsisVertical } from "lucide-react";
import React, { useMemo, useState } from "react";
import { ColumnDef, RowAction } from "./TableTypes";

interface GenericTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[];
  rows: T[];
  actions?: RowAction<T>[];
  maxHeight?: string | number;
}

export default function GenericTable<T extends { id: string }>(
  props: Readonly<GenericTableProps<T>>,
) {
  const { columns, rows, actions = [], maxHeight = "60vh" } = props;

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuRow, setMenuRow] = useState<T | null>(null);

  const openMenu = (evt: React.MouseEvent<HTMLElement>, row: T) => {
    evt.stopPropagation();
    setMenuAnchor(evt.currentTarget);
    setMenuRow(row);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuRow(null);
  };

  const visibleActions = useMemo(() => {
    if (!menuRow) return [];
    return actions.filter((a) => (a.show ? a.show(menuRow) : true));
  }, [actions, menuRow]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        maxHeight,
        overflow: "auto",
        width: "100%",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} sx={{ fontWeight: "bold" }}>
                {col.header}
              </TableCell>
            ))}
            {actions.length > 0 && (
              <TableCell
                key="__actions"
                align="right"
                sx={{ fontWeight: "bold" }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows?.length ? (
            rows.map((row, index) => (
              <TableRow key={row.id} hover>
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render(row, index)}</TableCell>
                ))}

                {actions.length > 0 && (
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => openMenu(e, row)}
                      aria-label="Row actions"
                      sx={{
                        color: "#FB8C00",
                        transition: "color 0.2s ease",
                        "&:hover": { color: "#EF6C00" },
                      }}
                    >
                      <EllipsisVertical width={22} height={22} />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + (actions.length ? 1 : 0)}>
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 230 } } }}
      >
        {visibleActions.map((a, i) => (
          <MenuItem
            key={a.id}
            onClick={() => {
              if (menuRow) a.onClick(menuRow);
              closeMenu();
            }}
          >
            {a.icon && <ListItemIcon>{a.icon}</ListItemIcon>}
            <ListItemText primary={a.label} />
            {i === visibleActions.length - 2 && <Divider />}
          </MenuItem>
        ))}
      </Menu>
    </TableContainer>
  );
}
