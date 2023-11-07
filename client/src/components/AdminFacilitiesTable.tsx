import { ChangeEvent, FC, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import isoToDate from "../utils/isoToDate";
import isoToTime from "../utils/isoToTime";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const columns: readonly AdminFacilitiesColumnData[] = [
  { id: "name", label: "Name", minWidth: 140 },
  { id: "description", label: "Description", minWidth: 140 },
  { id: "createdAt", label: "Created At", minWidth: 150 },
  { id: "updatedAt", label: "Updated At", minWidth: 150 },
  { id: "deletedAt", label: "Deleted At", minWidth: 150 },
  { id: "fm", label: "Facility Manager", minWidth: 170 },
  { id: "actions", label: "Operations", minWidth: 130 },
];

const AdminFacilitiesTable: FC<AdminFacilitiesTableProps> = (
  facilitiesData
): JSX.Element => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const rows: AdminFacilitiesRowData[] =
    facilitiesData &&
    facilitiesData.facilitiesData.map((facility) => ({
      name: facility.name,
      description: facility.description,
      createdAt: (
        <>
          {isoToTime(facility.createdAt!)}
          <br />
          {isoToDate(facility.createdAt!).toString()}
        </>
      ),
      updatedAt: (
        <>
          {isoToTime(facility.updatedAt!)}
          <br />
          {isoToDate(facility.updatedAt!).toString()}
        </>
      ),
      deletedAt: (
        <>
          {isoToTime(facility.deletedAt!)}
          <br />
          {isoToDate(facility.deletedAt!).toString()}
        </>
      ),
      fm: facility.facilityManager ? (
        <>
          {facility.facilityManager?.user.name || null}
          <br />
          Id: {facility.facilityManager?.user.employeeId || null}
        </>
      ) : null,
      actions: (
        <div className="flex gap-1">
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    }));

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 540 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={"left"}>
                          {value ? value : "Not approved"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default AdminFacilitiesTable;
