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
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import generatePDF, { Margin, Options } from "react-to-pdf";
import DownloadIcon from "@mui/icons-material/Download";
import ErrorComponent from "./Error";
import { months } from "./constants/months";
import FMBookingsTable from "./tables/FMBookingsTable";
import FMBookingsReport from "../reports/FMBookingsReport";

const FMBookings: FC = (): JSX.Element => {
  const [bookingsData, setBookingsData] = useState<FMBookingsData>({
    bookings: [
      {
        bookings: [],
      },
    ],
    facilities: [],
  });
  const [timeFilter, setTimeFilter] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const targetRef = useRef<HTMLDivElement>(null);
  const [isPrint, setIsPrint] = useState<boolean>(false);

  const d = new Date();

  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: ["fmbookings"],
    queryFn: async () => {
      let url = `${import.meta.env.VITE_APP_SERVER_URL}/facility/bookings/fm`;

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
          Facility bookings
        </Typography>
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
            />
          </FormControl>

          <Button
            variant="contained"
            onClick={() => {
              setSelectValue("");
              setSelectedMonth("");
              setTimeFilter(false);
              setSelectedYear("");
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
      {!isPending && <FMBookingsTable bookingsData={bookingsData.bookings} />}
      {isPrint && (
        <div className="mt-[100dvh]">
          <FMBookingsReport
            bookingsData={bookingsData.bookings}
            forwardedRef={targetRef}
          />
        </div>
      )}
    </div>
  );
};

export default FMBookings;