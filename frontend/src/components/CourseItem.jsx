import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddAssignmentForm from './AddAssignmentForm';
import AssignmentItem from './AssignmentItem';

function CourseItem({course, onDelete, onEdit}) {
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(course.name);
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

    const onAssignmentDeletedFunc = async (deleteID) => {
        try {
            const url = `http://localhost:3001/api/courses/${course.id}/assignments/${deleteID}`;
            const config = {
                headers: {
                    'x-auth-token': token
                }
            }

            const response = await axios.delete(url, config);
            setAssignments(currentAssignments => currentAssignments.filter(assignment => assignment.id !== deleteID));
        }
        catch (err) {
            setError(err.response ? err.response.data.msg : 'Unknown error');
        }
    }

    const onChangeFunc = (e) => {
        setEditText(e.target.value);
    }

    const onEditClick = async () => {
        if (isEditing) {
            try {
                const url = `http://localhost:3001/api/courses/${course.id}`
                const config = {
                    headers: {
                        'x-auth-token': token
                    }
                };
                const newName = {
                    name: editText
                };

                const response = await axios.put(url, newName, config);

                onEdit(response.data.data);
                setIsEditing(false);
            }
            catch (err) {
                console.error('Failed to update course: ', err);

                if (err.response) {
                    const status = err.response.status;
                    const msg = err.response.data.msg || 'An error occurred.';

                    if (status == 401) {
                        alert('Your session has expired. Please log in again.');
                        nav('/login');
                    }
                    else {
                        alert(`Error: ${msg}`);
                    }
                }
                else {
                    alert('Save failed, please check your network connection and try again.');
                }
            }
        }
        else {
            setIsEditing(true);
        }
    }

    const onAssignmentEditedFunc = (updatedAssignment) => {
        setAssignments(currentAssignments => currentAssignments.map(assignment => assignment.id === updatedAssignment.id ? updatedAssignment : assignment));
    }

    return (
        <div>
            {isEditing ? <input type="text" placeholder="Edit here..." value={editText} onChange={onChangeFunc} required /> : <h3>Course: {course.name}</h3>}
            <button onClick={onEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
            
            <button onClick={() => onDelete(course.id)}>Delete</button>
            {isLoading && <p>Loading assignments...</p>}

            {error && <p style={{color: 'red'}}>{error}</p>}

            {!isLoading && !error && (
                <ul>
                    {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <AssignmentItem key={assignment.id} course={course} assignment={assignment} onDelete={onAssignmentDeletedFunc} onEdit={onAssignmentEditedFunc} />
                    ))) : (
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