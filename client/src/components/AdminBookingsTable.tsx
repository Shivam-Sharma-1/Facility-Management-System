import { FC, useState } from "react";
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
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const columns: readonly Column[] = [
  { id: "title", label: "Title/Facility", minWidth: 140 },
  { id: "purpose", label: "Purpose", minWidth: 140 },
  { id: "date", label: "Date", minWidth: 140 },
  { id: "time", label: "Time slot", minWidth: 170 },
  { id: "createdAt", label: "Requested At", minWidth: 150 },
  { id: "reqBy", label: "Requested By", minWidth: 140 },
  { id: "gd", label: "Group Director", minWidth: 170 },
  { id: "fm", label: "Facility Manager", minWidth: 170 },
  { id: "status", label: "Status", minWidth: 170 },
  { id: "actions", label: "Operations", minWidth: 130 },
];

interface rowData {
  title: string;
  purpose: string;
  date: string;
  time: string;
  createdAt: string;
  reqBy: string;
  status: string;
  actions: string;
  gd: string | null;
  fm: string | null;
}

const AdminBookingsTable: FC<AdminBookingsTableProps> = (
  bookingsData
): JSX.Element => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const rows: rowData[] =
    bookingsData &&
    bookingsData.bookingsData.map((booking) => ({
      title: (
        <>
          {booking.title}
          <br />
          {booking.facility.name}
        </>
      ),
      purpose: booking.purpose,
      date: isoToDate(booking.time.date).toString(),
      time: isoToTime(booking.time.start) + " - " + isoToTime(booking.time.end),
      createdAt: (
        <>
          {isoToTime(booking.createdAt)}
          <br />
          {isoToDate(booking.createdAt).toString()}
        </>
      ),
      reqBy: booking.requestedBy.name,
      gd: booking.statusUpdateByGD ? (
        <>
          {booking.statusUpdateByGD?.user.name || null}
          <br />
          {booking.statusUpdateAtGD
            ? isoToTime(booking.statusUpdateAtGD!)
            : null}
          <br />
          {booking.statusUpdateAtGD
            ? isoToDate(booking.statusUpdateAtGD!)
            : null}
        </>
      ) : null,
      fm: booking.statusUpdateByFM ? (
        <>
          {booking.statusUpdateByFM?.user.name || null}
          <br />
          {booking.statusUpdateAtFM
            ? isoToTime(booking.statusUpdateAtFM!)
            : null}
          <br />
          {booking.statusUpdateAtFM
            ? isoToDate(booking.statusUpdateAtFM!)
            : null}
        </>
      ) : null,
      status: booking.status.toLowerCase().replaceAll("_", " "),
      actions:
        booking.status === "PENDING" || booking.status === "APPROVED_BY_GD" ? (
          <div className="flex gap-1">
            <IconButton color="success">
              <TaskAltIcon />
            </IconButton>
            <IconButton color="error">
              <HighlightOffIcon />
            </IconButton>
          </div>
        ) : (
          "No actions"
        ),
    }));
  console.log("rows", rows);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

export default AdminBookingsTable;
