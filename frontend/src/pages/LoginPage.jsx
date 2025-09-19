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
        <div>
            <h2>Login</h2>
            <form onSubmit={onSubmitFunc}>
                <div>
                    <label>Username/Email:</label>
                    <input type="text" placeholder="johndoe123/johndoe@example.com" name="identifier" value={userInfo.identifier} onChange={onChangeFunc} required/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={userInfo.password} onChange={onChangeFunc} required/>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
export default LoginPage;