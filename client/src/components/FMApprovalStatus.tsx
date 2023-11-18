import { FC, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress, Typography } from "@mui/material";
import axios from "axios";

import ApprovalCard from "./cards/ApprovalCard";
import ErrorComponent from "./Error";

const FMApprovalStatus: FC = (): JSX.Element => {
  const [approvalData, setApprovalData] = useState<FMApprovalData>({
    count: null,
    facilities: [{ bookings: [] }],
  });

  const { data, isPending, isError, error } = useQuery<FMApprovalData>({
    queryKey: ["fmapprovals"],
    queryFn: async () => {
      const response = await axios.get<FMApprovalData>(
        `${import.meta.env.VITE_APP_SERVER_URL}/employee/approvals/fm`,
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
      setApprovalData(data!);
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
        Approval Status
      </Typography>
      {!isPending && approvalData.count! < 1 ? (
        <Typography variant="h5" component="h2" sx={{ marginTop: "1em" }}>
          No booking requests at the moment!
        </Typography>
      ) : (
        <div className="w-full flex flex-col items-center">
          {!isPending &&
            approvalData.facilities!.map((facility) =>
              facility.bookings.map((approval) => (
                <ApprovalCard
                  key={approval.slug}
                  title={approval.title}
                  purpose={approval.purpose}
                  slug={approval.slug}
                  date={approval.time.date}
                  start={approval.time.start}
                  createdAt={approval.createdAt}
                  end={approval.time.end}
                  facility={approval.facility.name && approval.facility.name!}
                  requestedBy={
                    approval.requestedBy.name
                      ? approval.requestedBy.name!
                      : null
                  }
                  approvedByGD={
                    approval.groupDirectorName
                      ? approval.groupDirectorName!
                      : null
                  }
                  approvedAtGD={
                    approval.statusUpdateAtGD
                      ? approval.statusUpdateAtGD!
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

export default FMApprovalStatus;
