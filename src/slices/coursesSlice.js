import { createSlice,createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
 const course_API = "http://localhost:3000/courses";


 export const fetchCourses = createAsyncThunk(
    "courses/fetchCourses",
    async(__,{rejectWithValue})=>{
       try{
        const response = await fetch(course_API);
        if (!response.ok){
            return rejectWithValue("failed to fetch courses");
        }
        return await response.json();
       }catch{
        return rejectWithValue("unable to conncet server");
       }
    }
 );


 const coursesSlice = createSlice({
    name:"courses",
    initialState:{
        courses:[],
        error:null,
        loading:false,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(fetchCourses.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchCourses.fulfilled,(state,action)=>{
                state.loading=false;
                state.courses=action.payload;
            })
            .addCase(fetchCourses.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload || "something went wrong ";
            });

    },
 });
  

 export default coursesSlice.reducer;