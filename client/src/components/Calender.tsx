import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  DateSelectArg,
  EventClickArg,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import { Alert, Button, Snackbar, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import AddEventModal from "./AddEventModal";
import EventModal from "./EventModal";
import isoToTime from "../utils/isoToTime";
import isoToDate from "../utils/isoToDate";
import Loader from "./Loader";

const Calendar: FC = (): JSX.Element => {
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [defaultDate, setDefaultDate] = useState<string | null>(null);

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
    refetchInterval: 5 * 1000,
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

  const handleSelect = (info: DateSelectArg): void => {
    setDefaultDate(info.startStr);
    setIsAddOpen(true);
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
        : "#039BE5";

    return (
      <div
        className={`px-1 min-w-[165px] rounded-sm flex flex-col text-white cursor-pointer`}
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

  if (isPending)
    return (
      <div className="w-[80%] h-full flex flex-col items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="w-[80%] h-full flex flex-col items-center justify-center px-0 py-12">
      {isAddOpen && (
        <AddEventModal
          isOpen={isAddOpen}
          setIsOpen={setIsAddOpen}
          setOpenSnackbar={setOpenSnackbar}
          setDefaultDate={setDefaultDate}
          bookingsData={bookingsData}
          defaultDate={defaultDate}
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
        <div className="flex gap-4 items-center">
          <Typography variant="h3" component="h1">
            Bookings Calender
          </Typography>
          <CalendarMonthIcon sx={{ width: "40px", height: "40px" }} />
        </div>
        <Button
          variant="contained"
          color="primary"
          endIcon={
            <InsertInvitationIcon sx={{ height: "20px", width: "20px" }} />
          }
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
          selectable={true}
          select={(info) => handleSelect(info)}
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
