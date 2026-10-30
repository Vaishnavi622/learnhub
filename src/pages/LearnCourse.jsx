
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../slices/coursesSlice";
import { getUser, updateUser } from "../userApi";
import { ToastContainer } from "react-toastify";
function LearnCourse() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Get courses from Redux
  const { courses, loading, error } = useSelector(
    (state) => state.courses
  );

  // Get logged-in user from Redux
  const user = useSelector((state) => state.auth.user);

  // Find the selected course
  const course = courses.find(
    (item) => String(item.id) === String(id)
  );

  // Get lessons from the selected course
  const lessons = course?.lessons || [];

  // Component states
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [saving, setSaving] = useState(false);
  const [progressLoading, setProgressLoading] = useState(true);

  // Calculate progress percentage
  const progress =
    lessons.length > 0
      ? Math.round(
          (completedLessons.length / lessons.length) * 100
        )
      : 0;

  // Fetch courses if Redux does not contain them
  useEffect(() => {
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);

  // Fetch the user's saved course progress from JSON Server
  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      setProgressLoading(true);
      setCompletedLessons([]);
      setCurrentLesson(0);

      if (!user?.id || !course) {
        setProgressLoading(false);
        return;
      }

      try {
        // Get the latest user information
        const latestUser = await getUser(user.id);

        // Get the user's enrolled courses
        const enrolledCourses = latestUser.enrolledCourses || [];

        // Find the current course enrollment
        const enrollment = enrolledCourses.find(
          (item) => String(item.courseId) === String(course.id)
        );

        if (!enrollment) {
          if (!cancelled) {
            toast.info("Please enroll in this course first.");
          }
          return;
        }

        // Get completed lesson IDs from the API
        const savedLessons = enrollment.completedLessons || [];

        if (!cancelled) {
          setCompletedLessons(savedLessons);

          // Open the first incomplete lesson
          const firstIncompleteIndex = lessons.findIndex(
            (lesson) =>
              !savedLessons.some(
                (savedId) => String(savedId) === String(lesson.id)
              )
          );

          setCurrentLesson(
            firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex
          );
        }
      } catch (error) {
        console.error("Error loading progress:", error);
        if (!cancelled) {
         toast.error("Unable to load your course progress.");
        }
      } finally {
        if (!cancelled) {
          setProgressLoading(false);
        }
      }
    }

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [user?.id, course?.id]);

  // Mark the selected lesson as complete or incomplete
  async function toggleCompleted(lessonId) {
    if (!user?.id) {
      toast.info("Please login to save your progress.");
      return;
    }

    if (saving) {
      return;
    }

    try {
      setSaving(true);

      // Fetch the latest user data
      const latestUser = await getUser(user.id);

      const enrolledCourses = latestUser.enrolledCourses || [];

      // Find the selected course enrollment
      const enrollment = enrolledCourses.find(
        (item) => String(item.courseId) === String(course.id)
      );

      if (!enrollment) {
        toast.info("Please enroll in this course first.");
        return;
      }

      // Get existing completed lessons
      const previousCompleted = enrollment.completedLessons || [];

      // Check whether the lesson is already completed
      const isCompleted = previousCompleted.some(
        (item) => String(item) === String(lessonId)
      );

      // Add or remove the lesson ID
      const updatedCompleted = isCompleted
        ? previousCompleted.filter(
            (item) => String(item) !== String(lessonId)
          )
        : [...previousCompleted, lessonId];

      // Calculate updated progress
      const updatedProgress =
        lessons.length > 0
          ? Math.round(
              (updatedCompleted.length / lessons.length) * 100
            )
          : 0;

      // Update only the selected course enrollment
      const updatedEnrollments = enrolledCourses.map((item) =>
        String(item.courseId) === String(course.id)
          ? {
              ...item,
              completedLessons: updatedCompleted,
              progress: updatedProgress,
            }
          : item
      );

      // Create updated user object
      const updatedUser = {
        ...latestUser,
        enrolledCourses: updatedEnrollments,
      };

      // Save updated user information to JSON Server
      await updateUser(updatedUser);

      // Update React state after successful API update
      setCompletedLessons(updatedCompleted);

    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Unable to save your progress. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (loading && courses.length === 0) {
    return (
      <div className="learning-page">
        Loading course...
      </div>
    );
  }

  // Error state
  if (error && courses.length === 0) {
    return (
      <div className="learning-page">
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
          Browse Courses
        </Link>
      </div>
    );
  }

  // Wait until saved progress is loaded
  if (progressLoading) {
    return (
      <div className="learning-page">
        Loading your course progress...
      </div>
    );
  }

  // Get the currently selected lesson
  const selectedLesson = lessons[currentLesson];

  return (
    <div className="learning-page">
      <header className="learning-header">
        <div>
          <Link
            to={`/courses/${course.id}`}
            className="back-link"
          >
            ← Course Details
          </Link>

          <h1>{course.title}</h1>
        </div>

        <div className="learning-progress">
          <span>
            Progress: {progress}% ({completedLessons.length}/{lessons.length})
          </span>

          <div className="learning-progress-bar">
            <div
              className="learning-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="learning-content">
        <main className="lesson-area">
          {selectedLesson ? (
            <>
              <div className="video-container">
                <div className="video-placeholder">
                  <div className="play-button">▶</div>

                  <p>{selectedLesson.title}</p>

                  <small>
                    Video content will appear here
                  </small>
                </div>
              </div>

              <div className="lesson-information">
                <h2>{selectedLesson.title}</h2>

                <p>{selectedLesson.description}</p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {selectedLesson.duration}
                </p>

                <button
                  className={`enroll-btn ${
                    completedLessons.some(
                      (item) =>
                        String(item) === String(selectedLesson.id)
                    )
                      ? "enrolled-btn"
                      : ""
                  }`}
                  onClick={() => toggleCompleted(selectedLesson.id)}
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : completedLessons.some(
                        (item) =>
                          String(item) === String(selectedLesson.id)
                      )
                    ? "✓ Completed — Mark Incomplete"
                    : "Mark as Complete"}
                </button>

                <div className="lesson-actions">
                  <button
                    className="previous-btn"
                    disabled={currentLesson === 0}
                    onClick={() =>
                      setCurrentLesson((index) => index - 1)
                    }
                  >
                    ← Previous
                  </button>

                  <button
                    className="next-btn"
                    disabled={currentLesson === lessons.length - 1}
                    onClick={() =>
                      setCurrentLesson((index) => index + 1)
                    }
                  >
                    Next Lesson →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="lesson-information">
              <h2>No lessons available</h2>
            </div>
          )}
        </main>

        <aside className="lesson-sidebar">
          <div className="lesson-sidebar-header">
            <h2>Course Content</h2>
            <p>{lessons.length} lessons</p>
          </div>

          <div className="lesson-list">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.some(
                (item) => String(item) === String(lesson.id)
              );

              return (
                <button
                  key={lesson.id}
                  className={`lesson-item ${
                    currentLesson === index ? "active-lesson" : ""
                  }`}
                  onClick={() => setCurrentLesson(index)}
                >
                  <span className="lesson-number">
                    {isCompleted
                      ? "✓"
                      : String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="lesson-item-content">
                    <strong>{lesson.title}</strong>
                    <small>{lesson.duration}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default LearnCourse;
