import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
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

const colors = [
  "#D50000",
  "#F4511E",
  "#F6BF26",
  "#33B679",
  "#039BE5",
  "#7986CB",
  "#8E24AA",
];

const AddEventModal: FC<AddEventModalProps> = ({
  isOpen,
  setIsOpen,
  setOpenSnackbar,
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
  const slug = location.pathname.split("/")[2];

  const ColorPicker = (): JSX.Element => {
    return (
      <div
        id="color-picker"
        className="w-[60%] flex justify-center items-center gap-2"
      >
        {colors.map((color) => (
          <div
            key={color}
            className={`${
              formData.color === color && "scale-125"
            } w-6 h-6 rounded-full cursor-pointer transition-all duration-700 ease-in-out`}
            style={{ backgroundColor: color }}
            onClick={() => setFormData({ ...formData, color: color })}
          />
        ))}
      </div>
    );
  };

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
        setOpenSnackbar(true);
        mutation.mutate(data);
      }
    } else {
      setValidationError("All fields are required.");
    }
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
        <div className="bg-bgPrimary w-full max-w-[500px] px-10 py-14 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] rounded-md flex flex-col gap-4 shadow-cardHover">
          <Typography id="modal-modal-title" variant="h5" component="h2">
            New event
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
                className="w-full"
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
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{ padding: "0" }}
                >
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
                    slotProps={{
                      textField: {
                        required: true,
                        size: "small",
                      },
                    }}
                    defaultValue={dayjs().toISOString()}
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
            <div className="w-full flex items-center gap-6 pl-2 ">
              <label htmlFor="color-picker" className="text-[#666666]">
                Select a color:
              </label>
              <ColorPicker />
            </div>
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
        </div>
      </Modal>
    </>
  );
};

export default AddEventModal;
