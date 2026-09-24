import { useState } from "react";
import courses from "../data/courses";
import CourseCard from "../components/CourseCard";

function Courses() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  const filteredCourses = courses.filter((course) => {

    const matchesSearch =
      course.title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      course.category === category;

    const matchesLevel =
      level === "All" ||
      course.level === level;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLevel
    );
  });

  return (
    <div className="courses-page">

      <div className="courses-header">

        <h1>Explore Courses</h1>

        <p>
          Learn new skills with our free online courses.
        </p>

      </div>

      {/* Search */}
      <div className="course-search">

        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Filters */}
      <div className="filters">

        <div>
          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Web Development">
              Web Development
            </option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="AI">AI</option>
          </select>
        </div>

        <div>
          <label>Level</label>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">
              Intermediate
            </option>
          </select>
        </div>

      </div>

      {/* Course Count */}
      <div className="course-count">
        <h2>
          {filteredCourses.length} Courses
        </h2>
      </div>

      {/* Courses */}
      <div className="courses-grid">

        {filteredCourses.length > 0 ? (

          filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))

        ) : (

          <p className="no-courses">
            No courses found.
          </p>

        )}

      </div>

    </div>
  );
}

export default Courses;