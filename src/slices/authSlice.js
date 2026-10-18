import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API ="http://localhost:3000/users";
 
//signup 
export const signupUser =createAsyncThunk(
    "auth/signupUser",async(userData ,{rejectWithValue})=>{
        try{
            const response = await fetch(`${API}?email=${encodeURIComponent(userData.email)}`);
            const users =await response.json();
            if(users.length > 0){
                return rejectWithValue("Email already registered");
            }
            const signupResponse = await fetch(API,{
                method:"POST",
                header:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(userData),
            });
            if (!signupResponse.ok) {
        return rejectWithValue("Signup failed");
      }

      return await signupResponse.json();
        } catch {
      return rejectWithValue("Unable to connect to server");
    }
    }
);
 //login

 export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API}?email=${encodeURIComponent(credentials.email)}`
      );

      if (!response.ok) {
        return rejectWithValue("Unable to connect to server");
      }

      const users = await response.json();

      const user = users.find(
        (item) => item.password === credentials.password
      );

      if (!user) {
        return rejectWithValue("Invalid email or password");
      }

      // Never return the password to Redux state
      const { password, ...safeUser } = user;
      return safeUser;
    } catch {
      return rejectWithValue("Unable to connect to server");
    }
  }
);

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:false,
        error:null,
        success:false,
    },
    reducers:{
        logout: (state) => {
      state.user = null;
      state.error = null;
      state.success = false;
    },
    clearMessage: (state) => {
      state.error = null;
      state.success = false;
    },
    },
    extraReducers: (builder)=>{
        builder
             .addCase(signupUser.pending,(state)=>{
                state.loading=true;
                state.error = null;
                state.success = false;
             })
             .addCase(signupUser.fulfilled,(state)=>{
                state.loading=false;
                state.success = true;
             })
             .addCase(signupUser.rejected,(state,action)=>{
                state.loading=false;
                state.error = action.payload||action.error.message;
             })
             .addCase(loginUser.pending,(state)=>{
                state.loading=true;
                state.error = null;
                state.success = false;
             })
             .addCase(loginUser.fulfilled,(state,action)=>{
                state.loading=false;
                state.error = null;
                state.user = action.payload;
             })
             .addCase(loginUser.rejected,(state,action)=>{
                state.loading=false;
                state.error =action.error.message;
             });
    },
});
 export const { logout,clearMessage }= authSlice.actions;
 export default authSlice.reducer;