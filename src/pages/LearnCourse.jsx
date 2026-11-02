
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchCourses } from "../slices/coursesSlice";
import { getUser, updateUser } from "../userApi";

function LearnCourse() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { courses = [], loading, error } = useSelector(
    (state) => state.courses
  );

  const reduxUser = useSelector((state) => state.auth.user);

  // Restore user after browser refresh
  const [currentUser, setCurrentUser] = useState(reduxUser);

  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Use Redux user first, then localStorage
  useEffect(() => {
    if (reduxUser?.id) {
      setCurrentUser(reduxUser);
      return;
    }

    try {
      const savedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      setCurrentUser(savedUser);
    } catch {
      setCurrentUser(null);
    }
  }, [reduxUser]);

  // Find selected course
  const course = courses.find(
    (item) => String(item.id) === String(id)
  );

  const lessons = course?.lessons || [];

  // Calculate progress
  const progress =
    lessons.length > 0
      ? Math.round(
          (completedLessons.length / lessons.length) * 100
        )
      : 0;

  // Fetch courses
  useEffect(() => {
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);

  // Load saved progress from JSON Server
  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      setProgressLoading(true);
      setCompletedLessons([]);
      setCurrentLesson(0);
      setIsEnrolled(false);

      if (!currentUser?.id || !course) {
        setProgressLoading(false);
        return;
      }

      try {
        const latestUser = await getUser(currentUser.id);

        const enrolledCourses =
          latestUser.enrolledCourses || [];

        const enrollment = enrolledCourses.find(
          (item) =>
            String(item.courseId) === String(course.id)
        );

        if (!enrollment) {
          if (!cancelled) {
            setIsEnrolled(false);
            toast.info("Please enroll in this course first.");
          }
          return;
        }

        const savedLessons =
          enrollment.completedLessons || [];

        if (!cancelled) {
          // Restore completed lessons
          setCompletedLessons(savedLessons);
          setIsEnrolled(true);

          // Open first incomplete lesson
          const firstIncomplete = lessons.findIndex(
            (lesson) =>
              !savedLessons.some(
                (savedId) =>
                  String(savedId) === String(lesson.id)
              )
          );

          setCurrentLesson(
            firstIncomplete === -1 ? 0 : firstIncomplete
          );
        }
      } catch (err) {
        console.error("Progress loading error:", err);

        if (!cancelled) {
          toast.error("Unable to load saved progress.");
        }
      } finally {
        if (!cancelled) {
          setProgressLoading(false);
        }
      }
    }

    // Wait until course and user are available
    if (course && currentUser?.id) {
      loadProgress();
    } else if (!loading && (!currentUser?.id || !course)) {
      setProgressLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, course?.id, loading]);

  // Mark lesson complete or incomplete
  async function toggleCompleted(lessonId) {
    if (!currentUser?.id) {
      toast.info("Please login first.");
      return;
    }

    if (!isEnrolled) {
      toast.info("Please enroll in this course first.");
      return;
    }

    if (saving) return;

    try {
      setSaving(true);

      // Get latest user data
      const latestUser = await getUser(currentUser.id);

      const enrolledCourses =
        latestUser.enrolledCourses || [];

      const enrollment = enrolledCourses.find(
        (item) =>
          String(item.courseId) === String(course.id)
      );

      if (!enrollment) {
        setIsEnrolled(false);
        toast.error("Course enrollment not found.");
        return;
      }

      const previousCompleted =
        enrollment.completedLessons || [];

      const alreadyCompleted = previousCompleted.some(
        (item) => String(item) === String(lessonId)
      );

      // Add or remove completed lesson
      const updatedCompleted = alreadyCompleted
        ? previousCompleted.filter(
            (item) => String(item) !== String(lessonId)
          )
        : [...previousCompleted, lessonId];

      // Calculate percentage
      const updatedProgress =
        lessons.length > 0
          ? Math.round(
              (updatedCompleted.length / lessons.length) * 100
            )
          : 0;

      // Update enrollment
      const updatedEnrollments = enrolledCourses.map(
        (item) =>
          String(item.courseId) === String(course.id)
            ? {
                ...item,
                completedLessons: updatedCompleted,
                progress: updatedProgress,
              }
            : item
      );

      // Save to JSON Server
      const updatedUser = {
        ...latestUser,
        enrolledCourses: updatedEnrollments,
      };

      await updateUser(updatedUser);

      // Update frontend immediately
      setCompletedLessons(updatedCompleted);

      toast.success(
        alreadyCompleted
          ? "Lesson marked as incomplete."
          : "Lesson completed successfully!"
      );
    } catch (err) {
      console.error("Progress update error:", err);
      toast.error("Unable to save progress.");
    } finally {
      setSaving(false);
    }
  }

  // Loading
  if (loading && courses.length === 0) {
    return <div className="learning-page">Loading course...</div>;
  }

  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Course not found</h2>
        <Link to="/courses">Back to Courses</Link>
      </div>
    );
  }

  if (progressLoading) {
    return (
      <div className="learning-page">
        Loading your saved progress...
      </div>
    );
  }

  if (!currentUser?.id) {
    return (
      <div className="learning-page">
        <h2>Please log in to continue learning.</h2>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  const selectedLesson = lessons[currentLesson];

  const isCurrentLessonCompleted = selectedLesson
    ? completedLessons.some(
        (item) => String(item) === String(selectedLesson.id)
      )
    : false;

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
            Progress: {progress}% ({completedLessons.length}/
            {lessons.length} lessons)
          </span>

          <div className="learning-progress-bar">
            <div
              className="learning-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {progress === 100 && lessons.length > 0 && (
            <p>🎉 Congratulations! Course completed.</p>
          )}
        </div>
      </header>

      {!isEnrolled ? (
        <div className="lesson-information">
          <h2>You are not enrolled in this course.</h2>
          <Link
            to={`/courses/${course.id}`}
            className="continue-btn"
          >
            Enroll Now
          </Link>
        </div>
      ) : (
        <div className="learning-content">
          <main className="lesson-area">
            {selectedLesson ? (
              <>
                <div className="video-container">
                  {selectedLesson.videoUrl ? (
                    <video
                      key={selectedLesson.videoUrl}
                      controls
                      width="100%"
                      className="lesson-video"
                    >
                      <source src={selectedLesson.videoUrl} />
                      Your browser does not support video playback.
                    </video>
                  ) : (
                    <div className="video-placeholder">
                      <h2>{selectedLesson.title}</h2>
                      <p>Video content will appear here.</p>
                    </div>
                  )}
                </div>

                <div className="lesson-information">
                  <h2>{selectedLesson.title}</h2>

                  <p>{selectedLesson.description}</p>

                  <p>
                    <strong>Duration:</strong>{" "}
                    {selectedLesson.duration ||
                      `${selectedLesson.durationMinutes || 0} minutes`}
                  </p>

                  <button
                    className={`enroll-btn ${
                      isCurrentLessonCompleted
                        ? "enrolled-btn"
                        : ""
                    }`}
                    onClick={() =>
                      toggleCompleted(selectedLesson.id)
                    }
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : isCurrentLessonCompleted
                      ? "✓ Completed - Mark Incomplete"
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
                      disabled={
                        currentLesson === lessons.length - 1
                      }
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
              <h2>No lessons available.</h2>
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
                  (item) =>
                    String(item) === String(lesson.id)
                );

                return (
                  <button
                    key={lesson.id ?? index}
                    className={`lesson-item ${
                      currentLesson === index
                        ? "active-lesson"
                        : ""
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
                      <small>
                        {lesson.duration ||
                          `${lesson.durationMinutes || 0} minutes`}
                      </small>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default LearnCourse;
