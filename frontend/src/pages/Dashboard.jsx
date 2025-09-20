import { useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddCourseForm from '../components/AddCourseForm';
import CourseItem from '../components/CourseItem'

function Dashboard() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const nav = useNavigate();

    const {token} = useContext(AuthContext);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const url = 'http://localhost:3001/api/courses';
                const config = {
                    headers: {
                        'x-auth-token': token
                    }
                };

                const response = await axios.get(url, config);
                setCourses(response.data);
            }
            catch (err) {
                setError(err.response ? err.response.data.msg : 'An error occurred');
            }
            finally {
                setIsLoading(false);
            }
        }

        if (token) {
            fetchCourses();
        }
        else {
            setIsLoading(false);
            nav('/login');
        }
    }, [token, nav]);

    const onCourseAddedFunc = (course) => {
        setCourses([...courses, course]);
    }

    const onCourseDeletedFunc = async (deleteID) => {
        try {
            const url = `http://localhost:3001/api/courses/${deleteID}`;
            const config = {
                headers: {
                    'x-auth-token': token
                }
            }

            const response = await axios.delete(url, config);
            setCourses(currentCourses => currentCourses.filter(course => course.id !== deleteID));
        }
        catch (err) {
            setError(err.response ? err.response.data.msg : 'Unknown error')
        }
    }

    const onCourseEditedFunc = (updatedCourse) => {
        setCourses(currentCourses => currentCourses.map(course => course.id === updatedCourse.id ? updatedCourse : course));
    }

    return (
        <div>
            <h2>Courses:</h2>
            {isLoading && <p>Loading courses...</p>}

            {error && <p style={{color: 'red'}}>{error}</p>}

            {!isLoading && !error && (
                <>
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <CourseItem key={course.id} course={course} onDelete={onCourseDeletedFunc} onEdit={onCourseEditedFunc}/>
                        ))
                    ) : (
                        <p>You haven't added any courses yet.</p>
                    )}
                </>
            )}
            <div>
                <AddCourseForm onCourseAdded={onCourseAddedFunc} />
            </div>
        </div>
    );
}

export default Dashboard;