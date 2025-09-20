import { useState, useEffect, useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function AddCourseForm({ onCourseAdded }) {
    const [courseName, setCourseName] = useState('');
    const {token} = useContext(AuthContext);

    const onChangeFunc = (e) => {
        setCourseName(e.target.value);
    };

    const onSubmitFunc = async (e) => {
        e.preventDefault();

        try {
            const url = 'http://localhost:3001/api/courses';

            const courseData = {
                name: courseName
            };

            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            
            const response = await axios.post(url, courseData, config);

            onCourseAdded(response.data);

            setCourseName('');
            console.log('Course created successfully: ', response.data);
        }
        catch (err) {
            console.error('Error creating course: ', err.response.data);
            alert('Error creating course: ' + (err.response.data.msg || 'Unknown error'));
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold">Add Course Form:</h2>
            <form onSubmit={onSubmitFunc}>
                <div>
                    <label className="font-bold">Course Name:</label>
                    <input className="mb-4 block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" type="text" placeholder="Calculus I" name="courseName" value={courseName} onChange={onChangeFunc} required />
                </div>
                <button className="py-2 px-4 rounded bg-blue-300 hover:bg-blue-400" type="submit">Create Course</button>
            </form>
        </div>
    );
}

export default AddCourseForm;