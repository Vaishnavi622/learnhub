
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all courses from JSON Server
  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:3000/courses");

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Delete a course
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/courses/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      // Remove deleted course from the screen
      setCourses((prevCourses) =>
        prevCourses.filter((course) => String(course.id) !== String(id))
      );

      alert("Course deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminNavbar />

        <div className="admin-content">
          <h1>Manage Courses</h1>
          <p>View, update and delete courses in LearnHub.</p>

          <Link to="/admin/courses/add">
            <button className="add-course-btn">
              + Add New Course
            </button>
          </Link>

          {loading && <p>Loading courses...</p>}

          {error && <p className="error-message">{error}</p>}

          {!loading && !error && courses.length === 0 && (
            <p>No courses available. Add your first course!</p>
          )}

          {!loading && courses.length > 0 && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course Name</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.id}</td>
                      <td>{course.title}</td>
                      <td>{course.category}</td>
                      <td>{course.level}</td>
                      <td>{course.duration}</td>

                      <td>
                        <Link to={`/admin/courses/view/${course.id}`}>
                          <button>View</button>
                        </Link>

                        <Link to={`/admin/courses/edit/${course.id}`}>
                          <button>Edit</button>
                        </Link>

                        <button
                          onClick={() => handleDelete(course.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCourses;
