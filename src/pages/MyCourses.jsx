
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../slices/coursesSlice";
import { getUser } from "../userApi";

function MyCourses() {
  const dispatch = useDispatch();

  // Get courses from Redux store
  const { courses, loading, error } = useSelector(
    (state) => state.courses
  );

  // Get logged-in user from Redux store
  const user = useSelector((state) => state.auth.user);

  // Store enrollment details fetched from JSON Server
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch courses if they are not already available
  useEffect(() => {
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);

  // Fetch the logged-in user's enrollment details
  useEffect(() => {
    async function loadMyCourses() {
      if (!user?.id) {
        setEnrolledCourses([]);
        setUserLoading(false);
        return;
      }

      try {
        setUserLoading(true);

        const latestUser = await getUser(user.id);

        setEnrolledCourses(latestUser.enrolledCourses || []);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setEnrolledCourses([]);
      } finally {
        setUserLoading(false);
      }
    }

    loadMyCourses();
  }, [user?.id]);

  // Match enrolled course IDs with courses from Redux
  const myCourses = courses
    .filter((course) =>
      enrolledCourses.some(
        (enrollment) =>
          String(enrollment.courseId) === String(course.id)
      )
    )
    .map((course) => {
      const enrollment = enrolledCourses.find(
        (item) =>
          String(item.courseId) === String(course.id)
      );

      return {
        ...course,
        completedLessons: enrollment?.completedLessons || [],
        progress: enrollment?.progress || 0,
      };
    });

  if (userLoading || (loading && courses.length === 0)) {
    return (
      <div className="my-courses-page">
        Loading your courses...
      </div>
    );
  }

  if (error && courses.length === 0) {
    return (
      <div className="my-courses-page auth-error">
        {String(error)}
      </div>
    );
  }

  return (
    <div className="my-courses-page">
      <header className="my-courses-header">
        <h1>My Learning</h1>
        <p>
          Track your progress and continue where you left off.
        </p>
      </header>

      {myCourses.length === 0 ? (
        <div className="no-enrolled-courses">
          <h2>You haven't enrolled in any courses yet.</h2>

          <p>
            Explore our courses and start learning something new.
          </p>

          <Link to="/courses" className="primary-btn">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="my-courses-grid">
          {myCourses.map((course) => {
            const totalLessons = course.lessons?.length || 0;

            // Calculate progress using completed lessons
            const completedCount = course.completedLessons.length;

            const progress = totalLessons
              ? Math.round(
                  (completedCount / totalLessons) * 100
                )
              : 0;

            return (
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

                  <h2>{course.title}</h2>

                  <p>
                    {course.description ||
                      `Continue your learning journey in ${course.title}.`}
                  </p>

                  <div className="progress-container">
                    <div className="progress-label">
                      <span>Course Progress</span>
                      <span>{progress}%</span>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <p>
                      {completedCount} completed lessons out of{" "}
                      {totalLessons} total lessons.
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyCourses;
