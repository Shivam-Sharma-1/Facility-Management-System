import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AdminFacilitiesTable from "./tables/AdminFacilitiesTable";
import AddFacilityModal from "./modals/AddFacilityModal";

const AdminFacilities: FC = (): JSX.Element => {
  const [facilitiesData, setFacilitiesData] = useState<FacilityData[]>([]);
  const [isAddFacilityModalOpen, setIsAddFacilityModalOpen] =
    useState<boolean>(false);

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const { data, isPending } = useQuery({
    queryKey: ["adminfacilities"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/admin/facility", {
        withCredentials: true,
      });
      return response.data;
    },
    refetchInterval: 5 * 1000,
  });

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (!isPending) {
      setFacilitiesData(data);
    }
  }, [data, isPending]);

  if (isPending)
    return (
      <div className="w-[74vw] min-h-screen h-full flex flex-col items-center justify-center">
        <CircularProgress />
      </div>
    );

  return (
    <div className="w-full flex flex-col px-12 pt-8 gap-6">
      {isAddFacilityModalOpen && (
        <AddFacilityModal
          isOpen={isAddFacilityModalOpen}
          setIsOpen={setIsAddFacilityModalOpen}
          setOpenSnackbar={setOpenSnackbar}
        />
      )}

      <Typography variant="h3" component="h1">
        Manage facilities
      </Typography>
      <div className="w-full flex ">
        <Button
          variant="contained"
          color="primary"
          endIcon={
            <InsertInvitationIcon sx={{ height: "20px", width: "20px" }} />
          }
          sx={{ paddingX: "2em", height: "45px" }}
          size="large"
          onClick={() => {
            setIsAddFacilityModalOpen(true);
          }}
        >
          Add facility
        </Button>
      </div>
      {!isPending && <AdminFacilitiesTable facilitiesData={facilitiesData} />}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Facility added successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminFacilities;
