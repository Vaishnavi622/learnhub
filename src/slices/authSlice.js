
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = "http://localhost:3000/users";

// Configure admin email
const ADMIN_EMAIL = "vaishnaviboopathi12@gmail.com";

// Get saved user from localStorage
const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

// SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const email = userData.email.trim().toLowerCase();

      const response = await fetch(
        `${API}?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        return rejectWithValue("Unable to connect to server");
      }

      const users = await response.json();

      const existingUser = users.find(
        (user) => user.email.toLowerCase() === email
      );

      if (existingUser) {
        return rejectWithValue("Email already registered");
      }

      // Assign role based on configured email
      const role =
        email === ADMIN_EMAIL.toLowerCase()
          ? "ADMIN"
          : "STUDENT";

      const newUser = {
        name: userData.name.trim(),
        email,
        password: userData.password,
        role,
        enrolledCourses: [],
      };

      // Save user in JSON Server
      const signupResponse = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!signupResponse.ok) {
        return rejectWithValue("Signup failed");
      }

      const savedUser = await signupResponse.json();

      // Remove password
      const { password, ...safeUser } = savedUser;

      return safeUser;

    } catch (error) {
      return rejectWithValue("Unable to connect to server");
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const email = credentials.email.trim().toLowerCase();

      // Find user using email
      const response = await fetch(
        `${API}?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        return rejectWithValue("Unable to connect to server");
      }

      const users = await response.json();

      // Verify email and password
      const user = users.find(
        (item) =>
          item.email.toLowerCase() === email &&
          item.password === credentials.password
      );

      if (!user) {
        return rejectWithValue("Invalid email or password");
      }

      // Assign role based on configured admin email
      const role =
        user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
          ? "ADMIN"
          : "STUDENT";

      // Remove password
      const { password, ...safeUser } = user;

      return {
        ...safeUser,
        role,
      };

    } catch (error) {
      return rejectWithValue("Unable to connect to server");
    }
  }
);

// INITIAL STATE
const initialState = {
  user: getSavedUser(),
  loading: false,
  error: null,
  success: false,
};

// AUTH SLICE
const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.success = false;

      // Remove saved login information
      localStorage.removeItem("user");
    },

    clearMessage: (state) => {
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // SIGNUP PENDING
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      // SIGNUP SUCCESS
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      // SIGNUP FAILED
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message;
      })

      // LOGIN PENDING
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      // LOGIN SUCCESS
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;

        // Save user without password
        localStorage.setItem(
          "user",
          JSON.stringify(action.payload)
        );
      })

      // LOGIN FAILED
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message;
      });
  },
});

export const { logout, clearMessage } = authSlice.actions;

export default authSlice.reducer;
