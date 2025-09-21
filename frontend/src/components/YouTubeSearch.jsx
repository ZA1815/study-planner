import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';
import Modal from "./Modal";

function YouTubeSearch({assignment}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const {token} = useContext(AuthContext);

    useEffect(() => {
        if (!isModalOpen) {
            return;
        }

        const fetchVideos = async () => {
            setIsLoading(true);
            
            try {
                const url = `http://localhost:3001/api/youtube/search?query=${encodeURIComponent(assignment.name)}`;
                const config = {
                    headers: {
                        'x-auth-token': token
                    }
                }

                const response = await axios.get(url, config);
                setVideos(response.data);
            }
            catch (err) {
                console.error('Error fetching videos: ', err)
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchVideos();
    }, [isModalOpen, token, assignment.name]);

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setVideos([]);
    }

    return (
        <>
        <button className="bg-blue-500 text-white py-1 px-2 rounded tex-sm hover:bg-blue-600" onClick={openModal}>Find Resources</button>
        <Modal title={`YouTube Resources for ${assignment.name}`} isOpen={isModalOpen} onClose={closeModal}>
            {isLoading ? (<p>Loading videos...</p>)
            : (
                <ul>
                    {videos.map(video => (
                        <li key={video.id.videoId} className="mb-2 border-b pb-2">
                            <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{video.snippet.title}</a>
                        </li>
                    ))}
                </ul>
            )}
        </Modal>
        </>
    );
}

export default YouTubeSearch;