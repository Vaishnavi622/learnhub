import { useParams, useNavigate } from "react-router-dom";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Course data
  const courses = [
    {
      id: 1,
      title: "Complete React JS Course",
      instructor: "LearnHub",
      description:
        "Learn React JS from basics to advanced concepts and build modern, responsive web applications.",
      rating: "4.8",
      students: "1250",
      level: "Beginner",
      duration: "12 hours",
      lessons: 25,
      category: "Web Development",
    },

    {
      id: 2,
      title: "Java Programming",
      instructor: "LearnHub",
      description:
        "Learn Java programming from scratch and understand object-oriented programming concepts.",
      rating: "4.7",
      students: "980",
      level: "Beginner",
      duration: "15 hours",
      lessons: 30,
      category: "Programming",
    },

    {
      id: 3,
      title: "Python Programming",
      instructor: "LearnHub",
      description:
        "Learn Python programming from the basics to advanced concepts and build real-world projects.",
      rating: "4.9",
      students: "2100",
      level: "Beginner",
      duration: "14 hours",
      lessons: 28,
      category: "Programming",
    },

    {
      id: 4,
      title: "Node JS Complete Course",
      instructor: "LearnHub",
      description:
        "Learn Node JS and build powerful backend applications using JavaScript.",
      rating: "4.8",
      students: "870",
      level: "Intermediate",
      duration: "10 hours",
      lessons: 22,
      category: "Web Development",
    },

    {
      id: 5,
      title: "MySQL Database Course",
      instructor: "LearnHub",
      description:
        "Learn MySQL database concepts, SQL queries, relationships and database design.",
      rating: "4.7",
      students: "760",
      level: "Beginner",
      duration: "8 hours",
      lessons: 20,
      category: "Database",
    },

    {
      id: 6,
      title: "HTML and CSS",
      instructor: "LearnHub",
      description:
        "Learn HTML and CSS and create beautiful responsive websites from scratch.",
      rating: "4.9",
      students: "1800",
      level: "Beginner",
      duration: "9 hours",
      lessons: 24,
      category: "Web Development",
    },

    {
      id: 7,
      title: "Express JS",
      instructor: "LearnHub",
      description:
        "Learn Express JS and create REST APIs and backend applications with Node JS.",
      rating: "4.8",
      students: "650",
      level: "Intermediate",
      duration: "7 hours",
      lessons: 18,
      category: "Web Development",
    },

    {
      id: 8,
      title: "JavaScript Complete Course",
      instructor: "LearnHub",
      description:
        "Master JavaScript fundamentals, ES6 features, DOM manipulation and modern JavaScript.",
      rating: "4.9",
      students: "2300",
      level: "Beginner",
      duration: "16 hours",
      lessons: 35,
      category: "Programming",
    },
  ];

  // Find selected course
  const course = courses.find(
    (item) => item.id === Number(id)
  );

  // If course does not exist
  if (!course) {
    return (
      <div className="not-found">
        <h1>Course Not Found</h1>
        <p>The course you are looking for does not exist.</p>
        <button className="primary-btn" onClick={() => navigate("/courses")}>
          Back to Courses
        </button>
      </div>
    );
  }

  // Get enrolled courses from localStorage
  const rawEnrolled =
    JSON.parse(
      localStorage.getItem("enrolledCourses")
    ) || [];

  const enrolledIds = rawEnrolled.map((item) =>
    typeof item === "object" && item !== null ? item.id : Number(item)
  );

  // Check whether already enrolled
  const isEnrolled = enrolledIds.includes(course.id);

  // Enroll course
  const handleEnroll = () => {
    if (isEnrolled) {
      navigate("/my-courses");
      return;
    }

    const updatedCourses = [
      ...rawEnrolled,
      course,
    ];

    localStorage.setItem(
      "enrolledCourses",
      JSON.stringify(updatedCourses)
    );

    // Sync enrollment with backend API if user logged in
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser && storedUser.id) {
      fetch("http://localhost:5000/api/users/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {})
        },
        body: JSON.stringify({
          userId: storedUser.id,
          courseId: course.id,
        }),
      }).catch(() => {});
    }

    alert("Course enrolled successfully!");
    navigate("/my-courses");
  };

  // Start learning
  const handleStartLearning = () => {
    navigate(`/learn/${course.id}`);
  };

  return (
    <div className="course-details">

      {/* =========================
          COURSE HERO SECTION
      ========================= */}
      <section className="course-details-header">
        <div className="course-details-info">
          <span className="free-badge">
            FREE COURSE
          </span>

          <h1>{course.title}</h1>

          <p className="course-description">
            {course.description}
          </p>

          <div className="course-details-rating">
            <strong>⭐ {course.rating}</strong>
            <span>({course.students} students)</span>
          </div>

          <p style={{ marginTop: "14px" }}>
            Created by <strong>{course.instructor}</strong>
          </p>
        </div>
      </section>

      {/* =========================
          COURSE INFORMATION & SIDEBAR
      ========================= */}
      <div className="course-details-content">

        {/* LEFT SIDE CONTENT */}
        <div className="course-main">
          <h2>What You Will Learn</h2>

          <div className="learning-points">
            <p>✓ Understand the fundamentals</p>
            <p>✓ Learn important concepts step by step</p>
            <p>✓ Build real-world projects</p>
            <p>✓ Practice with hands-on exercises</p>
            <p>✓ Learn modern development techniques</p>
            <p>✓ Build a strong foundation</p>
          </div>

          <h2>About This Course</h2>
          <p className="course-description" style={{ color: "var(--slate-600)", marginBottom: "35px" }}>
            {course.description}
          </p>

          <h2>Course Curriculum</h2>
          <div className="lessons">
            {Array.from(
              { length: Math.min(course.lessons, 10) },
              (_, index) => (
                <div className="lesson" key={index}>
                  <span>{index + 1}</span>
                  <div>
                    <p>Lesson {index + 1}: Core Concepts & Practical Practice</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* RIGHT SIDE ENROLLMENT CARD */}
        <aside className="enrollment-card">
          <div className="course-preview">
            <span>FREE COURSE</span>
          </div>

          <h2>Free</h2>
          <p>Get full access to all lectures, code samples, and lessons.</p>

          {isEnrolled ? (
            <button
              className="enroll-btn enrolled-btn"
              onClick={handleStartLearning}
            >
              Start Learning
            </button>
          ) : (
            <button
              className="enroll-btn"
              onClick={handleEnroll}
            >
              Enroll for Free
            </button>
          )}

          <div className="course-meta">
            <p>📚 {course.lessons} Lessons</p>
            <p>⏱ {course.duration}</p>
            <p>📊 {course.level}</p>
            <p>📁 {course.category}</p>
            <p>⭐ {course.rating} Rating</p>
          </div>
        </aside>

      </div>

    </div>
  );
}

export default CourseDetails;