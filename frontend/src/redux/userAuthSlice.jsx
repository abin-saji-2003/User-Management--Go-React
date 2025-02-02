import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080";

export const signup = createAsyncThunk("user/signup", async (userData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/user/signup`, userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const login = createAsyncThunk("user/login", async (userData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/user/login`, userData);
        const user = {
            id: response.data.data.id,
            name: response.data.data.name,
            email: response.data.data.email,
            profile_image: response.data.data.profile_img,
        };

        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(user));

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const uploadImage = createAsyncThunk("user/uploadProfileImage", async ({ id, profileImage }, thunkAPI) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return thunkAPI.rejectWithValue("User token missing. Please log in again.");
        }

        const response = await axios.put(
            `${API_URL}/user/profile/${id}`,
            { profileImage },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
    }
});

const userAuthSlice = createSlice({
    name: "userAuth",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null, 
        token: localStorage.getItem("token") || "",
        isLoading: false,
        error: null,
        counter:0,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            state.user = null;
            state.token = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signup.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.data.token;
                state.user = {
                    id: action.payload.data.id,
                    name: action.payload.data.name,
                    email: action.payload.data.email,
                    profile_image: action.payload.data.profile_img,
                };
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(uploadImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(uploadImage.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.user) {
                    state.user.profile_image = action.payload.profileImage;
                    localStorage.setItem("user", JSON.stringify(state.user));
                }
            })
            .addCase(uploadImage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { logout} = userAuthSlice.actions;
export default userAuthSlice.reducer;
