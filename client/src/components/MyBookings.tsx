import { CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import BookingCard from "./cards/MyBookingCard";
import ErrorComponent from "./Error";

const MyBookings = (): JSX.Element => {
  const [myBookings, setMyBookings] = useState<ApprovalData[]>([]);

  const { data, isPending, isError, error } = useQuery<ApprovalData[]>({
    queryKey: ["mybookings"],
    queryFn: async () => {
      const response = await axios.get<ApprovalData[]>(
        `${import.meta.env.VITE_APP_SERVER_URL}/employee/status`,
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
      setMyBookings(data || []);
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
        My Bookings
      </Typography>
      {!isPending && myBookings && myBookings.length! < 1 ? (
        <Typography variant="h5" component="h2" sx={{ marginTop: "1em" }}>
          No booking requests at the moment!
        </Typography>
      ) : (
        <div className="w-full flex flex-col items-center">
          {!isPending &&
            myBookings?.map((booking) => (
              <BookingCard
                key={booking.slug}
                title={booking.title}
                status={booking.status}
                cancelStatus={booking.cancellationStatus!}
                slug={booking.slug}
                purpose={booking.purpose}
                remark={booking.remark}
                date={booking.time.date}
                start={booking.time.start}
                end={booking.time.end}
                createdAt={booking.createdAt}
                facility={booking.facility.name && booking.facility.name!}
                cancellationRequestedAt={
                  booking.cancellationRequestedAt
                    ? booking.cancellationRequestedAt!
                    : null
                }
                cancellationRemark={
                  booking.cancellationRemark
                    ? booking.cancellationRemark!
                    : null
                }
                cancellationUpdateAtGD={
                  booking.cancellationUpdateAtGD
                    ? booking.cancellationUpdateAtGD!
                    : null
                }
                cancellationUpdateAtFM={
                  booking.cancellationUpdateAtFM
                    ? booking.cancellationUpdateAtFM!
                    : null
                }
                requestedBy={
                  booking.requestedBy.name ? booking.requestedBy.name! : null
                }
                approvedByGD={
                  booking.statusUpdateByGD
                    ? booking.statusUpdateByGD!.user.name!
                    : null
                }
                approvedAtGD={
                  booking.statusUpdateAtGD ? booking.statusUpdateAtGD! : null
                }
                approvedByFM={
                  booking.statusUpdateByFM
                    ? booking.statusUpdateByFM!.user.name!
                    : null
                }
                approvedAtFM={
                  booking.statusUpdateAtFM ? booking.statusUpdateAtFM! : null
                }
                approvedAtAdmin={
                  booking.statusUpdateAtAdmin
                    ? booking.statusUpdateAtAdmin!
                    : null
                }
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
