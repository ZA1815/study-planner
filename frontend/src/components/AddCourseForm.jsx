import { useState, useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AddCourseForm({ onCourseAdded }) {
    const [courseName, setCourseName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const nav = useNavigate();
    const {token} = useContext(AuthContext);

    const onChangeFunc = (e) => {
        setCourseName(e.target.value);
    };

    const onSubmitFunc = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        const submittingToast = toast.loading('Creating course...');

        try {
            const url = `${import.meta.env.VITE_API_URL}/api/courses`;

            const courseData = {
                name: courseName
            };

            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            
            const response = await axios.post(url, courseData, config);
            toast.success('Course added successfully.', {id: submittingToast});

            onCourseAdded(response.data);

            setCourseName('');
            console.log('Course created successfully: ', response.data);
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
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 mt-4">
            <h2 className="text-xl font-bold">Add Course Form:</h2>
            <form onSubmit={onSubmitFunc}>
                <div>
                    <label className="font-bold">Course Name:</label>
                    <input className="mb-4 block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" type="text" placeholder="Calculus I" name="courseName" value={courseName} onChange={onChangeFunc} required />
                </div>
                <button className="py-2 px-4 rounded bg-blue-300 hover:bg-blue-400" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating Course...' : 'Create Course'}</button>
            </form>
        </div>
    );
}

export default AddCourseForm;