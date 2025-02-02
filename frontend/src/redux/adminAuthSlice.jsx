import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080";

export const adminLogin = createAsyncThunk("admin/login", async (adminData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/admin/login`, adminData);
        localStorage.setItem("adminToken", response.data.data.token);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(`${API_URL}/admin/panel`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        console.log("Fetched Users:", response.data); 

        return response.data.data?.users || []; 
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Error fetching users.");
    }
});


export const updateUser = createAsyncThunk("admin/updateUser", async (userData, thunkAPI) => {
    try {
        if (!userData.id) {
            throw new Error("User ID is missing in updateUser function.");
        }
        console.log("Updating user with ID:", userData.id);
        const token = localStorage.getItem("adminToken");
        if (!token) {
            return thunkAPI.rejectWithValue("Admin token missing. Please log in again.");
        }
        const response = await axios.put(`${API_URL}/admin/user-update/${userData.id}`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Error updating user.");
    }
});

export const deleteUser = createAsyncThunk("admin/deleteUser", async(userId,thunkAPI)=>{
    try{
        if (!userId) {
            throw new Error("User ID is missing in updateUser function.");
        }
        const token = localStorage.getItem("adminToken");
        if (!token) {
            return thunkAPI.rejectWithValue("Admin token missing. Please log in again.");
        }

        const response = await axios.delete(`${API_URL}/admin/user-delete/${userId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return {id:userId};
    }catch(error){
        return thunkAPI.rejectWithValue(error.response?.data || "Error deleting user");
    }
});

export const addUser = createAsyncThunk("admin/addUser", async(userData,thunkAPI)=>{
    try{
        const token = localStorage.getItem("adminToken");
        if (!token) {
            return thunkAPI.rejectWithValue("Admin token missing. Please log in again.");
        }
        const response = await axios.post(`${API_URL}/user/signup`,userData);
        return response.data
    }catch(error){
        return thunkAPI.rejectWithValue(error.response.data);
    }
})


const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState: {
        admin: null,
        adminToken: localStorage.getItem("adminToken") || "",
        users:[],
        isLoading: false,
        error: null,
    },
    reducers: {
        adminLogout: (state) => {
            localStorage.removeItem("adminToken");
            state.admin = null;
            state.adminToken = "";
            state.users=[];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.adminToken = action.payload.data.token;
                state.admin = {
                    id: action.payload.data.id,
                    email: action.payload.data.email,
                };
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchUsers.pending,(state)=>{
                state.isLoading=true;
            })
            .addCase(fetchUsers.fulfilled, (state,action)=>{
                state.isLoading=false;
                state.users=action.payload;
            })
            .addCase(fetchUsers.rejected, (state,action)=>{
                state.isLoading=false;
                state.error=action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading=true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading=false;
                const updatedUser = action.payload;
                state.users = state.users.map(user =>
                    user.id === updatedUser.id ? updatedUser : user
                );
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading=false;
                state.error = action.payload;
            })
            .addCase(deleteUser.pending, (state) => {
                state.isLoading=true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading=false;
                state.users = state.users.filter(user =>
                    user.id !== action.payload.id
                );
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading=false;
                state.error = action.payload;
            })
            .addCase(addUser.pending, (state) => {
                state.isLoading=true;
            })
            .addCase(addUser.fulfilled, (state) => {
                state.isLoading=false;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.isLoading=false;
                state.error = action.payload;
            });
    },
});

export const { adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
