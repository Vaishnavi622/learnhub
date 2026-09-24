import { Link, useNavigate } from "react-router-dom";

function Profile() {

  const navigate = useNavigate();

  const enrolledCourses =
    JSON.parse(
      localStorage.getItem("enrolledCourses")
    ) || [];

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const userName =
    localStorage.getItem("userName") || storedUser.name || storedUser.username || "Student";

  const userEmail =
    localStorage.getItem("userEmail") || storedUser.email || "student@example.com";

  // Calculate dynamic stats
  let totalProgress = 0;
  let completedCoursesCount = 0;

  enrolledCourses.forEach((course) => {
    const courseId = typeof course === "object" && course !== null ? course.id : course;
    const lessons = JSON.parse(localStorage.getItem(`completedLessons_${courseId}`)) || [];
    const prog = Math.min(100, Math.round((lessons.length / 6) * 100));
    totalProgress += prog;
    if (prog >= 100) completedCoursesCount++;
  });

  const avgProgress = enrolledCourses.length > 0
    ? Math.round(totalProgress / enrolledCourses.length)
    : 0;

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };


  return (

    <div className="profile-page">

      {/* Profile Header */}

      <div className="profile-header">

        <div className="profile-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>

        <div>

          <h1>
            {userName}
          </h1>

          <p>
            {userEmail}
          </p>

        </div>

      </div>


      {/* Profile Content */}

      <div className="profile-content">


        {/* Personal Information */}

        <div className="profile-card">

          <h2>
            Personal Information
          </h2>

          <div className="profile-row">

            <span>
              Name
            </span>

            <strong>
              {userName}
            </strong>

          </div>


          <div className="profile-row">

            <span>
              Email
            </span>

            <strong>
              {userEmail}
            </strong>

          </div>

        </div>


        {/* Learning Statistics */}

        <div className="profile-card">

          <h2>
            Learning Statistics
          </h2>


          <div className="profile-stats">


            <div className="stat-box">

              <h3>
                {enrolledCourses.length}
              </h3>

              <p>
                Enrolled Courses
              </p>

            </div>


            <div className="stat-box">

              <h3>
                {completedCoursesCount}
              </h3>

              <p>
                Completed Courses
              </p>

            </div>


            <div className="stat-box">

              <h3>
                {avgProgress}%
              </h3>

              <p>
                Average Progress
              </p>

            </div>


          </div>

        </div>


        {/* Quick Links */}

        <div className="profile-card">

          <h2>
            Quick Links
          </h2>


          <div className="profile-links">

            <Link to="/my-courses">
              My Courses
            </Link>

            <Link to="/courses">
              Explore Courses
            </Link>

          </div>

        </div>


        {/* Logout */}

        <div className="profile-card logout-card">

          <h2>
            Account
          </h2>

          <p>
            Want to leave your account?
          </p>

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>


      </div>

    </div>

  );

}

export default Profile;