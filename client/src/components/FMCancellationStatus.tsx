import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { CircularProgress, Typography } from "@mui/material";
import axios from "axios";

import CancellationCard from "./cards/CancellationCard";
import ErrorComponent from "./Error";

const FMCancellationStatus: FC = (): JSX.Element => {
  const [cancellationData, setCancellationData] = useState<FMApprovalData>({
    count: null,
    facilities: [{ bookings: [] }],
  });

  const { data, isPending, isError, error } = useQuery<FMApprovalData>({
    queryKey: ["fmcancellations"],
    queryFn: async () => {
      const response = await axios.get<FMApprovalData>(
        `${import.meta.env.VITE_APP_SERVER_URL}/bookings/cancel/fm`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    gcTime: 0,
    refetchInterval: 5 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (!isPending) {
      setCancellationData(data!);
    }
  }, [data, isPending]);

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
    <div className="w-full h-full flex flex-col items-center justify-center px-6 py-12">
      <Typography variant="h3" component="h1">
        Cancellation Status
      </Typography>
      {!isPending && cancellationData.count! < 1 ? (
        <Typography variant="h5" component="h2" sx={{ marginTop: "1em" }}>
          No cancellation requests at the moment!
        </Typography>
      ) : (
        <div className="w-full flex flex-col items-center">
          {!isPending &&
            cancellationData.facilities!.map((facility) =>
              facility.bookings?.map((cancellation) => (
                <CancellationCard
                  key={cancellation.slug}
                  title={cancellation.title}
                  purpose={cancellation.purpose}
                  cancellationRemark={cancellation.cancellationRemark!}
                  slug={cancellation.slug}
                  date={cancellation.time.date}
                  start={cancellation.time.start}
                  createdAt={cancellation.createdAt}
                  cancelledAt={cancellation.cancellationRequestedAt}
                  end={cancellation.time.end}
                  facility={
                    cancellation.facility.name && cancellation.facility.name!
                  }
                  requestedBy={
                    cancellation.requestedBy.name
                      ? cancellation.requestedBy.name!
                      : null
                  }
                  approvedByGD={
                    cancellation.statusUpdateByGD
                      ? cancellation.statusUpdateByGD!.user.name!
                      : null
                  }
                  approvedAtGD={
                    cancellation.cancellationUpdateAtGD
                      ? cancellation.cancellationUpdateAtGD!
                      : null
                  }
                />
              ))
            )}
        </div>
      )}
    </div>
  );
};

export default FMCancellationStatus;
