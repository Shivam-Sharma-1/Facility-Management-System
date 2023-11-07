import { Button, CircularProgress, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AdminFacilitiesTable from "./AdminFacilitiesTable";

const AdminFacilities: FC = (): JSX.Element => {
  const [facilitiesData, setFacilitiesData] = useState<FacilityData[]>([]);

  const { data, isPending } = useQuery({
    queryKey: ["adminfacilities"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/admin/facility", {
        withCredentials: true,
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (!isPending) {
      setFacilitiesData(data);
    }
  }, [data, isPending]);

  if (isPending)
    return (
      <div className="w-[80%] min-h-screen h-full flex flex-col items-center justify-center">
        <CircularProgress />
      </div>
    );

  return (
    <div className="w-[80%] flex flex-col px-12 py-8 gap-6">
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
        >
          Add facility
        </Button>
      </div>
      {!isPending && (
        <div>
          <AdminFacilitiesTable facilitiesData={facilitiesData} />
        </div>
      )}
    </div>
  );
};

export default AdminFacilities;
