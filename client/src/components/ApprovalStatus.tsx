import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import axios from "axios";

import ApprovalCard from "./ApprovalCard";
import Loader from "./Loader";

const ApprovalStatus: FC<ApprovalStatusProps> = ({ GD, FM }): JSX.Element => {
  const [approvalData, setApprovalData] = useState<ApprovalData[]>([]);

  const { data, isPending } = useQuery<ApprovalData[]>({
    queryKey: ["booking"],
    queryFn: async () => {
      const response = await axios.get<ApprovalData[]>(
        `http://localhost:3000/employee/approvals/${GD && !FM ? "gd" : "fm"}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 5 * 1000,
  });

  useEffect(() => {
    if (!isPending) {
      setApprovalData(data || []);
    }
    console.log(data);
  }, [data, isPending]);

  if (isPending)
    return (
      <div className="w-[80%] h-full flex flex-col items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="w-[80%] h-full flex flex-col items-center justify-center px-6 py-12">
      <Typography variant="h3" component="h1">
        Approval Status
      </Typography>
      {!isPending && approvalData && approvalData.length! < 1 ? (
        <Typography variant="h5" component="h2" sx={{ marginTop: "1em" }}>
          No booking requests at the moment!
        </Typography>
      ) : (
        <div className="w-full flex flex-col items-center">
          {!isPending &&
            approvalData?.map((approval) => (
              <ApprovalCard
                key={approval.slug}
                title={approval.title}
                purpose={approval.purpose}
                slug={approval.slug}
                date={approval.time.date}
                start={approval.time.start}
                end={approval.time.end}
                facility={approval.facility.name && approval.facility.name!}
                requestedBy={
                  approval.requestedBy.name ? approval.requestedBy.name! : null
                }
                approvedByGD={
                  approval.statusUpdateByGD
                    ? approval.statusUpdateByGD!.user.name!
                    : null
                }
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalStatus;
