import { useState } from 'react';

function RegisterPage() {
    const [userInfo, setUserInfo] = useState({username: '', email: '', password: ''});
    
    const onChangeFunc = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        });
    };

    const onSubmitFunc = (e) => {
        e.preventDefault();
        console.log('Form submitted with:', userInfo);
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