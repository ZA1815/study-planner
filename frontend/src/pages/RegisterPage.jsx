import { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
    const [userInfo, setUserInfo] = useState({username: '', email: '', password: ''});
    
    const onChangeFunc = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        });
    };

    const onSubmitFunc = async (e) => {
        e.preventDefault();
        
        try {
            const url = 'http://localhost:3001/api/users/sign-up';

            const response = await axios.post(url, userInfo);
            
            console.log('Registration successful: ', response.data);
            alert('Registration successful. Please log in.');
        }
        catch (err) {
            console.error('There was an error registering,', err.response.data);
            alert('Registration failed: ', err.response.data.msg);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={onSubmitFunc}>
                <div className="text-l mb-2">
                    <label className="font-bold">Username:</label>
                    <input className="w-75 block border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" type="text" placeholder=" johndoe123" name="username" value={userInfo.username} onChange={onChangeFunc} required />
                </div>
                <div className="text-l mb-2">
                    <label className="font-bold">Email:</label>
                    <input className="w-75 block border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" type="email" placeholder=" johndoe@example.com" name="email" value={userInfo.email} onChange={onChangeFunc} required />
                </div>
                <div className="text-l mb-2">
                    <label className="font-bold">Password:</label>
                    <input className="w-75 block border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" type="password" name="password" value={userInfo.password} onChange={onChangeFunc} required />
                </div>
                <button className="py-2 px-4 rounded bg-blue-300 hover:bg-blue-400" type="submit">Sign-up</button>
            </form>
        </div>
    )
}
export default RegisterPage;