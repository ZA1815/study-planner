import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CourseItem({course}) {
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const nav = useNavigate();

    const {token} = useContext(AuthContext);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const url = `http://localhost:3001/api/courses/${course.id}/assignments`;
                const config = {
                    headers: {
                        'x-auth-token': token
                    }
                };

                const response = await axios.get(url, config);
                setAssignments(response.data);
            }
            catch (err) {
                setError(err.response ? err.response.data.msg : 'Unknown error');
            }
            finally {
                setIsLoading(false);
            }
        }

        if (token) {
            fetchAssignments();
        }
        else {
            setIsLoading(false);
            nav('/login');
        }
    }, [course.id, token, nav]);

    return (
        <div>
            <h3>Course: {course.name}</h3>
            {isLoading && <p>Loading assignments...</p>}

            {error && <p style={{color: 'red'}}>{error}</p>}

            {!isLoading && !error && (
                <ul>
                    {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <li key={assignment.id}>{assignment.name}</li>
                        ))
                    ) : (
                        <p>You haven't added any assignments yet.</p>
                    )}
                </ul>
            )}
        </div>
    );
}

export default CourseItem;