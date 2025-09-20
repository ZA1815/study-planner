import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AssignmentItem({course, assignment, onDelete, onEdit}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({name: assignment.name, dueDate: ''});
    const [error, setError] = useState(null);
    const nav = useNavigate();

    const {token} = useContext(AuthContext);

    const onChangeFunc = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        })
    }

    const onEditClick = async () => {
        if (isEditing) {
            try {
                const url = `http://localhost:3001/api/courses/${course.id}/assignments/${assignment.id}`;
                const config = {
                    headers: {
                        'x-auth-token': token
                    }
                }
                const payload = {
                    ...editData,
                    dueDate: editData.dueDate || null
                };

                const response = await axios.put(url, payload, config);

                console.log(response.data.data);

                onEdit(response.data.data);
                setIsEditing(false);
            }
            catch (err) {
                console.error('failed to update assignment: ', err);

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

    return (
        <div className="flex justify-between items-center p-4 border border-gray-200">
            {isEditing ? <input className="w-75 block border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" type="text" placeholder="Edit here..." name="name" value={editData.name} onChange={onChangeFunc} required /> : <h3>{assignment.name}</h3>}
            {isEditing ? <input className="w-75 block border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" type="datetime-local" name="dueDate" value={editData.dueDate} onChange={onChangeFunc} /> : assignment.due_date ? ` | Due on: ${new Date(assignment.due_date).toLocaleDateString()}` : ''}
            <button className="mr-10 ml-10 py-2 px-4 rounded bg-emerald-300 hover:bg-emerald-600"onClick={onEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
            <button className="py-2 px-4 rounded bg-red-300 hover:bg-red-600" onClick={() => onDelete(assignment.id)}>Delete</button>
        </div>
        
    );
}

export default AssignmentItem;