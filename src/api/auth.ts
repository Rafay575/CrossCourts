import axios from "axios";

const API_BASE_URL = "https://crosscourtspk.com/api";

// ✅ Define Types for API Responses
interface AuthResponse {
    token: string;
    user:{
        id:number;
        name:string;
        title:string;
        email:string
    }
}

interface RegisterResponse {
    message: string;
}

// ✅ Login API
export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/login`, { email, password });
    return response.data; // Returns { token }
};

// ✅ Register API
export const register = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/register`, { name, email, password });
    return response.data; // Returns { message: "User registered successfully" }
};

// ✅ Logout (Clear Token)
export const logout = (): void => {
    localStorage.removeItem("token");
};

// ✅ Check Authentication
export const isAuthenticated = (): boolean => {
    return localStorage.getItem("token") !== null;
};
