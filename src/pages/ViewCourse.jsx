
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

function ViewCourse() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch selected course from JSON Server
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/courses/${id}`
        );

        if (!response.ok) {
          throw new Error("Course not found");
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminNavbar />

        <div className="admin-content">
          <Link to="/admin/courses">
            ← Back to Courses
          </Link>

          <h1>Course Details</h1>

          {loading && <p>Loading course details...</p>}

          {error && <p className="error-message">{error}</p>}

          {course && (
            <div className="course-details-container">

              {/* Course Image */}
              {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="course-details-image"
                />
              )}

              {/* Basic Details */}
              <h2>{course.title}</h2>

              <p>
                <strong>Category:</strong> {course.category}
              </p>

              <p>
                <strong>Level:</strong> {course.level}
              </p>

              <p>
                <strong>Duration:</strong> {course.duration}
              </p>

              <p>
                <strong>Rating:</strong> {course.rating || "Not rated"}
              </p>

              <p>
                <strong>Description:</strong>
                <br />
                {course.description}
              </p>

              {/* Learning Outcomes */}
              <h3>What You Will Learn</h3>

              {course.whatYouWillLearn?.length > 0 ? (
                <ul>
                  {course.whatYouWillLearn.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No learning outcomes added.</p>
              )}

              {/* Lessons */}
              <h3>Course Lessons</h3>

              {course.lessons?.length > 0 ? (
                course.lessons.map((lesson, index) => (
                  <div className="lesson-card" key={lesson.id || index}>
                    <h4>
                      {index + 1}. {lesson.title}
                    </h4>

                    <p>{lesson.description}</p>

                    <p>
                      <strong>Duration:</strong>{" "}
                      {lesson.durationMinutes || "Not specified"} minutes
                    </p>

                    {lesson.videoUrl && (
                      <video
                        width="100%"
                        controls
                        src={lesson.videoUrl}
                      >
                        Your browser does not support video playback.
                      </video>
                    )}
                  </div>
                ))
              ) : (
                <p>No lessons added.</p>
              )}

              {/* Edit Button */}
              <Link to={`/admin/courses/edit/${course.id}`}>
                <button className="edit-course-btn">
                  Edit Course
                </button>
              </Link>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewCourse;
