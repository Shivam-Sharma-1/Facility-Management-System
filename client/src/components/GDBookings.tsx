import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import {
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import generatePDF, { Options } from "react-to-pdf";
import DownloadIcon from "@mui/icons-material/Download";

import BookingsTable from "./tables/GDBookingsTable";
import ErrorComponent from "./Error";
import { months } from "../../constants/months";
import GDBookingsReport from "../reports/GDBookingsReport";

const GDBookings: FC = (): JSX.Element => {
  const [bookingsData, setBookingsData] = useState<AdminBookingsData>({
    bookings: [],
    facilities: [],
    users: [],
  });
  const [timeFilter, setTimeFilter] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(true);
  const [slug, setSlug] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [isPrint, setIsPrint] = useState<boolean>(false);

  const targetRef = useRef<HTMLDivElement>(null);

  const d = new Date();

  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: ["gdbookings"],
    queryFn: async () => {
      let url = `${import.meta.env.VITE_APP_SERVER_URL}/facility/bookings/gd`;

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

      if (selectedMonth) {
        if (selectValue) {
          url += `&month=${months.indexOf(selectedMonth) + 1}`;
        } else {
          url += `?month=${months.indexOf(selectedMonth) + 1}`;
        }
      }

      if (selectedYear) {
        if (selectValue || timeFilter || selectedMonth) {
          url += `&year=${selectedYear}`;
        } else {
          url += `?year=${selectedYear}`;
        }
      }

      if (selectedUser) {
        if (selectValue || timeFilter || selectedMonth || selectedYear) {
          url += `&user=${selectedUser}`;
        } else {
          url += `?user=${selectedUser}`;
        }
      }

      const response = await axios.get(url, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: enabled,
    refetchInterval: 5 * 1000,
    retry: 1,
    gcTime: 0,
  });

  useEffect(() => {
    selectedMonth && timeFilter && setTimeFilter(false);
  }, [selectedMonth, timeFilter]);

  useEffect(() => {
    if (!isPending) {
      setBookingsData(data);
    }
  }, [data, isPending]);

  useEffect(() => {
    if (isPrint) {
      setTimeout(() => {
        setIsPrint(false);
      }, 3000);
    }

    if (isPrint) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [isPrint]);

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
      <div className="w-[74vw] min-h-screen h-full flex flex-col items-center justify-center">
        <CircularProgress />
      </div>
    );

  const options: Options = {
    filename: "bookings-report.pdf",
    page: {
      orientation: "landscape",
    },
  };

  return (
    <div className="w-full flex flex-col px-6 pt-8 gap-6">
      <div className="w-full flex justify-between items-center">
        <Typography variant="h3" component="h1">
          Employee bookings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          endIcon={<DownloadIcon sx={{ height: "20px", width: "20px" }} />}
          sx={{ paddingX: "2em", height: "45px" }}
          size="large"
          onClick={() => {
            setIsPrint(true);
            setTimeout(() => {
              generatePDF(targetRef, options);
            }, 1000);
          }}
        >
          Export
        </Button>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-full flex gap-4 flex-wrap">
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
            onClick={() => {
              setSelectedMonth("");
              setTimeFilter(true);
            }}
          />
          <FormControl size="small" className="w-[150px]">
            <InputLabel>Select month</InputLabel>
            <Select
              label="Select month"
              size="small"
              value={selectedMonth}
              onChange={(e: SelectChangeEvent<string | null>) => {
                setSelectedMonth(e.target.value!);
              }}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" className="w-[150px]">
            <TextField
              id="year"
              label="Enter year"
              variant="outlined"
              className="w-full transition-all duration-200 ease-in"
              value={selectedYear}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelectedYear(e.target.value);
              }}
              size="small"
              autoComplete="off"
            />
          </FormControl>

          <FormControl size="small" className="w-[150px]">
            <InputLabel>Select facility</InputLabel>
            <Select
              label="Select facility"
              size="small"
              value={selectValue}
              onChange={(e: SelectChangeEvent<string | null>) => {
                setSelectValue(e.target.value!);
                setSlug(
                  bookingsData.facilities.find(
                    (facility) => facility.name === e.target.value
                  )!.slug
                );
              }}
            >
              {bookingsData.facilities.map((facility) => (
                <MenuItem key={facility.name} value={facility.name}>
                  {facility.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" className="w-[150px]">
            <InputLabel>Select user</InputLabel>
            <Select
              label="Select user"
              size="small"
              value={selectedUser}
              onChange={(e: SelectChangeEvent<string | null>) => {
                setSelectedUser(e.target.value!);
              }}
            >
              {bookingsData.users?.map((user) => (
                <MenuItem key={user.employeeId} value={user.employeeId}>
                  {user.employeeId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={() => {
              setSelectValue("");
              setSelectedMonth("");
              setTimeFilter(false);
              setSelectedYear("");
              setSelectedUser("");
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
      </div>
      {!isPending && <BookingsTable bookingsData={bookingsData.bookings} />}
      {isPrint && (
        <div className="mt-[100dvh]">
          <GDBookingsReport
            bookingsData={bookingsData.bookings}
            forwardedRef={targetRef}
          />
        </div>
      )}
    </div>
  );
};

export default GDBookings;
