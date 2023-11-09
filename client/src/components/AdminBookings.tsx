import {
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";

import AdminBookingsTable from "./AdminBookingsTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AdminBookings: FC = (): JSX.Element => {
  const [bookingsData, setBookingsData] = useState<AdminBookingsData>({
    bookings: [],
    facilities: [],
  });
  const [timeFilter, setTimeFilter] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(true);
  const [slug, setSlug] = useState<string>("");

  const d = new Date();

  const { data, isPending, refetch } = useQuery({
    queryKey: ["adminbookings"],
    queryFn: async () => {
      let url = "http://localhost:3000/admin/bookings";

      if (selectValue) {
        url += `?facility=${slug}`;
      }

      if (timeFilter) {
        if (selectValue) {
          url += `&month=${d.getMonth() + 1}`;
        } else {
          url += `?month=${d.getMonth() + 1}`;
        }
      }

      const response = await axios.get(url, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: enabled,
    refetchInterval: 5 * 1000,
  });

  useEffect(() => {
    if (!isPending) {
      setBookingsData(data);
    }
  }, [data, isPending]);

  if (isPending)
    return (
      <div className="w-[74vw] min-h-screen h-full flex flex-col items-center justify-center">
        <CircularProgress />
      </div>
    );

  return (
    <div className="w-full flex flex-col px-12 pt-8 gap-6">
      <div className="w-full flex justify-between">
        <Typography variant="h3" component="h1">
          Manage bookings
        </Typography>
      </div>
      <div className="w-full flex gap-4">
        <Chip
          label="All"
          clickable={true}
          sx={{
            minWidth: "100px",
            minHeight: "40px",
            fontSize: "1rem",
            borderRadius: "4px",
          }}
          variant={timeFilter ? "outlined" : "filled"}
          onClick={() => setTimeFilter(false)}
        />
        <Chip
          label="This month"
          clickable={true}
          sx={{
            minWidth: "100px",
            minHeight: "40px",
            fontSize: "1rem",
            borderRadius: "4px",
          }}
          variant={timeFilter ? "filled" : "outlined"}
          onClick={() => setTimeFilter(true)}
        />
        <FormControl size="small" className="w-[200px]">
          <InputLabel>Select facility</InputLabel>
          <Select
            label="Select a start time"
            size="small"
            value={selectValue}
            onChange={(e: SelectChangeEvent<string | null>) => {
              setSelectValue(e.target.value!);
              const facility = bookingsData.facilities.find(
                (facility) => facility.name === e.target.value
              );
              setSlug(facility!.slug);
            }}
          >
            {!isPending &&
              bookingsData!.facilities?.map((facility) => (
                <MenuItem key={facility.name} value={facility.name}>
                  {facility.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => {
            setSelectValue("");
            setTimeFilter(false);
            enabled && setEnabled(false);
            refetch();
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            enabled && setEnabled(false);
            refetch();
          }}
        >
          Filter
        </Button>
      </div>
      {!isPending && (
        <AdminBookingsTable bookingsData={bookingsData.bookings} />
      )}
    </div>
  );
};

export default AdminBookings;
