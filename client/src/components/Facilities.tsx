import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Divider, Typography } from "@mui/material";

import FacilityCard from "./cards/FacilityCard";
import ErrorComponent from "./Error";

const Facilities: FC = (): JSX.Element => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await axios.get<DashboardData[]>(
        `${import.meta.env.VITE_APP_SERVER_URL}/dashboard`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    retry: 1,
    gcTime: 0,
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
    <div className="w-full h-full flex flex-col items-center justify-center pt-12 px-6">
      <Typography variant="h2" component="h1">
        Facilities
      </Typography>
      <div className="w-full flex flex-col justify-center items-center flex-wrap pt-4 gap-2">
        {!isPending &&
          data?.map(
            (section) =>
              section.facility.length > 0 && (
                <div className="w-full flex flex-col gap-2">
                  <Typography variant="h4" component="h2">
                    {section.name}
                  </Typography>
                  <Divider color="gray" />
                  <div className="w-full flex items-center justify-center flex-wrap">
                    {section.facility.map((facility: FacilityData) => (
                      <Link
                        to={`/facility/${facility.slug}`}
                        key={facility.name}
                      >
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
              )
          )}
      </div>
    </div>
  );
};

export default Facilities;
