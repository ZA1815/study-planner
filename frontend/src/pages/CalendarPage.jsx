import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment';

const localizer = momentLocalizer(moment);

function CalendarPage() {
    const eventsList = [];

    return(
        <div>
            <h2 className="text-2xl font-bold mb-4">Assignment Calendar</h2>
            <div style={{height: 500}}>
                <Calendar localizer={localizer} events={eventsList} startAccessor="start" endAccessor="end" />
            </div>
        </div>
    );
}

export default CalendarPage;