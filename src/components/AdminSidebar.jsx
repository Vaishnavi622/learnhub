import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-sidebar">
      <h2>LearnHub Admin</h2>

      <nav>
        <NavLink to="/admin">Dashboard</NavLink>
        <NavLink to="/admin/courses">Manage Courses</NavLink>
        <NavLink to="/admin/courses/add">Add Course</NavLink>
      </nav>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AdminSidebar;