import { FC, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddEventModal from "./AddEventModal";

function handleEventClick(clickInfo: unknown): void {
  console.log(clickInfo);
}

const handleEventContent: FC<EventContentProps> = (eventInfo): JSX.Element => {
  return (
    <div
      className={`px-1 w-full rounded-sm text-white cursor-pointer`}
      style={{
        backgroundColor: eventInfo.backgroundColor
          ? eventInfo.backgroundColor
          : "red",
      }}
    >
      <i>{eventInfo.event.title}</i>
    </div>
  );
};

const Calendar: FC = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-[80%] h-full flex flex-col items-center justify-center text-black px-6 pt-12">
      {isOpen && <AddEventModal isOpen={isOpen} setIsOpen={setIsOpen} />}
      <h1 className="uppercase">CALENDER</h1>
      <div className="w-[90%]">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={[
            {
              title: "ok",
              date: "2023-10-01",
              color: "black",
              start: "2023-10-01T10:30:00",
              end: "2023-10-01T12:30:00",
              requested_by: "user",
              allDay: false,
            },
            {
              title: "event 1",
              color: "red",
              start: "2023-10-01T10:00:00",
              end: "2023-10-01T12:30:00",
              allDay: false,
            },
            {
              title: "event 2",
              date: "2023-10-30",
              color: "red",
              allDay: false,
            },
            {
              title: "test",
              date: "2023-11-11T18:30:00.000Z",
              color: "blue",
              allDay: false,
            },
          ]}
          headerToolbar={{
            left: "prev,next,today,addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          // footerToolbar={{
          //   center: "addEventButton",
          // }}
          eventClick={handleEventClick}
          eventContent={handleEventContent}
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
