import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddAssignmentForm from './AddAssignmentForm';

function CourseItem({course, onDelete}) {
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

    const onAssignmentAddedFunc = (assignment) => {
        setAssignments([...assignments, assignment]);
    }

    const onAssignmentDeletedFunc = (deleteID) => {
        setAssignments(currentAssignments => currentAssignments.filter(assignment => assignment.id !== deleteID));
    }

    return (
        <div>
            <h3>Course: {course.name}</h3>
            <button onClick={() => onDelete(course.id)}>Delete</button>
            {isLoading && <p>Loading assignments...</p>}

            {error && <p style={{color: 'red'}}>{error}</p>}

            {!isLoading && !error && (
                <ul>
                    {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <>
                            <li key={assignment.id}>
                                {assignment.name}
                                {assignment.due_date ? ` | Due On: ${new Date(assignment.due_date).toLocaleDateString()}`
                                : ''}
                            </li>
                            <button onClick={() => onAssignmentDeletedFunc(assignment.id)}>Delete</button>
                            </>
                        ))
                    ) : (
                        <p>You haven't added any assignments yet.</p>
                    )}
                </ul>
            )}
            <div>
                <AddAssignmentForm onAssignmentAdded={onAssignmentAddedFunc} course={course}/>
            </div>
        </div>
    );
}

export default CourseItem;