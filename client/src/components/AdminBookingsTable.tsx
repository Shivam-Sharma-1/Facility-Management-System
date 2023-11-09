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
import { Alert, IconButton, Snackbar } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AdminBookingApprovalModal from "./modals/AdminBookingApprovalModal";
import AdminBookingRejectModal from "./modals/AdminBookingRejectModal";

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
  { id: "remark", label: "Remark", minWidth: 170 },
  { id: "status", label: "Status", minWidth: 170 },
  { id: "actions", label: "Operations", minWidth: 130 },
];

const AdminBookingsTable: FC<AdminBookingsTableProps> = (
  bookingsData
): JSX.Element => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);
  const [isOpenApproveSnackbar, setIsOpenApproveSnackbar] =
    useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [isOpenRejectSnackbar, setIsOpenRejectSnackbar] =
    useState<boolean>(false);
  const [selectedSlug, setSelectedSlug] = useState<string>("");

  const rows: AdminBookingsRowData[] =
    bookingsData &&
    bookingsData.bookingsData.map((booking) => ({
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
      time: isoToTime(booking.time.start) + " - " + isoToTime(booking.time.end),
      createdAt: (
        <>
          {isoToTime(booking.createdAt)}
          <br />
          {isoToDate(booking.createdAt).toString()}
        </>
      ),
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
      admin: (
        <>
          {booking.statusUpdateAtAdmin
            ? isoToTime(booking.statusUpdateAtAdmin!)
            : "N/A"}
          <br />
          {booking.statusUpdateAtAdmin &&
            isoToDate(booking.statusUpdateAtAdmin!)}
        </>
      ),
      remark: booking.remark ? booking.remark : "N/A",
      status: booking.status.toLowerCase().replace(/_/g, " "),
      actions:
        booking.status === "PENDING" || booking.status === "APPROVED_BY_GD" ? (
          <div className="flex gap-1">
            <IconButton
              color="success"
              onClick={() => {
                setSelectedSlug(booking.slug);
                setIsApproveModalOpen(true);
              }}
            >
              <TaskAltIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                setSelectedSlug(booking.slug);
                setIsRejectModalOpen(true);
              }}
            >
              <HighlightOffIcon />
            </IconButton>
          </div>
        ) : (
          "No actions"
        ),
    }));

  const handleCloseSnackbar = (): void => {
    setIsOpenApproveSnackbar(false);
    setIsOpenRejectSnackbar(false);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "75vw", height: "75dvh", overflow: "hidden" }}>
      {isApproveModalOpen && (
        <AdminBookingApprovalModal
          isOpen={isApproveModalOpen}
          setIsOpen={setIsApproveModalOpen}
          setOpenSnackbar={setIsOpenApproveSnackbar}
          slug={selectedSlug}
        />
      )}
      {isRejectModalOpen && (
        <AdminBookingRejectModal
          isOpen={isRejectModalOpen}
          setIsOpen={setIsRejectModalOpen}
          setOpenSnackbar={setIsOpenRejectSnackbar}
          slug={selectedSlug}
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
                  sx={{ backgroundColor: "#dfdfdf" }}
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
      <Snackbar
        open={isOpenApproveSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Booking approved successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={isOpenRejectSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Booking rejected successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AdminBookingsTable;
