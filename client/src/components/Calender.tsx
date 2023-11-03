import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { EventClickArg, EventSourceInput } from "@fullcalendar/core/index.js";
import { Alert, Button, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import AddEventModal from "./AddEventModal";
import EventModal from "./EventModal";
import isoToTime from "../utils/isoToTime";
import isoToDate from "../utils/isoToDate";

const Calendar: FC = (): JSX.Element => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [bookingsData, setBookingsData] = useState<BookingDataProps[]>([]);
  const [eventInfo, setEventInfo] = useState<EventInfoProps>({
    title: "",
    purpose: "",
    start: "",
    end: "",
    date: "",
    requestBy: "",
  });
  const location = useLocation();
  const slug = location.pathname.split("/")[2];

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  const { data, isPending } = useQuery<BookingDataProps[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await axios.get<BookingDataProps[]>(
        `http://localhost:3000/facility/${slug}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (!isPending) {
      const newData = data?.map((booking) => {
        return { ...booking, id: booking.id.toString() };
      });
      setBookingsData(newData || []);
    }
  }, [data, isPending]);

  const handleEventClick = (info: EventClickArg): void => {
    const clickData = bookingsData.find(
      (event: BookingDataProps) => event.slug === info.event.extendedProps.slug
    ) as BookingDataProps;

    setEventInfo({
      title: clickData.title,
      purpose: clickData.purpose,
      start: clickData.start ? isoToTime(clickData.start!) : "",
      end: clickData.end ? isoToTime(clickData.end!) : "",
      date: isoToDate(clickData.date!),
      requestBy: clickData.requestedBy.name,
    });
    setIsOpen(true);
  };

  const handleEventContent: FC<EventContentProps> = (
    eventInfo
  ): JSX.Element => {
    const eventData = bookingsData.find(
      (event: BookingDataProps) =>
        event.slug === eventInfo.event.extendedProps.slug
    ) as BookingDataProps;

    const bgColor =
      eventData.status === "APPROVED_BY_FM" ||
      eventData.status === "APPROVED_BY_ADMIN"
        ? "#449c47"
        : "#f44336";

    return (
      <div
        className={`px-1 min-w-[160px] rounded-sm flex flex-col text-white cursor-pointer`}
        style={{
          backgroundColor: bgColor,
        }}
      >
        <Typography
          variant="body2"
          component="p"
          className="italic"
          sx={{ fontWeight: "bold" }}
        >
          {eventData.title}
        </Typography>
        <Typography variant="body2" component="p" className="italic w-full">
          {isoToTime(eventData.start!)} - {isoToTime(eventData.end!)}
        </Typography>
      </div>
    );
  };

  return (
    <div className="w-[80%] h-full flex flex-col items-center justify-center px-6 py-12">
      {isAddOpen && (
        <AddEventModal
          isOpen={isAddOpen}
          setIsOpen={setIsAddOpen}
          setOpenSnackbar={setOpenSnackbar}
          bookingsData={bookingsData}
        />
      )}
      {isOpen && (
        <EventModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          eventInfo={eventInfo}
        />
      )}
      <div className="w-[90%] flex justify-between items-center pb-2">
        <Typography variant="h3" component="h1">
          Bookings Calender
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ paddingX: "2em", height: "45px" }}
          size="large"
          onClick={() => setIsAddOpen(true)}
        >
          Add booking
        </Button>
      </div>
      <div className="w-[90%]">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={bookingsData as EventSourceInput}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          eventContent={() => handleEventContent}
          eventClick={(info) => handleEventClick(info)}
        />
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Booking requested successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Calendar;
