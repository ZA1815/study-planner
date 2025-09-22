import { useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddCourseForm from '../components/AddCourseForm';
import CourseItem from '../components/CourseItem';
import toast from 'react-hot-toast';

function Dashboard() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const nav = useNavigate();

    const {token} = useContext(AuthContext);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const url = `${import.meta.env.VITE_API_URL}/api/courses`;
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
        fetchCourses();
    }, [token]);

    const onCourseAddedFunc = (course) => {
        setCourses([...courses, course]);
    }

    const onCourseDeletedFunc = async (deleteID) => {
        if (window.confirm('Are you sure you want to delete this course and all its assignments?')) {
            try {
                setIsDeleting(true);
                const deletingToast = toast.loading('Deleting course...');

                const url = `${import.meta.env.VITE_API_URL}/api/courses/${deleteID}`;
                const config = {
                    headers: {
                        'x-auth-token': token
                    }
                }

                const response = await axios.delete(url, config);

                toast.success('Successfuly deleted course.', {id: deletingToast});
                setCourses(currentCourses => currentCourses.filter(course => course.id !== deleteID));
            }
            catch (err) {
                setError(err.response ? err.response.data.msg : 'Unknown error');
                toast.error('Error deleting course: ', {id: deletingToast});
            }
        }
    }

    const onCourseEditedFunc = (updatedCourse) => {
        setCourses(currentCourses => currentCourses.map(course => course.id === updatedCourse.id ? updatedCourse : course));
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-stone-600 mb-4">Courses:</h2>
            {isLoading && <p>Loading courses...</p>}

            {error && <p style={{color: 'red'}}>{error}</p>}

            {!isLoading && !error && (
                <>
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <CourseItem key={course.id} course={course} onDelete={onCourseDeletedFunc} onEdit={onCourseEditedFunc}/>
                        ))
                    ) : (
                        <p className='text-xl'>You haven't added any courses yet. Why not add some now?</p>
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