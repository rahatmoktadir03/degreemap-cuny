import axios from "axios";
import type { School, ApiResponse } from "../types/school";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchSchools = async (): Promise<School[]> => {
  try {
    const response = await axios.get<ApiResponse<School[]>>(`${API_BASE_URL}/api/schools`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error("Failed to fetch schools");
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  }
};

export const fetchSchoolById = async (id: string): Promise<School> => {
  try {
    const response = await axios.get<ApiResponse<School>>(`${API_BASE_URL}/api/schools/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error("Failed to fetch school");
  } catch (error) {
    console.error("Error fetching school:", error);
    throw error;
  }
};
