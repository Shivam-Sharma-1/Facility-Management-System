import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ApprovalCard from "./ApprovalCard";
import { Divider, Typography } from "@mui/material";
import { FC } from "react";

const ApprovalStatus: FC<ApprovalStatusProps> = ({ GD, FM }): JSX.Element => {
  const { data: approvalData } = useQuery<ApprovalData[]>({
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
  });

  return (
    <div className="w-[80%] h-full flex flex-col items-center justify-center text-black px-6 py-12">
      <Typography variant="h3" component="h1">
        Approval Status
      </Typography>
      <div className="w-[60%] h-full flex flex-col mt-10 text-black rounded-md bg-white shadow-card">
        {approvalData?.map((approval) => (
          <>
            <ApprovalCard
              key={approval.id}
              title={approval.title}
              purpose={approval.purpose}
              slug={approval.slug}
              date={approval.date}
              start={approval.start}
              end={approval.end}
              requestedBy={approval.requestedBy.name}
              approvedAtAdmin={approval.approvedAtAdmin}
              approvedAtFM={approval.approvedAtFM}
              approvedAtGD={approval.approvedAtGD}
            />
            <Divider color="gray" />
          </>
        ))}
      </div>
    </div>
  );
};

export default ApprovalStatus;
