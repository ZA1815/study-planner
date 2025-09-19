import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar () {
    const {token} = useContext(AuthContext);

    return(
        <nav>
            <Link to="/"><h1>Study Planner</h1></Link>
            <div>
                {token ? (<button>Logout</button>)
                : 
                (<>
                <Link to="/login">Login</Link>
                <Link to="/register">Sign-up</Link>
                </>)}
            </div>
        </nav>
    );
}

export default Navbar;