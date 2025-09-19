import { useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

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

    return(
        <div>
            <h2>Courses:</h2>
            {isLoading && <p>Loading courses...</p>}

            {error && <p style={{color: 'red'}}>{error}</p>}

            {!isLoading && !error && (
                <ul>
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <li key={course.id}>{course.name}</li>
                        ))
                    ) : (
                        <p>You haven't added any courses yet.</p>
                    )}
                </ul>
            )}
        </div>
    );
}

export default Dashboard;