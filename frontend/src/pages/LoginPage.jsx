import { useState } from 'react';

function LoginPage() {
    const [userInfo, setUserInfo] = useState({identifier: '', password: ''});

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