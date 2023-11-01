import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddEventModal from "./AddEventModal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  EventClickArg,
  EventSourceInput,
  formatDate,
} from "@fullcalendar/core/index.js";
import EventModal from "./EventModal";
import { useLocation } from "react-router-dom";

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

  const [bookingsData, setBookingsData] = useState<BookingDataProps[]>([
    {
      id: "14",
      title: "time",
      slug: "time2023-11-01T07:00:00.000Z",
      purpose: "check time",
      color: "#00ccff",
      userId: 8,
      status: "APPROVED_BY_FM",
      createdAt: "2023-11-01T04:08:01.050Z",
      date: "2023-11-03T18:30:00.000Z",
      start: "2023-11-03T07:00:00.000Z",
      end: "2023-11-03T09:30:00.000Z",
      facilityId: 2,
      requestedBy: {
        name: "Batman",
        employeeId: "0011",
      },
    },
    {
      id: "5",
      title: "Design",
      slug: "design2023-10-30T08:30:00.000Z",
      purpose: "To design",
      color: "green",
      userId: 7,
      status: "APPROVED_BY_FM",
      createdAt: "2023-10-30T14:43:02.007Z",
      date: "2023-11-02T18:30:00.000Z",
      start: "2023-10-30T08:30:00.000Z",
      end: "2023-10-30T09:30:00.000Z",
      facilityId: 2,
      requestedBy: {
        name: "Ksi",
        employeeId: "6632",
      },
    },
    {
      id: "6",
      title: "Success",
      slug: "success2023-10-29T20:30:00.000Z",
      purpose: "tststs",
      color: "pink",
      userId: 7,
      status: "APPROVED_BY_FM",
      createdAt: "2023-10-30T15:53:44.521Z",
      date: "2023-10-30T18:30:00.000Z",
      start: "2023-10-29T20:30:00.000Z",
      end: "2023-10-30T09:45:00.000Z",
      facilityId: 2,
      requestedBy: {
        name: "Ksi",
        employeeId: "6632",
      },
    },
    {
      id: "4",
      title: "new Purpose",
      slug: "new-purpose234",
      purpose: "casual meet",
      color: "yellow",
      userId: 7,
      status: "APPROVED_BY_FM",
      createdAt: "2023-10-30T14:20:06.786Z",
      date: "2023-11-01T18:30:00.000Z",
      start: "2023-10-29T18:30:00.000Z",
      end: "2023-10-30T15:30:00.000Z",
      facilityId: 2,
      requestedBy: {
        name: "Ksi",
        employeeId: "6632",
      },
    },
    {
      id: "9",
      title: "new Purpose",
      slug: "new-purpose-4455666",
      purpose: "casual meet",
      color: "green",
      userId: 2,
      status: "APPROVED_BY_FM",
      createdAt: "2023-10-31T11:26:58.494Z",
      date: "2023-10-29T13:01:04.078Z",
      start: "2023-10-29T13:01:04.078Z",
      end: "2023-10-30T13:01:00.000Z",
      facilityId: 2,
      requestedBy: {
        name: "Sumith",
        employeeId: "1122",
      },
    },
  ]);
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

  // const { data, isPending } = useQuery<BookingDataProps[]>({
  //   queryKey: ["bookings"],
  //   queryFn: async () => {
  //     const response = await axios.get<BookingDataProps[]>(
  //       `http://localhost:3000/facility/${slug}`,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     return response.data;
  //   },
  // });

  // useEffect(() => {
  //   if (!isPending) {
  //     const newData = data?.map((booking) => {
  //       return { ...booking, id: booking.id.toString() };
  //     });
  //     setBookingsData(newData || []);
  //   }
  // }, [data, isPending]);

  const handleEventClick = (info: EventClickArg): void => {
    setEventInfo({
      title: info.event._def.title,
      purpose: info.event._def.extendedProps.purpose,
      start: info.event._instance!.range.start.toLocaleString().slice(11, 22),
      end: info.event._instance!.range.end.toLocaleString().slice(11, 22),
      date: info.event._instance!.range.start.toDateString(),
      requestBy: info.event._def.extendedProps.requestedBy.name,
    });
    setIsOpen(true);
  };

  return (
    <div className="w-[80%] h-full flex flex-col items-center justify-center text-black px-6 pt-12">
      {isAddOpen && (
        <AddEventModal
          isOpen={isAddOpen}
          setIsOpen={setIsAddOpen}
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
    </div>
  );
};

export default Calendar;
