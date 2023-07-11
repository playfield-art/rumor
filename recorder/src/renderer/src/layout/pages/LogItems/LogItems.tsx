import React from "react";
import { useLogItems } from "@hooks/useLogItems";
import dayjs from "dayjs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: "type",
    headerName: "",
    editable: false,
    flex: 1,
    maxWidth: 75,
    // valueFormatter: (params) =>
    //   dayjs(params.value).format("DD/MM/YYYY - HH:mm"),
  },
  {
    field: "time",
    headerName: "Time",
    editable: false,
    flex: 1,
    maxWidth: 175,
    valueFormatter: (params) =>
      dayjs(params.value).format("DD/MM/YYYY - HH:mm"),
  },
  {
    field: "message",
    headerName: "Message",
    editable: false,
    flex: 1,
  },
];

export function LogItems() {
  const logging = useLogItems();
  return (
    <DataGrid
      getRowClassName={(params) => `log-${params.row.type}`}
      initialState={{
        sorting: {
          sortModel: [{ field: "time", sort: "desc" }],
        },
        pagination: { paginationModel: { pageSize: 30 } },
      }}
      rowHeight={30}
      rowSelection={false}
      rows={logging}
      columns={columns}
    />
  );
}
