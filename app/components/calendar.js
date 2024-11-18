import React, { useEffect, useState } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotMonth, DayPilotNavigator, DayPilotPopover } from "@daypilot/daypilot-lite-react";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Calendar = () => {
  const [view, setView] = useState("Week");
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [events, setEvents] = useState([]);
  const [dayView, setDayView] = useState();
  const [weekView, setWeekView] = useState();
  const [monthView, setMonthView] = useState();

  const router = useRouter(); // To route to event details page

  const onTimeRangeSelected = async (args) => {
    const dp = args.control;
    const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    dp.clearSelection();
    if (modal.canceled) {
      return;
    }
    const e = {
      start: args.start,
      end: args.end,
      text: modal.result
    };
    setEvents([...events, e]);
  };

  // Fetch events from FastAPI backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/events');
        const eventData = response.data.map(event => ({
          id: event.eventId,
          text: event.eventName,
          start: new DayPilot.Date(event.startDate),
          end: new DayPilot.Date(event.endDate),
          description: event.description, // Additional event data
          backColor: event.requiredbooking ? "#76a5af" : "#93c47d"
        }));
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col mx-auto p-6 bg-gray-100 rounded-lg shadow-lg w-4/5 h-1/2">
      {/* Toolbar for selecting day, week, or month */}
      <div className="flex justify-between mb-4">
        <div className="space-x-4">
          <button
            onClick={() => setView("Day")}
            className={`px-4 py-2 rounded-lg text-white ${view === "Day" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            Day
          </button>
          <button
            onClick={() => setView("Week")}
            className={`px-4 py-2 rounded-lg text-white ${view === "Week" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            Week
          </button>
          <button
            onClick={() => setView("Month")}
            className={`px-4 py-2 rounded-lg text-white ${view === "Month" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            Month
          </button>
        </div>
        <button
          onClick={() => setStartDate(DayPilot.Date.today())}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
        >
          Today
        </button>
      </div>

      {/* Main content container with flex for horizontal layout */}
      <div className="flex">
        {/* DayPilotNavigator on the left */}
        <div className="w-1/4">
          <DayPilotNavigator
            selectMode={view}
            showMonths={3}
            skipMonths={3}
            onTimeRangeSelected={args => setStartDate(args.day)}
            events={events}
          />
        </div>

        {/* Calendar on the right */}
        <div className="w-3/4">
          <DayPilotCalendar
            viewType={"Day"}
            startDate={startDate}
            events={events}
            visible={view === "Day"}
            durationBarVisible={false}      
            onTimeRangeSelected={onTimeRangeSelected}
            controlRef={setDayView}
            onEventClick={(args) => router.push(`/events/${args.e.data.id}`)} // Route to event details
            onEventHover={(args) => new DayPilotPopover({ target: args.e, content: args.e.data.description })} // Pop-up for event details
          />
          <DayPilotCalendar
            viewType={"Week"}
            startDate={startDate}
            events={events}
            visible={view === "Week"}
            durationBarVisible={false}
            businessBeginsHour={8}
            businessEndsHour={22}
            timeHeaders={[
              { groupBy: "Day", format: "dddd d MMMM yyyy" },
              { groupBy: "Hour" }
            ]}
            timeRangeSelectedHandling={"Disabled"} // Disable selection outside of the view
            scrollToHour={8} // Set the initial scroll position to 8:00 AM
            heightSpec={"BusinessHoursNoScroll"} // Restrict the height to show only business hours
            onTimeRangeSelected={onTimeRangeSelected}
            controlRef={setWeekView}
            onEventClick={(args) => router.push(`/events/${args.e.data.id}`)}
            onEventHover={(args) => new DayPilotPopover({ target: args.e, content: args.e.data.description })}  
          />
          <DayPilotMonth
            startDate={startDate}
            events={events}
            visible={view === "Month"}
            eventBarVisible={false}
            onTimeRangeSelected={onTimeRangeSelected}
            controlRef={setMonthView}
            onEventClick={(args) => router.push(`/events/${args.e.data.id}`)}
            onEventHover={(args) => new DayPilotPopover({ target: args.e, content: args.e.data.description })}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
