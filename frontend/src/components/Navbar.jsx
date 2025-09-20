import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar () {
    const {token, logout} = useContext(AuthContext);
    const nav = useNavigate();

    const onLogoutClick = () => {
        logout();
        nav('/login');
    }

    return(
        <nav className="bg-stone-950 text-stone-50 shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-6">
                <Link to="/">
                <h1 className="text-2xl font-bold">Study Planner</h1>
                </Link>
                {token && <Link className="py-2 px-4 rounded hover:bg-blue-600" to="/calendar">Calendar</Link>}
            </div>
            <div>
                {token ? 
                (
                <button onClick={onLogoutClick} className="font-bold py-2 px-4 rounded hover:bg-red-700">Logout</button>
                )
                : 
                (<div className="space-x-4">
                <Link className="py-2 px-4 rounded hover:bg-blue-600" to="/register">Sign-up</Link>
                <Link className="py-2 px-4 rounded hover:bg-blue-600" to="/login">Login</Link>
                </div>)}
            </div>
        </nav>
    );
}

export default Navbar;