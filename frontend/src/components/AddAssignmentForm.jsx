import {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AddAssignmentForm({ onAssignmentAdded, course }) {
    const [assignmentData, setAssignmentData] = useState({name: '', dueDate: ''});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {token} = useContext(AuthContext);
    const nav = useNavigate();

    const onChangeFunc = (e) => {
        setAssignmentData({
            ...assignmentData,
            [e.target.name]: e.target.value
        })
    }

    const onSubmitFunc = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        const submittingToast = toast.loading('Creating assignment...');

        try {
            const url = `${import.meta.env.VITE_API_URL}/api/courses/${course.id}/assignments`;
            const config = {
                headers: {
                    'x-auth-token': token
                }
            }
            const payload = {
                ...assignmentData,
                dueDate: assignmentData.dueDate || null
            };
            const response = await axios.post(url, payload, config);

            toast.success('Assignment created successfully.', {id: submittingToast});

            onAssignmentAdded(response.data);

            setCourseData({name: '', dueDate: ''});

            console.log('Assignment created successfully: ', response.data);
        }
        catch (err) {
            console.error('Error creating course: ', err.response.data);

            if (err.response.status == 401) {
                toast.error('Please login again.', {id: submittingToast});
                return nav('/login');
            }

            const message = 'Error creating course: ' + (err.response.data.msg || 'Unknown error');
            toast.error(message, {id: submittingToast});
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold">Add Assignment Form:</h2>
            <form onSubmit={onSubmitFunc}>
                <div>
                    <label className="font-bold">Assignment Name:</label>
                    <input className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" type="text" placeholder="Sec. 6.1" name="name" value={assignmentData.name} onChange={onChangeFunc} required />
                </div>
                <div>
                    <label className="font-bold">Due Date:</label>
                    <input className="mb-4 block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" type="datetime-local" name="dueDate" value={assignmentData.dueDate} onChange={onChangeFunc} />
                </div>
                <button className="py-2 px-4 rounded bg-blue-300 hover:bg-blue-400" type="submit" disabled={isSubmitting}>Add Assignment</button>
            </form>
        </div>
    );
}

export default AddAssignmentForm;