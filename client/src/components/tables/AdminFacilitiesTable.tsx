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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import isoToDate from "../../utils/isoToDate";
import isoToTime from "../../utils/isoToTime";
import EditFacilityModal from "../modals/EditFacilityModal";
import DeleteFacilityModal from "../modals/DeleteFacilityModal";

const columns: readonly AdminFacilitiesColumnData[] = [
  { id: "name", label: "Name/Building", minWidth: 145 },
  { id: "description", label: "Description", minWidth: 140 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "createdAt", label: "Created At", minWidth: 150 },
  { id: "updatedAt", label: "Updated At", minWidth: 150 },
  { id: "deletedAt", label: "Deleted At", minWidth: 150 },
  { id: "fm", label: "Facility Manager", minWidth: 170 },
  { id: "actions", label: "Operations", minWidth: 130 },
];

const AdminFacilitiesTable: FC<AdminFacilitiesTableProps> = ({
  facilities,
  buildings,
}): JSX.Element => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isEditFacilityModalOpen, setIsEditFacilityModalOpen] =
    useState<boolean>(false);
  const [isDeleteFacilityModalOpen, setIsDeleteFacilityModalOpen] =
    useState<boolean>(false);
  const [modalData, setModalData] = useState<FacilityData>({
    id: "",
    name: "",
    description: "",
    building: {
      name: "",
    },
    status: "",
    icon: "",
    slug: "",
    facilityManager: {
      user: {
        name: "",
        employeeId: null,
      },
    },
  });
  const [openEditSnackbar, setOpenEditSnackbar] = useState<boolean>(false);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState<boolean>(false);

  const handleCloseSnackbar = (): void => {
    setOpenEditSnackbar(false);
    setOpenDeleteSnackbar(false);
  };

  const rows: AdminFacilitiesRowData[] =
    facilities &&
    facilities.map((facility) => ({
      name: (
        <>
          {facility.name} /
          <br />
          {facility.building!.name}
        </>
      ),
      description: facility.description,
      status: facility.isActive ? "Active" : "Inactive",
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
          {facility.deletedAt ? isoToTime(facility.deletedAt!) : "N/A"}
          <br />
          {facility.deletedAt && isoToDate(facility.deletedAt!).toString()}
        </>
      ),
      fm: (
        <>
          {facility.isActive ? facility.facilityManager?.user.name : "N/A"}
          <br />
          {facility.isActive &&
            "Id:" + facility.facilityManager?.user.employeeId}
        </>
      ),
      actions: (
        <>
          {facility.isActive ? (
            <div className="flex gap-1">
              <IconButton
                color="primary"
                onClick={() => {
                  setModalData(facility);
                  setIsEditFacilityModalOpen(true);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  setModalData(facility);
                  setIsDeleteFacilityModalOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ) : (
            "N/A"
          )}
        </>
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
    <Paper sx={{ width: "75vw", height: "75dvh", overflow: "hidden" }}>
      {isEditFacilityModalOpen && (
        <EditFacilityModal
          isOpen={isEditFacilityModalOpen}
          setIsOpen={setIsEditFacilityModalOpen}
          setOpenSnackbar={setOpenEditSnackbar}
          facilityData={modalData}
          buildingData={buildings}
        />
      )}
      {isDeleteFacilityModalOpen && (
        <DeleteFacilityModal
          isOpen={isDeleteFacilityModalOpen}
          setIsOpen={setIsDeleteFacilityModalOpen}
          setOpenSnackbar={setOpenDeleteSnackbar}
          facilityData={modalData}
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
            {rows &&
              rows
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
        open={openEditSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Facility edited successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Facility deleted successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AdminFacilitiesTable;
