
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

import { fetchCourses } from "../slices/coursesSlice";
import { fetchUsers } from "../slices/usersSlice";

function AdminDashboard() {
  const dispatch = useDispatch();

  const {
    courses = [],
    loading: coursesLoading,
    error: coursesError,
  } = useSelector((state) => state.courses || {});

  const {
    users = [],
    loading: usersLoading,
    error: usersError,
  } = useSelector((state) => state.users || {});

  useEffect(() => {
    // Fetch dashboard data when the page loads
    dispatch(fetchCourses());
    dispatch(fetchUsers());

    // Refresh data every 5 seconds
    const interval = setInterval(() => {
      dispatch(fetchCourses());
      dispatch(fetchUsers());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const totalStudents = users.filter(
    (user) => user.role !== "ADMIN"
  ).length;

  const totalEnrollments = users.reduce((total, user) => {
    return total + (user.enrolledCourses?.length || 0);
  }, 0);

  const getEnrollmentCount = (courseId) => {
    return users.reduce((total, user) => {
      const enrolledCourses = user.enrolledCourses || [];

      const isEnrolled = enrolledCourses.some(
        (item) => String(item.courseId) === String(courseId)
      );

      return total + (isEnrolled ? 1 : 0);
    }, 0);
  };

  const loading = coursesLoading || usersLoading;
  const error = coursesError || usersError;

  if (loading && courses.length === 0 && users.length === 0) {
    return <p className="admin-loading">Loading dashboard...</p>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminNavbar />

        <div className="admin-content">
          <h2>Dashboard Overview</h2>
          <p>Welcome to your LearnHub administration panel.</p>

          {error && <p className="admin-error">{error}</p>}

          <div className="admin-stats">
            <div className="admin-stat-card">
              <h3>Total Students</h3>
              <h1>{totalStudents}</h1>
            </div>

            <div className="admin-stat-card">
              <h3>Total Courses</h3>
              <h1>{courses.length}</h1>
            </div>

            <div className="admin-stat-card">
              <h3>Total Enrollments</h3>
              <h1>{totalEnrollments}</h1>
            </div>
          </div>

          <div className="admin-section-header">
            <h2>Course Enrollment Overview</h2>

            <Link to="/admin/courses/add" className="admin-add-btn">
              + Add Course
            </Link>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Enrolled Students</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.category}</td>
                      <td>{course.level}</td>
                      <td>{getEnrollmentCount(course.id)}</td>
                      <td>
                        <Link
                          to={`/admin/courses/view/${course.id}`}
                          className="admin-view-btn"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No courses available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
