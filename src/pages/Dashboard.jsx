import { Link } from "react-router-dom";

function Dashboard() {

  const name = localStorage.getItem("userName");

  return (
    <div className="dashboard">

      <div className="dashboard-header">

        <h1>
          Welcome{ name ? `, ${name}` : "" }!
        </h1>

        <p>
          Continue your learning journey.
        </p>

      </div>

      <div className="stats">

        <div className="stat-card">
          <h2>0</h2>
          <p>Courses Enrolled</p>
        </div>

        <div className="stat-card">
          <h2>0</h2>
          <p>Courses Completed</p>
        </div>

        <div className="stat-card">
          <h2>0</h2>
          <p>Hours Learned</p>
        </div>

      </div>

      <div className="dashboard-section">

        <h2>Continue Learning</h2>

        <div className="empty-learning">

          <p>
            You haven't enrolled in any courses yet.
          </p>

          <Link to="/courses">
            <button className="primary-btn">
              Explore Courses
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;