import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAuth } from "../hooks/useAuth";

import "dayjs/locale/en-gb";
import isoToDate from "../utils/isoToDate";
import isoToTime from "../utils/isoToTime";

const AddEventModal: FC<AddEventModalProps> = ({
  isOpen,
  setIsOpen,
  setOpenSnackbar,
  setDefaultDate,
  bookingsData,
  defaultDate,
}): JSX.Element => {
  const auth = useAuth();
  const [formData, setFormData] = useState<AddEventDataProps>({
    title: "",
    purpose: "",
    date: defaultDate ? dayjs(defaultDate) : null,
    start: "",
    end: "",
    slug: "",
    employeeId: null,
  });
  const location = useLocation();
  const [validationError, setValidationError] = useState<string>("");
  const [availableEndTimes, setAvailableEndTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null | undefined>(
    defaultDate ? dayjs(defaultDate) : null
  );
  const slug = location.pathname.split("/")[2];

  const possibleTimeSlots: string[] = [];
  const minTime = dayjs().set("hour", 0).set("minute", 0);
  const maxTime = dayjs().set("hour", 24).set("minute", 0);
  let currentTime = minTime;

  while (currentTime.isBefore(maxTime)) {
    const time: string = currentTime.format("hh:mm A");
    possibleTimeSlots.push(time);
    currentTime = currentTime.add(30, "minute"); // 30-minute intervals
  }

  const isTimeSlotOverlapping = (start: string, end: string) => {
    const selectedStartTime = possibleTimeSlots.find((time) => time === start);
    const selectedEndTime = possibleTimeSlots.find((time) => time === end);

    if (!selectedStartTime || !selectedEndTime) {
      return false;
    }

    for (const event of bookingsData) {
      if (
        isoToDate(event.date!) === isoToDate(formData.date) &&
        ((isoToTime(event.start!) <= selectedStartTime &&
          isoToTime(event.end!) >= selectedStartTime) ||
          (isoToTime(event.start!) <= selectedEndTime &&
            isoToTime(event.end!) >= selectedEndTime))
      ) {
        return true;
      }
    }
    return false;
  };

  const getAvailableTimeSlots = () => {
    const availableTimeSlots: string[] = [];
    for (const timeSlot of possibleTimeSlots) {
      if (!isTimeSlotOverlapping(timeSlot, formData.end!)) {
        availableTimeSlots.push(timeSlot);
      }
    }
    return availableTimeSlots;
  };

  const updateAvailableEndTimes = () => {
    const availableTimes = getAvailableTimeSlots();
    const index = availableTimes.findIndex((time) => time === formData.start);
    setAvailableEndTimes(availableTimes.slice(index + 1));
  };

  const mutation = useMutation({
    mutationFn: (data: AddEventDataProps) =>
      axios.post(`http://localhost:3000/facility/${slug}`, data, {
        withCredentials: true,
      }),
    onSuccess: () => {
      setIsOpen(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (formData.start && formData.end && formData.title && formData.purpose) {
      if (isTimeSlotOverlapping(formData.start, formData.end)) {
        setValidationError(
          "Selected time slot overlaps with an existing event."
        );
      } else {
        const selectedDate = dayjs(formData.date);
        const isoStartTime = dayjs(
          `${selectedDate.format("YYYY-MM-DD")} ${formData.start}`,
          "YYYY-MM-DD hh:mm A"
        ).toISOString();
        const isoEndTime = dayjs(
          `${selectedDate.format("YYYY-MM-DD")} ${formData.end}`,
          "YYYY-MM-DD hh:mm A"
        ).toISOString();

        const data: AddEventDataProps = {
          title: formData.title,
          purpose: formData.purpose,
          date: formData.date,
          start: isoStartTime,
          end: isoEndTime,
          employeeId: auth!.user!.employeeId!,
          slug: `${formData.title.toLowerCase()}${formData.date}`,
        };
        setValidationError("");
        setAvailableEndTimes([]);
        setOpenSnackbar(true);
        mutation.mutate(data);
      }
    } else {
      setValidationError("All fields are required.");
    }
  };

  const handleCancel = (): void => {
    setIsOpen(false);
    setFormData({
      title: "",
      purpose: "",
      date: null,
      start: "",
      end: "",
      slug: "",
      employeeId: null,
    });
  };

  useEffect(() => {
    if (formData.start) {
      updateAvailableEndTimes();
      setValidationError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.start]);

  useEffect(() => {
    if (validationError) {
      updateAvailableEndTimes();
      setFormData({ ...formData, start: "", end: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationError]);

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setDefaultDate(null);
        setIsOpen(false);
      }}
    >
      <div className="bg-bgPrimary w-full max-w-[500px] px-10 py-14 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] rounded-md flex flex-col gap-6 shadow-cardHover">
        <Typography id="modal-modal-title" variant="h4" component="h2">
          Create new booking
        </Typography>
        <form
          autoComplete="off"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <FormControl className="flex gap-4" size="small">
            <TextField
              id="title"
              label="Title"
              variant="outlined"
              className="w-full"
              value={formData.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              size="small"
            />
            <TextField
              id="purpose"
              label="Purpose"
              variant="outlined"
              className="w-full transition-all duration-200 ease-in"
              value={formData.purpose}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              required
              size="small"
              multiline
            />
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="en-gb"
            >
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Enter the date"
                  value={selectedDate && dayjs(selectedDate)}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                    setAvailableEndTimes([]);
                    setFormData({
                      ...formData,
                      date: newValue ? dayjs(newValue).toISOString() : null,
                      start: "",
                      end: "",
                    });
                  }}
                  disablePast={true}
                  className="w-full"
                  slotProps={{
                    textField: {
                      required: true,
                      size: "small",
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <div className="flex w-full gap-2">
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel id="start-time">Start time</InputLabel>
                <Select
                  value={formData.start}
                  onChange={(e: SelectChangeEvent<string | null>) => {
                    setFormData({ ...formData, start: e.target.value });
                  }}
                  label="Select a start time"
                  size="small"
                  required
                >
                  {formData.date && formData.date !== "" ? (
                    possibleTimeSlots.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">Please select a date</MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel id="start-time">End time</InputLabel>
                <Select
                  value={formData.end}
                  onChange={(e: SelectChangeEvent<string | null>) =>
                    setFormData({ ...formData, end: e.target.value })
                  }
                  label="Select an end time"
                  size="small"
                  required
                >
                  {formData.start && formData.start !== "" ? (
                    availableEndTimes.length > 0 ? (
                      availableEndTimes.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No available time slots</MenuItem>
                    )
                  ) : (
                    <MenuItem value="">Please select a start time</MenuItem>
                  )}
                </Select>
              </FormControl>
            </div>
          </FormControl>
          <div className="w-full flex items-center justify-between mt-2">
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ minWidth: "47%" }}
              size="large"
            >
              Add
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ minWidth: "47%" }}
              size="large"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
        {validationError && (
          <Grid item xs={12}>
            <Typography variant="body1" color="error">
              {validationError}
            </Typography>
          </Grid>
        )}
      </div>
    </Modal>
  );
};

export default AddEventModal;
