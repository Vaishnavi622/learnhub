import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../slices/coursesSlice";
import CourseCard from "../components/CourseCard";

function Courses() {
  const dispatch = useDispatch();

  const { courses, loading, error } = useSelector(
    (state) => state.courses
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  useEffect(() => {
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);

  const categories = useMemo(
    () => ["All", ...new Set(courses.map((course) => course.category))],
    [courses]
  );

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || course.category === category;

    const matchesLevel =
      level === "All" ||
      course.level.toLowerCase() === level.toLowerCase();

    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (loading && courses.length === 0) {
    return <div className="courses-page">Loading courses...</div>;
  }

  if (error && courses.length === 0) {
    return <div className="courses-page auth-error">{String(error)}</div>;
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Explore Courses</h1>
        <p>Discover new skills and take the next step in your learning journey.</p>

        <div className="course-search">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="filters">
        <div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="level">Level</label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="All">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="course-count">
        <h2>{filteredCourses.length} Courses Available</h2>
      </div>

      <div className="courses-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="no-courses">
            No courses found. Try changing your search or filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;