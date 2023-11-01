import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddEventModal from "./AddEventModal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { EventClickArg, EventSourceInput } from "@fullcalendar/core/index.js";
import EventModal from "./EventModal";
import { useLocation } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";

const handleEventContent: FC<EventContentProps> = (eventInfo): JSX.Element => {
  return (
    <div
      className={`px-1 w-full rounded-sm text-white cursor-pointer`}
      style={{
        backgroundColor: eventInfo.backgroundColor,
      }}
    >
      <i>{eventInfo.event.title}</i>
    </div>
  );
};

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
      (event: BookingDataProps) =>
        event.slug === info.event._def.extendedProps.slug
    ) as BookingDataProps;

    setEventInfo({
      title: clickData.title,
      purpose: clickData.purpose,
      start: clickData.start ? dayjs(clickData.start).format("hh:mm A") : "",
      end: clickData.end ? dayjs(clickData.end).format("hh:mm A") : "",
      date: new Date(clickData.date!).toDateString(),
      requestBy: clickData.requestedBy.name,
    });
    setIsOpen(true);
  };

  return (
    <div className="w-[80%] h-full flex flex-col items-center justify-center text-black px-6 py-12">
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
      <h1 className="uppercase">CALENDER</h1>
      <div className="w-[90%]">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={bookingsData as EventSourceInput}
          headerToolbar={{
            left: "prev,next,today,addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          eventContent={() => handleEventContent}
          eventClick={(info) => {
            handleEventClick(info);
          }}
          customButtons={{
            addEventButton: {
              text: "Add event",
              click: () => setIsAddOpen(true),
            },
          }}
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
          Event requested successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Calendar;
