import { FC, FormEvent, useState } from "react";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { Button, Modal, TextField, Typography } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";

import "dayjs/locale/en-gb";

const AddEventModal: FC<AddEventModalProps> = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState<AddEventDataProps>({
    title: "",
    purpose: "",
    date: null,
    startTime: null,
    endTime: null,
    color: "red",
    slug: "",
    employeeId: "6632",
  });

  const mutation = useMutation({
    mutationFn: (data: AddEventDataProps) =>
      axios.post("http://localhost:3000/facility/facility-1", data, {
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
    const data: AddEventDataProps = {
      title: formData.title,
      purpose: formData.purpose,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      color: formData.color,
      employeeId: "6632",
      slug: `${formData.title.toLowerCase()}${formData.startTime}`,
    };
    mutation.mutate(data);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="w-[450px] h-[450px] bg-bgPrimary text-black p-10 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] rounded-md">
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
            onChange={(e) =>
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
            onChange={(e) =>
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
              <TimePicker
                label="Pick start time"
                value={formData.startTime}
                onChange={(newValue) =>
                  setFormData({
                    ...formData,
                    startTime: newValue ? dayjs(newValue).toISOString() : null,
                  })
                }
                sx={{ minWidth: "40% !important" }}
                slotProps={{ textField: { required: true, size: "small" } }}
              />
              <TimePicker
                label="Pick end time"
                value={formData.endTime}
                onChange={(newValue) =>
                  setFormData({
                    ...formData,
                    endTime: newValue ? dayjs(newValue).toISOString() : null,
                  })
                }
                sx={{ minWidth: "40% !important" }}
                slotProps={{ textField: { required: true, size: "small" } }}
              />
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
      </div>
    </Modal>
  );
};

export default AddEventModal;
