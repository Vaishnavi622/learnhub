
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

import {
  fetchCourses,
  updateCourse,
} from "../slices/coursesSlice";

function EditCourse() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { courses = [], loading } = useSelector(
    (state) => state.courses
  );

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    duration: "",
    rating: "",
    level: "beginner",
    imageUrl: "",
    whatYouWillLearn: "",
    lessons: [],
  });

  const [saving, setSaving] = useState(false);
  const [courseLoaded, setCourseLoaded] = useState(false);

  // Load courses if Redux store is empty
  useEffect(() => {
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);

  // Find selected course and populate form
  useEffect(() => {
    const selectedCourse = courses.find(
      (course) => String(course.id) === String(id)
    );

    if (selectedCourse) {
      setForm({
        title: selectedCourse.title || "",
        category: selectedCourse.category || "",
        description: selectedCourse.description || "",
        duration: selectedCourse.duration || "",
        rating: selectedCourse.rating ?? "",
        level: selectedCourse.level || "beginner",
        imageUrl: selectedCourse.imageUrl || "",
        whatYouWillLearn: (
          selectedCourse.whatYouWillLearn || []
        ).join("\n"),
        lessons: selectedCourse.lessons || [],
      });

      setCourseLoaded(true);
    }
  }, [courses, id]);

  // Handle normal input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle lesson input changes
  const handleLessonChange = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      lessons: previous.lessons.map((lesson, i) =>
        i === index
          ? { ...lesson, [field]: value }
          : lesson
      ),
    }));
  };

  // Add new lesson
  const addLesson = () => {
    setForm((previous) => ({
      ...previous,
      lessons: [
        ...previous.lessons,
        {
          id: Date.now(),
          title: "",
          description: "",
          durationMinutes: "",
          videoUrl: "",
        },
      ],
    }));
  };

  // Remove lesson
  const removeLesson = (index) => {
    setForm((previous) => ({
      ...previous,
      lessons: previous.lessons.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Update course
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.category.trim() ||
      !form.description.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const updatedCourse = {
        title: form.title.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        duration: form.duration,
        rating: Number(form.rating) || 0,
        level: form.level,
        imageUrl: form.imageUrl.trim(),

        whatYouWillLearn: form.whatYouWillLearn
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        lessons: form.lessons.map((lesson) => ({
          ...lesson,
          durationMinutes: Number(lesson.durationMinutes) || 0,
        })),
      };

      await dispatch(
        updateCourse({
          id,
          courseData: updatedCourse,
        })
      ).unwrap();

      toast.success("Course updated successfully!");

      navigate("/admin/courses");
    } catch (error) {
      console.error("Update course error:", error);

      toast.error(
        typeof error === "string"
          ? error
          : "Unable to update course."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading && !courseLoaded) {
    return <p className="admin-loading">Loading course...</p>;
  }

  if (!courseLoaded) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          <AdminNavbar />
          <div className="admin-content">
            <h2>Course not found</h2>
            <Link to="/admin/courses">
              Back to Courses
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminNavbar />

        <div className="admin-content">
          <h2>Edit Course</h2>
          <p>Update your course information below.</p>

          <form
            className="admin-detail-card"
            onSubmit={handleSubmit}
          >
            <label>Course Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <label>Category *</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />

            <label>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
            />

            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="Example: 8 hours"
            />

            <label>Rating</label>
            <input
              type="number"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
            />

            <label>Level</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <label>Course Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Enter image URL"
            />

            <label>What You Will Learn</label>
            <textarea
              name="whatYouWillLearn"
              value={form.whatYouWillLearn}
              onChange={handleChange}
              rows="6"
              placeholder="Enter each learning outcome on a new line"
            />

            <h3>Course Lessons</h3>

            {form.lessons.map((lesson, index) => (
              <div
                className="admin-lesson-card"
                key={lesson.id ?? index}
              >
                <h4>Lesson {index + 1}</h4>

                <label>Lesson Title</label>
                <input
                  type="text"
                  value={lesson.title || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      index,
                      "title",
                      e.target.value
                    )
                  }
                />

                <label>Lesson Description</label>
                <textarea
                  value={lesson.description || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  rows="3"
                />

                <label>Duration (Minutes)</label>
                <input
                  type="number"
                  min="0"
                  value={lesson.durationMinutes ?? ""}
                  onChange={(e) =>
                    handleLessonChange(
                      index,
                      "durationMinutes",
                      e.target.value
                    )
                  }
                />

                <label>Video URL</label>
                <input
                  type="text"
                  value={lesson.videoUrl || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      index,
                      "videoUrl",
                      e.target.value
                    )
                  }
                  placeholder="Enter lesson video URL"
                />

                <button
                  type="button"
                  onClick={() => removeLesson(index)}
                >
                  Remove Lesson
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addLesson}
              className="admin-add-btn"
            >
              + Add Lesson
            </button>

            <div className="admin-section-header">
              <button
                type="submit"
                className="admin-add-btn"
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Course"}
              </button>

              <Link
                to={`/admin/courses/view/${id}`}
                className="admin-cancel-btn"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditCourse;
