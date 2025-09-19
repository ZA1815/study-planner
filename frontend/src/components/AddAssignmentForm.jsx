import {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function AddAssignmentForm({ onAssignmentAdded, course }) {
    const [assignmentData, setAssignmentData] = useState({name: '', dueDate: ''});
    const {token} = useContext(AuthContext);

    const onChangeFunc = (e) => {
        setAssignmentData({
            ...assignmentData,
            [e.target.name]: e.target.value
        })
    }

    const onSubmitFunc = async (e) => {
        e.preventDefault();

        try {
            const url = `http://localhost:3001/api/courses/${course.id}/assignments`;
            const config = {
                headers: {
                    'x-auth-token': token
                }
            }
            const response = await axios.post(url, assignmentData, config);

            onAssignmentAdded(response.data);

            setCourseData({name: '', dueDate: ''});

            console.log('Assignment created successfully: ', response.data);
            alert('Assignment created successfully.');
        }
        catch (err) {
            console.error('Error creating course: ', err.response.data);
            alert('Error creating course: ' + (err.response.data.msg || 'Unknown error'));
        }
    };

    return (
        <div>
            <h2>Add Assignment Form:</h2>
            <form onSubmit={onSubmitFunc}>
                <div>
                    <label>Assignment Name:</label>
                    <input type="text" placeholder="Sec. 6.1" name="name" value={assignmentData.name} onChange={onChangeFunc} required />
                </div>
                <div>
                    <label>Due Date:</label>
                    <input type="datetime-local" name="dueDate" value={assignmentData.dueDate} onChange={onChangeFunc} />
                </div>
                <button type="submit">Add Assignment</button>
            </form>
        </div>
    );
}

export default AddAssignmentForm;