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

            const response = await axios.post(url, formData);
            
            console.log('Registration successful: ', response.data);
            alert('Registration successful. Please log in.');
        }
        catch (err) {
            console.error('There was an error registering,', err.response.data);
            alert('Registration failed: ', err.response.data.msg);
        }
    }

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={onSubmitFunc}>
                <div>
                    <label>Username: </label>
                    <input type="text" placeholder="johndoe123" name="username" value={userInfo.username} onChange={onChangeFunc} required />
                </div>
                <div>
                    <label>Email: </label>
                    <input type="email" placeholder="johndoe@example.com" name="email" value={userInfo.email} onChange={onChangeFunc} required />
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" name="password" value={userInfo.password} onChange={onChangeFunc} required />
                </div>
                <button type="submit">Sign-up</button>
            </form>
        </div>
    )
}
export default RegisterPage;