import React, { ReactNode } from "react";

export type CellRenderer<T> = (row: T, index: number) => React.ReactNode;

export interface ColumnDef<T> {
  key: string;
  header: string;
  render: CellRenderer<T>;
}

export interface RowAction<T> {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
}
