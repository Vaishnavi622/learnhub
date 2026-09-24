import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <Link to="/">
          LearnHub
        </Link>
      </div>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>
        <Link to="/profile">
         Profile
         </Link>

        <Link to="/courses">
          Courses
        </Link>

        <Link to="/login">
          Login
        </Link>

        <Link to="/register">
          Register
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;