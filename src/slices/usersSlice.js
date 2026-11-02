
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const USERS_API = "http://localhost:3000/users";

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(USERS_API);

      if (!response.ok) {
        return rejectWithValue("Failed to fetch users");
      }

      return await response.json();
    } catch {
      return rejectWithValue("Unable to connect to server");
    }
  }
);

// Enroll a student in a course
export const enrollCourse = createAsyncThunk(
  "users/enrollCourse",
  async ({ userId, courseId }, { rejectWithValue }) => {
    try {
      // Get the latest user data
      const userResponse = await fetch(`${USERS_API}/${userId}`);

      if (!userResponse.ok) {
        return rejectWithValue("Unable to find user");
      }

      const user = await userResponse.json();

      const enrolledCourses = user.enrolledCourses || [];

      // Prevent duplicate enrollment
      const alreadyEnrolled = enrolledCourses.some(
        (item) => String(item.courseId) === String(courseId)
      );

      if (alreadyEnrolled) {
        return rejectWithValue("Already enrolled in this course");
      }

      // Create enrollment record
      const newEnrollment = {
        courseId,
        progress: 0,
        completedLessons: [],
        enrolledAt: new Date().toISOString(),
      };

      // Update user in JSON Server
      const updateResponse = await fetch(`${USERS_API}/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enrolledCourses: [
            ...enrolledCourses,
            newEnrollment,
          ],
        }),
      });

      if (!updateResponse.ok) {
        return rejectWithValue("Enrollment update failed");
      }

      return await updateResponse.json();
    } catch {
      return rejectWithValue("Unable to connect to server");
    }
  }
);

const usersSlice = createSlice({
  name: "users",

  initialState: {
    users: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })

      // Enroll course
      .addCase(enrollCourse.pending, (state) => {
        state.error = null;
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        const updatedUser = action.payload;

        const index = state.users.findIndex(
          (user) => String(user.id) === String(updatedUser.id)
        );

        if (index !== -1) {
          state.users[index] = updatedUser;
        } else {
          state.users.push(updatedUser);
        }
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.error = action.payload || "Enrollment failed";
      });
  },
});

export const { clearUsersError } = usersSlice.actions;

export default usersSlice.reducer;
