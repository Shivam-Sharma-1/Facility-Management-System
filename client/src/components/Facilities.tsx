import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FC } from "react";
import axios from "axios";

import FacilityCard from "./cards/FacilityCard";
import { CircularProgress, Typography } from "@mui/material";
import ErrorComponent from "./Error";

const Facilities: FC = (): JSX.Element => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await axios.get<DashboardData>(
        `${import.meta.env.VITE_APP_SERVER_URL}/dashboard`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    retry: 1,
  });

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
      <div className="w-full min-h-screen h-full flex flex-col items-center justify-center">
        <CircularProgress />
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center pt-12">
      <Typography variant="h2" component="h1">
        Facilities
      </Typography>
      <div className="w-full flex justify-center items-center flex-wrap pt-4">
        {!isPending &&
          data?.facilities.map((facility: FacilityData) => (
            <Link to={`/facility/${facility.slug}`} key={facility.name}>
              <FacilityCard
                name={facility.name}
                description={facility.description}
                icon={facility.icon}
                manager={facility.facilityManager.user.name}
              />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Facilities;
