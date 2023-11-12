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
import { FC, useEffect, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BookingsTable from "./tables/BookingsTable";
import generatePDF, { Margin, Options } from "react-to-pdf";
import DownloadIcon from "@mui/icons-material/Download";
import BookingsReport from "../reports/BookingsReport";
import ErrorComponent from "./Error";

const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "Octomber",
  "November",
  "December",
];

const Bookings: FC<ApprovalStatusProps> = ({ GD, FM }): JSX.Element => {
  const [bookingsData, setBookingsData] = useState<AdminBookingsData>({
    bookings: [],
    facilities: [],
  });
  const [timeFilter, setTimeFilter] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(true);
  const [slug, setSlug] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const targetRef = useRef<HTMLDivElement>(null);
  const [isPrint, setIsPrint] = useState<boolean>(false);

  const d = new Date();

  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: ["gd&fmbookings"],
    queryFn: async () => {
      let url = `http://localhost:3000/facility/bookings/${
        GD && !FM ? "gd" : "fm"
      }`;

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

      const response = await axios.get(url, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: enabled,
    refetchInterval: 20 * 1000,
    retry: 1,
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
      margin: Margin.SMALL,
    },
  };

  return (
    <div className="w-full flex flex-col px-12 pt-8 gap-6">
      <div className="w-full flex justify-between">
        <Typography variant="h3" component="h1">
          {GD && !FM ? "Employee" : "Facility"} bookings
        </Typography>
      </div>
      <div className="w-full flex justify-center items-center">
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
            onClick={() => {
              setSelectedMonth("");
              setTimeFilter(true);
            }}
          />
          <FormControl size="small" className="w-[200px]">
            <InputLabel>Select month</InputLabel>
            <Select
              label="Select a month"
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
          {GD && (
            <FormControl size="small" className="w-[200px]">
              <InputLabel>Select facility</InputLabel>
              <Select
                label="Select a facility"
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
          )}
          <Button
            variant="contained"
            onClick={() => {
              setSelectValue("");
              setSelectedMonth("");
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
      {!isPending && <BookingsTable bookingsData={bookingsData.bookings} />}
      {isPrint && (
        <div className="mt-[100dvh]">
          <BookingsReport
            bookingsData={bookingsData.bookings}
            forwardedRef={targetRef}
          />
        </div>
      )}
    </div>
  );
};

export default Bookings;
