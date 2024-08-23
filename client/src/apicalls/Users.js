import { axiosInstance } from "./AxiosInstance";

//register user (structure of front end fro api call)
export const RegisterUser = async (payload)=>{
   try {
    const response = await axiosInstance.post("/api/users/register",payload);
    return response.data;

    
   } catch (error) {
    if (error.response && error.response.data) {
        return { success: false, message: error.response.data.message };
      } else {
        return { success: false, message: error.message };
      }
    
   }
}

//login user (structure of front end fro api call)
export const LoginUser = async (payload)=>{
    try {
        const response = await axiosInstance.post("/api/users/login",payload);
        return response.data
        
    } catch (error) {
        if (error.response && error.response.data) {
            return { success: false, message: error.response.data.message };
        } else {
            return { success: false, message: error.message };
        }

        
    }
}

//get user profile (structure of front end fro api call)
export const GetCurrentUser= async ()=>{
    try {
        const response = await axiosInstance.get("/api/users/get-current-user");
        return response.data;
        
    } catch (error) {
        return error.message
        
    }
}

//In your client-side code, handle token refresh logic.
export const RefreshToken = async (refreshToken) => {
    try {
        const response = await axiosInstance.post("/api/users/refresh-token", { refreshToken });
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

//get all users including admin as well
export const GetAllUsers = async () => {
    try {
        const response = await axiosInstance.get("/api/users/get-users");
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

//update user status
export const UpdateUserStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/api/users/update-user-status/${id}`, { status });
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};