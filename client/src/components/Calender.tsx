import { FC, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddEventModal from "./AddEventModal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { EventSourceInput } from "@fullcalendar/core/index.js";

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
  const [isOpen, setIsOpen] = useState(false);
  const [bookingsData, setBookingsData] = useState<BookingDataProps[]>();

  const { data, isPending } = useQuery<BookingDataProps[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await axios.get<BookingDataProps[]>(
        "http://localhost:3000/facility/facility-1",
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
  });
  console.log(data);

  useEffect(() => {
    if (!isPending) {
      const newData = data?.map((booking) => {
        return { ...booking, id: booking.id.toString() };
      });
      setBookingsData(newData || []);
    }
  }, [data, isPending]);

  return (
    <div className="w-[80%] h-full flex flex-col items-center justify-center text-black px-6 pt-12">
      {isOpen && <AddEventModal isOpen={isOpen} setIsOpen={setIsOpen} />}
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
          customButtons={{
            addEventButton: {
              text: "Add event",
              click: () => setIsOpen(true),
            },
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
