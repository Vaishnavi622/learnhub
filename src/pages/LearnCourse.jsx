import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import courses from "../data/courses";

function LearnCourses() {

  const { id } = useParams();

  const course = courses.find(
    (course) => course.id === Number(id)
  );

  const lessons = [
    "Introduction",
    "Getting Started",
    "Basic Concepts",
    "Working with Components",
    "Practical Examples",
    "Building a Project"
  ];

  const [currentLesson, setCurrentLesson] = useState(0);

  const storageKey = `completedLessons_${id}`;

  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  });

  // Course not found
  if (!course) {
    return (
      <div className="not-found">

        <h1>Course Not Found</h1>

        <Link to="/courses">
          Back to Courses
        </Link>

      </div>
    );
  }

  // Mark lesson completed
  const markCompleted = () => {
    if (!completedLessons.includes(currentLesson)) {
      const updated = [...completedLessons, currentLesson];
      setCompletedLessons(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  // Next lesson
  const goNext = () => {

    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }

  };

  // Previous lesson
  const goPrevious = () => {

    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }

  };

  // Calculate progress
  const progress = Math.round(
    (completedLessons.length / lessons.length) * 100
  );

  return (
    <div className="learning-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="learning-header">

        <div>

          <Link
            to="/my-courses"
            className="back-link"
          >
            ← My Courses
          </Link>

          <h1>
            {course.title}
          </h1>

        </div>


        <div className="learning-progress">

          <span>
            Progress: {progress}%
          </span>

          <div className="learning-progress-bar">

            <div
              className="learning-progress-fill"
              style={{
                width: `${progress}%`
              }}
            >
            </div>

          </div>

        </div>

      </div>


      {/* =========================
          MAIN LEARNING AREA
      ========================= */}

      <div className="learning-content">

        {/* LEFT SIDE */}

        <main className="lesson-area">

          {/* Video */}

          <div className="video-container">

            <div className="video-placeholder">

              <div className="play-button">
                ▶
              </div>

              <p>
                Course Video
              </p>

              <small>
                Lesson {currentLesson + 1}
              </small>

            </div>

          </div>


          {/* Lesson Information */}

          <div className="lesson-information">

            <h2>
              {currentLesson + 1}.{" "}
              {lessons[currentLesson]}
            </h2>

            <p>
              Welcome to this lesson of{" "}
              <strong>
                {course.title}
              </strong>.
            </p>

            <p>
              Follow the lesson carefully and
              complete the activities to improve
              your understanding.
            </p>

          </div>


          {/* Buttons */}

          <div className="lesson-actions">

            <button
              onClick={goPrevious}
              disabled={currentLesson === 0}
              className="previous-btn"
            >
              ← Previous
            </button>


            <button
              onClick={markCompleted}
              className="complete-btn"
            >

              {completedLessons.includes(currentLesson)
                ? "✓ Completed"
                : "Mark as Completed"}

            </button>


            <button
              onClick={goNext}
              disabled={
                currentLesson === lessons.length - 1
              }
              className="next-btn"
            >
              Next →
            </button>

          </div>

        </main>


        {/* =========================
            RIGHT SIDEBAR
        ========================= */}

        <aside className="lesson-sidebar">

          <div className="sidebar-title">

            <h2>
              Course Content
            </h2>

            <p>
              {completedLessons.length} /{" "}
              {lessons.length} completed
            </p>

          </div>


          <div className="lesson-list">

            {lessons.map((lesson, index) => (

              <button
                key={index}
                className={`lesson-item ${
                  currentLesson === index
                    ? "active-lesson"
                    : ""
                }`}
                onClick={() =>
                  setCurrentLesson(index)
                }
              >

                <div className="lesson-number">

                  {completedLessons.includes(index)
                    ? "✓"
                    : index + 1}

                </div>


                <div className="lesson-name">

                  <span>
                    {lesson}
                  </span>

                  <small>
                    Lesson {index + 1}
                  </small>

                </div>

              </button>

            ))}

          </div>

        </aside>

      </div>

    </div>
  );
}

export default LearnCourses;