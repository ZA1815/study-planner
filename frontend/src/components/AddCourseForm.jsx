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
        <div>
            <h2>Add Course Form:</h2>
            <form onSubmit={onSubmitFunc}>
                <div>
                    <label>Name:</label>
                    <input type="text" placeholder="Calculus I" name="courseName" value={courseName} onChange={onChangeFunc} required />
                </div>
                <button type="submit">Create Course</button>
            </form>
        </div>
    );
}

export default AddCourseForm;