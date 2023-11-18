import { ChangeEvent, FC, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Alert, IconButton, Snackbar } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import isoToDate from "../../utils/isoToDate";
import isoToTime from "../../utils/isoToTime";
import FMBookingCancelModal from "../modals/FMBookingCancelModal";

const columns: readonly AdminBookingsColumnData[] = [
  { id: "title", label: "Title/Facility", minWidth: 140 },
  { id: "reqBy", label: "Requested By", minWidth: 140 },
  { id: "purpose", label: "Purpose", minWidth: 140 },
  { id: "date", label: "Date", minWidth: 140 },
  { id: "time", label: "Time slot", minWidth: 170 },
  { id: "createdAt", label: "Requested At", minWidth: 150 },
  { id: "gd", label: "Group Director", minWidth: 170 },
  { id: "fm", label: "Facility Manager", minWidth: 170 },
  { id: "admin", label: "Admin", minWidth: 170 },
  { id: "remark", label: "Rejection Remark", minWidth: 170 },
  { id: "cancellationremark", label: "Cancellation Remark", minWidth: 170 },
  { id: "status", label: "Approval Status", minWidth: 170 },
  { id: "cancellationstatus", label: "Cancellation Status", minWidth: 170 },
  { id: "actions", label: "Actions", minWidth: 170 },
];

const FMBookingsTable: FC<FMBookingsTableProps> = (
  bookingsData
): JSX.Element => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [selectedSlug, setSelectedSlug] = useState<string>("");

  console.log(bookingsData);
  const rows: AdminBookingsRowData[] =
    bookingsData.bookingsData.length > 0
      ? bookingsData.bookingsData.reduce(
          (accumulator: AdminBookingsRowData[], bookings) => {
            const bookingsMapped = bookings?.bookings?.map((booking) => ({
              title: (
                <>
                  {booking.title}
                  <br />
                  {booking.facility.name}
                </>
              ),
              reqBy: booking.requestedBy.name,
              purpose: booking.purpose,
              date: isoToDate(booking.time.date).toString(),
              time:
                isoToTime(booking.time.start) +
                " - " +
                isoToTime(booking.time.end),
              createdAt: (
                <>
                  {isoToTime(booking.createdAt)}
                  <br />
                  {isoToDate(booking.createdAt).toString()}
                </>
              ),
              gd: booking.groupDirectorName ? (
                <p
                  className={
                    booking.status === "REJECTED_BY_GD"
                      ? "text-red-600"
                      : booking.status === "APPROVED_BY_GD" ||
                        booking.status === "APPROVED_BY_FM" ||
                        booking.status === "REJECTED_BY_FM" ||
                        booking.status === "CANCELLED"
                      ? "text-green-600"
                      : ""
                  }
                >
                  {booking.groupDirectorName || null}
                  <br />
                  {booking.statusUpdateAtGD
                    ? isoToTime(booking.statusUpdateAtGD!)
                    : null}
                  <br />
                  {booking.statusUpdateAtGD
                    ? isoToDate(booking.statusUpdateAtGD!)
                    : null}
                </p>
              ) : null,
              fm: booking.facilityManagerName ? (
                <p
                  className={
                    booking.status === "REJECTED_BY_FM"
                      ? "text-red-600"
                      : booking.status === "APPROVED_BY_FM" ||
                        booking.status === "CANCELLED"
                      ? "text-green-600"
                      : ""
                  }
                >
                  {booking.facilityManagerName || null}
                  <br />
                  {booking.statusUpdateAtFM
                    ? isoToTime(booking.statusUpdateAtFM!)
                    : null}
                  <br />
                  {booking.statusUpdateAtFM
                    ? isoToDate(booking.statusUpdateAtFM!)
                    : null}
                </p>
              ) : null,
              admin: (
                <p
                  className={
                    booking.status === "REJECTED_BY_ADMIN"
                      ? "text-red-600"
                      : booking.status === "APPROVED_BY_ADMIN"
                      ? "text-green-600"
                      : ""
                  }
                >
                  {booking.statusUpdateAtAdmin
                    ? isoToTime(booking.statusUpdateAtAdmin!)
                    : "N/A"}
                  <br />
                  {booking.statusUpdateAtAdmin &&
                    isoToDate(booking.statusUpdateAtAdmin!)}
                </p>
              ),
              remark: booking.remark ? booking.remark : "N/A",
              cancellationremark: booking.cancellationRemark
                ? booking.cancellationRemark
                : "N/A",
              status: (
                <p
                  className={
                    booking.status.startsWith("APPROVED")
                      ? "text-green-600"
                      : booking.status.startsWith("REJECTED") ||
                        booking.status.startsWith("CANCELLED")
                      ? "text-red-600"
                      : "text-blue-600"
                  }
                >
                  {booking.status.toLowerCase().replace(/_/g, " ")}
                </p>
              ),
              cancellationstatus: (
                <p
                  className={
                    booking.cancellationStatus!.startsWith("APPROVED")
                      ? "text-green-600"
                      : booking.cancellationStatus!.startsWith("REJECTED") ||
                        booking.cancellationStatus!.startsWith("CANCELLED")
                      ? "text-red-600"
                      : "text-blue-600"
                  }
                >
                  {booking.cancellationStatus!.toLowerCase().replace(/_/g, " ")}
                </p>
              ),
              actions:
                booking.status === "APPROVED_BY_FM" ||
                booking.status === "APPROVED_BY_ADMIN" ? (
                  <IconButton
                    color="error"
                    onClick={() => {
                      setSelectedSlug(booking.slug);
                      setIsOpen(true);
                    }}
                  >
                    <HighlightOffIcon />
                  </IconButton>
                ) : (
                  "No actions"
                ),
            }));
            return [...accumulator, ...bookingsMapped];
          },
          []
        )
      : [];

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleCloseSnackbar = (): void => {
    setIsSnackbarOpen(false);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "75vw", height: "75dvh", overflow: "hidden" }}>
      {isOpen && (
        <FMBookingCancelModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          slug={selectedSlug}
          setOpenSnackbar={setIsSnackbarOpen}
        />
      )}
      <TableContainer sx={{ height: "90%", overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                  sx={{ backgroundColor: "#646464", color: "#fff" }}
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
                          {value ? (
                            value
                          ) : (
                            <p className="text-blue-600">Not approved</p>
                          )}
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
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Booking cancelled successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default FMBookingsTable;
