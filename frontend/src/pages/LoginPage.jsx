import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
    const [userInfo, setUserInfo] = useState({identifier: '', password: ''});

    const {setToken} = useContext(AuthContext);

    const nav = useNavigate();

    const onChangeFunc = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        });
    };

    const onSubmitFunc = async (e) => {
        e.preventDefault();
        
        try {
            const url = 'http://localhost:3001/api/users/login'

            const response = await axios.post(url, userInfo);
            const genToken = response.data.token;

            setToken(genToken);
            alert('Login successful.');
            nav('/');
        }
        catch (err) {
            console.error(err.response.data);
            alert('Login failed: ' + err.response.data.error);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={onSubmitFunc}>
                <div className="text-l mb-2">
                    <label className="font-bold">Username/Email: </label>
                    <input className="w-75 block border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" type="text" placeholder=" johndoe123/johndoe@example.com" name="identifier" value={userInfo.identifier} onChange={onChangeFunc} required/>
                </div>
                <div className="text-l font-bold mb-2">
                    <label className="font-bold">Password:</label>
                    <input className="w-75 block border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" type="password" name="password" value={userInfo.password} onChange={onChangeFunc} required/>
                </div>
                <button className="py-2 px-4 rounded bg-blue-300 hover:bg-blue-400" type="submit">Login</button>
            </form>
        </div>
    )
}
export default LoginPage;