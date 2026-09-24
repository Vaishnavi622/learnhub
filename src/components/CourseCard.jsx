import { Link } from "react-router-dom";

function CourseCard({ course }) {
  return (
    <div className="course-card">

      <div className="course-image">
        <span>FREE</span>
      </div>

      <div className="course-content">

        <h3>{course.title}</h3>

        <p className="instructor">
          By {course.instructor}
        </p>

        <p className="description">
          {course.description}
        </p>

        <div className="course-rating">
          <span>★ {course.rating}</span>
          <span>({course.students} students)</span>
        </div>

        <div className="course-info">
          <span>{course.level}</span>
          <span>{course.duration}</span>
          <span>{course.lessons} lessons</span>
        </div>

        <Link to={`/courses/${course.id}`}>
          <button className="view-course-btn">
            View Course
          </button>
        </Link>

      </div>

    </div>
  );
}

export default CourseCard;