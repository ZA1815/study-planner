import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddAssignmentForm from './AddAssignmentForm';
import AssignmentItem from './AssignmentItem';
import toast from 'react-hot-toast';

function CourseItem({course, onDelete, onEdit}) {
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(course.name);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const nav = useNavigate();

    const {token} = useContext(AuthContext);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const url = `${import.meta.env.VITE_API_URL}/api/courses/${course.id}/assignments`;
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
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                setIsDeleting(true);
                const deletingToast = toast.loading('Deleting assignment...');

                const url = `${import.meta.env.VITE_API_URL}/api/courses/${course.id}/assignments/${deleteID}`;
                const config = {
                    headers: {
                        'x-auth-token': token
                    }
                }

                const response = await axios.delete(url, config);
                toast.success('Successfully deleted assignment.', {id: deletingToast});
                setAssignments(currentAssignments => currentAssignments.filter(assignment => assignment.id !== deleteID));
            }
            catch (err) {
                setError(err.response ? err.response.data.msg : 'Unknown error');
                toast.error('Error deleting assignment: ', {id: deletingToast});
            }
            finally {
                setIsDeleting(false);
            }
        }
    }

    const onChangeFunc = (e) => {
        setEditText(e.target.value);
    }

    const onEditClick = async () => {
        if (isEditing) {
            try {
                setIsSaving(true);
                const savingToast = toast.loading('Saving course...');

                const url = `${import.meta.env.VITE_API_URL}/api/courses/${course.id}`
                const config = {
                    headers: {
                        'x-auth-token': token
                    }
                };
                const newName = {
                    name: editText
                };

                const response = await axios.put(url, newName, config);

                toast.success('Successfully changed course.', {id: savingToast});

                onEdit(response.data.data);
                setIsEditing(false);
            }
            catch (err) {
                console.error('Failed to update course: ', err);

                if (err.response) {
                    const status = err.response.status;
                    const msg = err.response.data.msg || 'An error occurred.';

                    if (status == 401) {
                        toast.error('Your session has expired. Please log in again.', {id: savingToast});
                        nav('/login');
                    }
                    else {
                        toast.error(msg, {id: savingToast});
                    }
                }
                else {
                    toast.error('Save failed, please check your network connection and try again.', {id: savingToast});
                }
            }
            finally {
                setIsSaving(false);
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
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4 w-1/3">
                {isEditing ? <input className="text-xl font-bold" type="text" placeholder="Edit here..." value={editText} onChange={onChangeFunc} required /> : <h3 className="text-xl font-bold">Course: {course.name}</h3>}
                <button className="py-2 px-4 rounded bg-emerald-300 hover:bg-emerald-600" onClick={onEditClick}>{isEditing ? isSaving ? 'Saving...' : 'Save' : 'Edit'}</button>
                <button className="py-2 px-4 rounded bg-red-300 hover:bg-red-600" onClick={() => onDelete(course.id)} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete'}</button>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="flex-1">
                    <h4 className="font-semibold mb-2">Assignments:</h4>
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
                </div>
                <div className="w-full md:w-1/3 mt-6 md:mt-0">
                    <AddAssignmentForm onAssignmentAdded={onAssignmentAddedFunc} course={course}/>
                </div>
            </div>
        </div>
    );
}

export default CourseItem;