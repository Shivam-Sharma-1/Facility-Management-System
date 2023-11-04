import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import axios from "axios";

import { Typography } from "@mui/material";
import ApprovalCard from "./ApprovalCard";
import Loader from "./Loader";

const ApprovalStatus: FC<ApprovalStatusProps> = ({ GD, FM }): JSX.Element => {
  const { data: approvalData, isPending } = useQuery<ApprovalData[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await axios.get<ApprovalData[]>(
        `http://localhost:3000/employee/approvals/${
          GD ? "gd" : FM ? "fm" : "admin"
        }`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    refetchInterval: 5 * 1000,
  });

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
      {!isPending && approvalData && approvalData.length! <= 1 ? (
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
                date={approval.date}
                start={approval.start}
                end={approval.end}
                facility={approval.facility.name!}
                requestedBy={approval.requestedBy.name!}
                approvedAtAdmin={approval.approvedAtAdmin}
                approvedAtFM={approval.approvedAtFM}
                approvedAtGD={approval.approvedAtGD}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalStatus;
