import { FC } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";

import isoToTime from "../utils/isoToTime";
import isoToDate from "../utils/isoToDate";
import { useAuth } from "../hooks/useAuth";

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
];
const GDBookingsReport: FC<AdminBookingsTableProps> = ({
  bookingsData,
  forwardedRef,
}): JSX.Element => {
  const auth = useAuth();

  const rows: AdminBookingsRowData[] =
    bookingsData &&
    bookingsData.map((booking) => ({
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
    }));

  return (
    <div className="w-full flex flex-col gap-4" ref={forwardedRef}>
      <div className="w-full flex justify-between items-center">
        <Typography variant="h6" component="h1">
          Bookings Report
        </Typography>
        <Typography variant="caption" component="p">
          Generated by {auth?.user?.name} at: {new Date().toLocaleString()}
        </Typography>
      </div>
      <Paper sx={{ overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="left"
                    sx={{
                      backgroundColor: "#646464",
                      color: "#fff",
                      fontSize: "10px",
                      paddingBlock: "6px",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={"left"}
                          sx={{ fontSize: "10px", paddingBlock: "6px" }}
                        >
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
      </Paper>{" "}
    </div>
  );
};

export default GDBookingsReport;
