import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  Button,
  Grid,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import "dayjs/locale/en-gb";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "react-router-dom";

const AddEventModal: FC<AddEventModalProps> = ({
  isOpen,
  setIsOpen,
  bookingsData,
}): JSX.Element => {
  const auth = useAuth();
  const [formData, setFormData] = useState<AddEventDataProps>({
    title: "",
    purpose: "",
    date: null,
    start: "",
    end: "",
    color: "red",
    slug: "",
    employeeId: "",
  });
  const location = useLocation();
  const [validationError, setValidationError] = useState<string>("");
  const [availableEndTimes, setAvailableEndTimes] = useState<string[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const slug = location.pathname.split("/")[2];
  // const eightAM = dayjs().set("hour", 8).startOf("hour");

  const possibleTimeSlots: string[] = [];
  const minTime = dayjs().set("hour", 8).set("minute", 0);
  const maxTime = dayjs().set("hour", 17).set("minute", 0);
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
        dayjs(event.date).format("YYYY-MM-DD") ===
          dayjs(formData.date).format("YYYY-MM-DD") &&
        ((dayjs(event.start).format("hh:mm A")! <= selectedStartTime &&
          dayjs(event.end).format("hh:mm A") >= selectedStartTime) ||
          (dayjs(event.start).format("hh:mm A") <= selectedEndTime &&
            dayjs(event.end).format("hh:mm A") >= selectedEndTime))
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
    onSuccess: (data) => {
      console.log(data);
      setIsOpen(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (
      formData.start &&
      formData.end &&
      formData.title &&
      formData.purpose &&
      formData.color
    ) {
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
          color: formData.color,
          employeeId: auth?.user?.employeeId || "",
          slug: `${formData.title.toLowerCase()}${formData.date}`,
        };
        setValidationError("");
        setAvailableEndTimes([]);
        // Show a success snackbar
        setOpenSnackbar(true);
        mutation.mutate(data);
      }
    } else {
      setValidationError("All fields are required.");
    }
    // const data: AddEventDataProps = {
    //   title: formData.title,
    //   purpose: formData.purpose,
    //   date: formData.date,
    //   start: formData.start,
    //   end: formData.end,
    //   color: formData.color,
    //   employeeId: auth?.user?.employeeId || "",
    //   slug: `${formData.title.toLowerCase()}${formData.start}`,
    // };
    // mutation.mutate(data);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (formData.start) {
      updateAvailableEndTimes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.start]);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="bg-bgPrimary w-full max-w-[500px] text-black px-16 py-10 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] rounded-md">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New event
          </Typography>
          <form
            autoComplete="off"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
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
              className="w-full"
              value={formData.purpose}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              required
              size="small"
            />
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="en-gb"
            >
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Enter the date"
                  value={formData.date}
                  onChange={(newValue) =>
                    setFormData({
                      ...formData,
                      date: newValue ? dayjs(newValue).toISOString() : null,
                    })
                  }
                  disablePast={true}
                  className="w-full"
                  slotProps={{ textField: { required: true, size: "small" } }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker", "TimePicker"]}>
                <Select
                  value={formData.start}
                  onChange={(e: SelectChangeEvent<string | null>) => {
                    setFormData({ ...formData, start: e.target.value });
                  }}
                  placeholder="Select a start time"
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
                <Select
                  value={formData.end}
                  onChange={(e: SelectChangeEvent<string | null>) =>
                    setFormData({ ...formData, end: e.target.value })
                  }
                  placeholder="Select an end time"
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
              </DemoContainer>
            </LocalizationProvider>
            <div className="w-full flex items-center gap-6">
              <label htmlFor="color-picker">Select a color:</label>
              <input
                id="color-picker"
                name="color-picker"
                type="color"
                className="rounded-sm w-10 h-10 bg-bgPrimary"
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
            </div>
            <div className="w-full flex items-center gap-6">
              <Button
                type="submit"
                variant="contained"
                color="success"
                sx={{ minWidth: "40%" }}
              >
                Add
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ minWidth: "40%" }}
                onClick={() => setIsOpen(false)}
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
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
          >
            <Typography variant="body1" color="success">
              Event added
            </Typography>
          </Snackbar>
        </div>
      </Modal>
    </>
  );
};

export default AddEventModal;
