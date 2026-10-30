import { Link } from "react-router-dom";

function CourseCard({ course }) {
  return (
    <article className="course-card">
      <div className="course-image">
        <span>{course.level}</span>
      </div>

      <div className="course-content">
        <p className="category">{course.category}</p>

        <h3>{course.title}</h3>

        <p className="description">
          {course.description ||
            `Learn the fundamentals of ${course.title} through practical lessons.`}
        </p>

        <div className="course-rating">
          <span>★ {course.rating}</span>
          <span>Course rating</span>
        </div>

        <div className="course-info">
          <span>◷ {course.duration}</span>
          <span>{course.lessons?.length || 0} lessons</span>
        </div>

        <Link
          to={`/courses/${course.id}`}
          className="view-course-btn"
        >
          View Course
        </Link>
      </div>
    </article>
  );
}

export default CourseCard;