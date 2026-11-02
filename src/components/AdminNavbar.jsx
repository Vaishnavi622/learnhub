import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

  const adminEmail = "admin@learnhub.com";

  return (
    <header className="admin-navbar">
      <div>
        <h3>Admin Dashboard</h3>
        <p>Manage your LearnHub platform</p>
      </div>

      <div className="admin-navbar-user">
        <span>{adminEmail}</span>
        <div className="admin-avatar">A</div>
      </div>
    </header>
  );
}

export default AdminNavbar;