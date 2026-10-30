
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../slices/coursesSlice";
import { getUser, updateUser } from "../userApi";
import { toast, ToastContainer } from "react-toastify";
function CourseDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Get courses from Redux store
  const { courses, loading, error } = useSelector(
    (state) => state.courses
  );

  // Get logged-in user from Redux store
  const user = useSelector((state) => state.auth.user);

  // Component states
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Find the selected course
  const course = courses.find(
    (item) => String(item.id) === String(id)
  );

  // Fetch courses if they are not already available
  useEffect(() => {
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);

  // Check whether the logged-in user is enrolled
  useEffect(() => {
    async function checkEnrollment() {
      if (!user?.id) {
        setEnrolled(false);
        return;
      }

      try {
        const latestUser = await getUser(user.id);

        const enrolledCourses =
          latestUser.enrolledCourses || [];

        const alreadyEnrolled = enrolledCourses.some(
          (item) => String(item.courseId) === String(id)
        );

        setEnrolled(alreadyEnrolled);
      } catch (error) {
        console.error("Error checking enrollment:", error);
        setEnrolled(false);
      }
    }

    checkEnrollment();
  }, [id, user?.id]);

  // Enroll the logged-in user in the selected course
  async function handleEnroll() {
    if (!user?.id) {
      toast.info("Please login before enrolling in a course.");
      return;
    }

    if (!course) {
      return;
    }

    try {
      setEnrolling(true);

      // Get the latest user information from JSON Server
      const latestUser = await getUser(user.id);

      const enrolledCourses =
        latestUser.enrolledCourses || [];

      // Check whether the user has already enrolled
      const alreadyEnrolled = enrolledCourses.some(
        (item) => String(item.courseId) === String(course.id)
      );

      if (alreadyEnrolled) {
        setEnrolled(true);
        return;
      }

      // Create the new enrollment
      const newEnrollment = {
        courseId: course.id,
        progress: 0,
        completedLessons: [],
        enrolledAt: new Date().toISOString(),
      };

      // Update the user's enrollment list
      const updatedUser = {
        ...latestUser,
        enrolledCourses: [
          ...enrolledCourses,
          newEnrollment,
        ],
      };

      // Save the updated user to JSON Server
      await updateUser(updatedUser);

      setEnrolled(true);

      toast.success("Successfully enrolled in the course!");
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Unable to enroll. Please try again.");
    } finally {
      setEnrolling(false);
    }
  }

  // Loading state
  if (loading && courses.length === 0) {
    return (
      <div className="course-details">
        Loading course...
      </div>
    );
  }

  // Error state
  if (error && courses.length === 0) {
    return (
      <div className="course-details auth-error">
        {String(error)}
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="course-not-found">
        <h1>Course Not Found</h1>

        <Link to="/courses" className="secondary-btn">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="course-details">
      <header className="course-details-header">
        <div className="course-details-info">
          <Link to="/courses" className="back-link">
            ← Back to Courses
          </Link>

          <p>{course.category}</p>

          <h1>{course.title}</h1>

          <p className="course-description">
            {course.description ||
              `Explore ${course.title} with structured lessons and practical learning.`}
          </p>

          <div className="course-details-rating">
            <strong>★ {course.rating}</strong>
            <span>{course.level}</span>
            <span>{course.duration}</span>
          </div>
        </div>
      </header>

      <div className="course-details-content">
        <main className="course-main">
          <h2>What You Will Learn</h2>

          <div className="learning-points">
            {course.whatYouWillLearn?.length ? (
              course.whatYouWillLearn.map((item, index) => (
                <p key={index}>
                  <span>✓</span> {item}
                </p>
              ))
            ) : (
              <p>Learning outcomes will be added soon.</p>
            )}
          </div>

          <h2>Course Curriculum</h2>

          <div className="lessons">
            {course.lessons?.map((lesson, index) => (
              <div className="lesson" key={lesson.id}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <p>{lesson.title}</p>
                  <small>{lesson.description}</small>
                </div>

                <small>{lesson.duration}</small>
              </div>
            ))}
          </div>
        </main>

        <aside className="enrollment-card">
          <div className="course-preview">
            LEARNHUB
          </div>

          <h2>Free</h2>

          <p>Start learning at your own pace.</p>

          <div className="course-meta">
            <p>
              📚 {course.lessons?.length || 0} lessons
            </p>

            <p>⏱ {course.duration}</p>

            <p>⭐ {course.rating} rating</p>

            <p className="capitalize">
              {course.level} level
            </p>
          </div>

          <button
            onClick={handleEnroll}
            disabled={enrolled || enrolling}
            className={`enroll-btn ${
              enrolled ? "enrolled-btn" : ""
            }`}
          >
            {enrolling
              ? "Enrolling..."
              : enrolled
              ? "Already Enrolled"
              : "Enroll Now"}
          </button>

          {enrolled && (
            <Link
              to={`/learn/${course.id}`}
              className="continue-btn"
            >
              Start Learning
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}

export default CourseDetails;
