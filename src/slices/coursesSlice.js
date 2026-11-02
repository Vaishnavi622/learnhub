
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const course_API = "http://localhost:3000/courses";

// 1. FETCH ALL COURSES
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(course_API);

      if (!response.ok) {
        return rejectWithValue("Failed to fetch courses");
      }

      return await response.json();
    } catch {
      return rejectWithValue("Unable to connect to server");
    }
  }
);

// 2. ADD NEW COURSE
export const addCourse = createAsyncThunk(
  "courses/addCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await fetch(course_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        return rejectWithValue("Failed to add course");
      }

      return await response.json();
    } catch {
      return rejectWithValue("Unable to add course");
    }
  }
);

// 3. UPDATE COURSE
export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, courseData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${course_API}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        return rejectWithValue("Failed to update course");
      }

      return await response.json();
    } catch {
      return rejectWithValue("Unable to update course");
    }
  }
);

// 4. DELETE COURSE
export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${course_API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return rejectWithValue("Failed to delete course");
      }

      return id;
    } catch {
      return rejectWithValue("Unable to delete course");
    }
  }
);

// COURSE SLICE
const coursesSlice = createSlice({
  name: "courses",

  initialState: {
    courses: [],
    error: null,
    loading: false,
  },

  reducers: {
    clearCourseError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH COURSES
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })

      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something went wrong";
      })

      // ADD COURSE
      .addCase(addCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })

      .addCase(addCourse.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to add course";
      })

      // UPDATE COURSE
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.courses.findIndex(
          (course) =>
            String(course.id) === String(action.payload.id)
        );

        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })

      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to update course";
      })

      // DELETE COURSE
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;

        state.courses = state.courses.filter(
          (course) =>
            String(course.id) !== String(action.payload)
        );
      })

      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to delete course";
      });
  },
});

export const { clearCourseError } = coursesSlice.actions;

export default coursesSlice.reducer;
