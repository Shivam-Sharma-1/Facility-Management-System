import { FC, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import generatePDF, { Margin, Options } from "react-to-pdf";
import DownloadIcon from "@mui/icons-material/Download";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import AdminFacilitiesTable from "./tables/AdminFacilitiesTable";
import AddFacilityModal from "./modals/AddFacilityModal";
import FacilitiesReport from "../reports/FacilitiesReport";
import ErrorComponent from "./Error";

const AdminFacilities: FC = (): JSX.Element => {
  const [facilitiesData, setFacilitiesData] =
    useState<AdminFacilitiesTableProps>({
      facilities: [],
      buildings: [
        {
          name: "",
        },
      ],
    });
  const [isAddFacilityModalOpen, setIsAddFacilityModalOpen] =
    useState<boolean>(false);
  const [isPrint, setIsPrint] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const targetRef = useRef<HTMLDivElement>(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["adminfacilities"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_SERVER_URL}/admin/facility`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    refetchInterval: 5 * 1000,
    retry: 1,
    gcTime: 0,
  });

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (!isPending) {
      setFacilitiesData(data);
    }
  }, [data, isPending]);

  useEffect(() => {
    if (isPrint) {
      setTimeout(() => {
        setIsPrint(false);
      }, 3000);
    }

    if (isPrint) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [isPrint]);

  if (isError) {
    const errorData = error.response!.data as ErrorMessage;
    return (
      <ErrorComponent
        status={errorData.error.status!}
        message={errorData.error.message}
      />
    );
  }

  if (isPending)
    return (
      <div className="w-[74vw] min-h-screen h-full flex flex-col items-center justify-center">
        <CircularProgress />
      </div>
    );

  const options: Options = {
    filename: "admin-facilities-bookings-report.pdf",
    page: {
      orientation: "landscape",
      margin: Margin.SMALL,
    },
  };

  return (
    <div className="w-full flex flex-col px-6 pt-8 gap-6">
      {isAddFacilityModalOpen && (
        <AddFacilityModal
          isOpen={isAddFacilityModalOpen}
          setIsOpen={setIsAddFacilityModalOpen}
          setOpenSnackbar={setOpenSnackbar}
          buildings={facilitiesData.buildings!}
        />
      )}

      <Typography variant="h3" component="h1">
        Manage facilities
      </Typography>
      <div className="w-full flex justify-between items-center">
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

        <Button
          variant="contained"
          color="primary"
          endIcon={<DownloadIcon sx={{ height: "20px", width: "20px" }} />}
          sx={{ paddingX: "2em", height: "45px" }}
          size="large"
          onClick={() => {
            setIsPrint(true);
            setTimeout(() => {
              generatePDF(targetRef, options);
            }, 1000);
          }}
        >
          Export
        </Button>
      </div>
      {!isPending && (
        <AdminFacilitiesTable
          facilities={facilitiesData.facilities}
          buildings={facilitiesData.buildings}
        />
      )}
      {isPrint && (
        <div className="mt-[100dvh]">
          <FacilitiesReport
            facilities={facilitiesData.facilities}
            forwardedRef={targetRef}
          />
        </div>
      )}
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
