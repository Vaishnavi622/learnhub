
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../slices/coursesSlice";
import { getUser } from "../userApi";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get logged-in user from Redux
  const user = useSelector((state) => state.auth.user);

  // Get courses from Redux
  const { courses, loading, error } = useSelector(
    (state) => state.courses
  );

  // Store enrollment details
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch courses
  useEffect(() => {
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);

  // Fetch user enrollment details
  useEffect(() => {
    async function loadUserData() {
      if (!user?.id) {
        setEnrolledCourses([]);
        setUserLoading(false);
        return;
      }

      try {
        setUserLoading(true);

        const latestUser = await getUser(user.id);

        setEnrolledCourses(
          latestUser.enrolledCourses || []
        );
      } catch (err) {
        console.error("Error fetching profile:", err);
        setEnrolledCourses([]);
      } finally {
        setUserLoading(false);
      }
    }

    loadUserData();
  }, [user?.id]);

  // User information
  const userName =
    user?.name || user?.username || "Student";

  const userEmail =
    user?.email || "student@example.com";

  // Match enrolled courses with course details
  const myCourses = courses
    .filter((course) =>
      enrolledCourses.some(
        (item) =>
          String(item.courseId) === String(course.id)
      )
    )
    .map((course) => {
      const enrollment = enrolledCourses.find(
        (item) =>
          String(item.courseId) === String(course.id)
      );

      const completedLessons =
        enrollment?.completedLessons || [];

      const totalLessons = course.lessons?.length || 0;

      const progress = totalLessons
        ? Math.round(
            (completedLessons.length / totalLessons) * 100
          )
        : 0;

      return {
        ...course,
        completedLessons,
        totalLessons,
        progress,
      };
    });

  // Learning statistics
  const completedCoursesCount = myCourses.filter(
    (course) => course.totalLessons > 0 &&
      course.progress === 100
  ).length;

  const avgProgress = myCourses.length
    ? Math.round(
        myCourses.reduce(
          (total, course) => total + course.progress,
          0
        ) / myCourses.length
      )
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

  if (userLoading || (loading && courses.length === 0)) {
    return (
      <div className="profile-page">
        Loading profile...
      </div>
    );
  }

  if (error && courses.length === 0) {
    return (
      <div className="profile-page auth-error">
        {String(error)}
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1>{userName}</h1>
          <p>{userEmail}</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">

        {/* Personal Information */}
        <div className="profile-card">
          <h2>Personal Information</h2>

          <div className="profile-row">
            <span>Name</span>
            <strong>{userName}</strong>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <strong>{userEmail}</strong>
          </div>
        </div>

        {/* Learning Statistics */}
        <div className="profile-card">
          <h2>Learning Statistics</h2>

          <div className="profile-stats">

            <div className="stat-box">
              <h3>{myCourses.length}</h3>
              <p>Enrolled Courses</p>
            </div>

            <div className="stat-box">
              <h3>{completedCoursesCount}</h3>
              <p>Completed Courses</p>
            </div>

            <div className="stat-box">
              <h3>{avgProgress}%</h3>
              <p>Average Progress</p>
            </div>

          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="profile-card">
          <h2>My Enrolled Courses</h2>

          {myCourses.length === 0 ? (
            <div className="no-enrolled-courses">
              <h3>No enrolled courses yet!</h3>

              <p>
                You haven't enrolled in any courses.
                Explore our courses and start learning.
              </p>

              <Link
                to="/courses"
                className="primary-btn"
              >
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="my-courses-grid">
              {myCourses.map((course) => (
                <article
                  className="my-course-card"
                  key={course.id}
                >
                  <div className="my-course-image">
                    LEARNHUB
                  </div>

                  <div className="my-course-content">
                    <p className="category">
                      {course.category}
                    </p>

                    <h3>{course.title}</h3>

                    <div className="progress-container">
                      <div className="progress-label">
                        <span>Course Progress</span>
                        <span>{course.progress}%</span>
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${course.progress}%`,
                          }}
                        />
                      </div>

                      <p>
                        {course.completedLessons.length} completed
                        lessons out of {course.totalLessons} total lessons.
                      </p>
                    </div>

                    <Link
                      to={`/learn/${course.id}`}
                      className="continue-btn"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="profile-card">
          <h2>Quick Links</h2>

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
          <h2>Account</h2>

          <p>Want to leave your account?</p>

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
