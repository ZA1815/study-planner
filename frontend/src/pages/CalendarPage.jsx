import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../context/AuthContext';

function CalendarPage() {
    const localizer = momentLocalizer(moment);

    const [assignments, setAssignments] = useState([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchAllAssignments = async () => {
            try {
                const url = 'http://localhost:3001/api/assignments/all';
                const config = {
                    headers: {
                        'x-auth-token': token
                    }
                }

                const response = await axios.get(url, config);
                const assignments = response.data;

                const formattedAssignments = assignments.map(assignment => ({
                    title: `${assignment.name} (${assignment.course_name})`,
                    start: new Date(assignment.due_date),
                    end: new Date(assignment.due_date),
                    allDay: true
                }));

                setAssignments(formattedAssignments);
            }
            catch (err) {
                console.error('Error fetching assignments: ', err);

            }
        };

        fetchAllAssignments();
    }, [token]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Assignment Calendar</h2>
            <div style={{height: 500}}>
                <Calendar localizer={localizer} events={assignments} startAccessor="start" endAccessor="end" />
            </div>
        </div>
    );
}

export default CalendarPage;