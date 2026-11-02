import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const API_URL = "http://localhost:3000";

const initialLesson = {
  title: "",
  description: "",
  videoUrl: "",
  durationMinutes: "",
};

function AddCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    duration: "",
    rating: "0",
    level: "BEGINNER",
    imageUrl: "",
    whatYouWillLearn: [""],
    lessons: [{ ...initialLesson }],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleOutcomeChange = (index, value) => {
    const updated = [...form.whatYouWillLearn];
    updated[index] = value;

    setForm((previous) => ({
      ...previous,
      whatYouWillLearn: updated,
    }));
  };

  const addOutcome = () => {
    setForm((previous) => ({
      ...previous,
      whatYouWillLearn: [...previous.whatYouWillLearn, ""],
    }));
  };

  const removeOutcome = (index) => {
    setForm((previous) => ({
      ...previous,
      whatYouWillLearn: previous.whatYouWillLearn.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleLessonChange = (index, field, value) => {
    const updated = [...form.lessons];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setForm((previous) => ({
      ...previous,
      lessons: updated,
    }));
  };

  const addLesson = () => {
    setForm((previous) => ({
      ...previous,
      lessons: [...previous.lessons, { ...initialLesson }],
    }));
  };

  const removeLesson = (index) => {
    setForm((previous) => ({
      ...previous,
      lessons: previous.lessons.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.category.trim()) {
      setError("Course title and category are required.");
      return;
    }

    const validLessons = form.lessons.filter(
      (lesson) => lesson.title.trim()
    );

    const courseData = {
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      duration: form.duration.trim(),
      rating: Number(form.rating) || 0,
      level: form.level,
      imageUrl: form.imageUrl.trim(),
      whatYouWillLearn: form.whatYouWillLearn
        .map((item) => item.trim())
        .filter(Boolean),
      lessons: validLessons.map((lesson, index) => ({
        id: index + 1,
        title: lesson.title.trim(),
        description: lesson.description.trim(),
        videoUrl: lesson.videoUrl.trim(),
        durationMinutes: Number(lesson.durationMinutes) || 0,
      })),
    };

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error("Unable to add course");
      }

      alert("Course added successfully!");
      navigate("/admin/courses");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminNavbar />

        <div className="admin-content">
          <h2>Add New Course</h2>
          <p>Enter the course information below.</p>

          {error && <p className="admin-error">{error}</p>}

          <form className="admin-form" onSubmit={handleSubmit}>
            <label>Course Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter course title"
              required
            />

            <label>Category *</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Example: Web Development"
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the course"
              rows="4"
            />

            <label>Duration</label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="Example: 8 hours"
            />

            <label>Rating</label>
            <input
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={handleChange}
            />

            <label>Difficulty Level</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>

            <label>Course Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Paste course image URL"
            />

            <h3>What You Will Learn</h3>

            {form.whatYouWillLearn.map((outcome, index) => (
              <div className="admin-dynamic-row" key={index}>
                <input
                  value={outcome}
                  onChange={(e) =>
                    handleOutcomeChange(index, e.target.value)
                  }
                  placeholder={`Learning outcome ${index + 1}`}
                />

                <button
                  type="button"
                  className="admin-delete-btn"
                  onClick={() => removeOutcome(index)}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="admin-secondary-btn"
              onClick={addOutcome}
            >
              + Add Learning Outcome
            </button>

            <h3>Course Lessons</h3>

            {form.lessons.map((lesson, index) => (
              <div className="admin-lesson-form" key={index}>
                <h4>Lesson {index + 1}</h4>

                <label>Lesson Title</label>
                <input
                  value={lesson.title}
                  onChange={(e) =>
                    handleLessonChange(index, "title", e.target.value)
                  }
                  placeholder="Enter lesson title"
                />

                <label>Lesson Description</label>
                <textarea
                  value={lesson.description}
                  onChange={(e) =>
                    handleLessonChange(index, "description", e.target.value)
                  }
                  placeholder="Enter lesson description"
                />

                <label>Lesson Video URL</label>
                <input
                  value={lesson.videoUrl}
                  onChange={(e) =>
                    handleLessonChange(index, "videoUrl", e.target.value)
                  }
                  placeholder="Paste video URL"
                />

                <label>Duration (minutes)</label>
                <input
                  type="number"
                  min="0"
                  value={lesson.durationMinutes}
                  onChange={(e) =>
                    handleLessonChange(
                      index,
                      "durationMinutes",
                      e.target.value
                    )
                  }
                />

                {form.lessons.length > 1 && (
                  <button
                    type="button"
                    className="admin-delete-btn"
                    onClick={() => removeLesson(index)}
                  >
                    Remove Lesson
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="admin-secondary-btn"
              onClick={addLesson}
            >
              + Add Lesson
            </button>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-add-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Course"}
              </button>

              <button
                type="button"
                className="admin-cancel-btn"
                onClick={() => navigate("/admin/courses")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddCourse;