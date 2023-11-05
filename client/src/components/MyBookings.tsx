import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import BookingCard from "./BookingCard";
import Loader from "./Loader";

const MyBookings = (): JSX.Element => {
  const [myBookings, setMyBookings] = useState<ApprovalData[]>([]);

  const { data, isPending } = useQuery<ApprovalData[]>({
    queryKey: ["mybookings"],
    queryFn: async () => {
      const response = await axios.get<ApprovalData[]>(
        `http://localhost:3000/employee/status`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    refetchInterval: 5 * 1000,
  });

  useEffect(() => {
    if (!isPending) {
      setMyBookings(data || []);
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
                purpose={booking.purpose}
                slug={booking.slug}
                date={booking.time.date}
                start={booking.time.start}
                end={booking.time.end}
                facility={booking.facility.name && booking.facility.name!}
                requestedBy={
                  booking.requestedBy.name ? booking.requestedBy.name! : null
                }
                approvedByGD={
                  booking.statusUpdateByGD
                    ? booking.statusUpdateByGD!.user.name!
                    : null
                }
                approvedByFM={
                  booking.statusUpdateByFM
                    ? booking.statusUpdateByFM!.user.name!
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
