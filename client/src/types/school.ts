export interface School {
  id: string;
  name: string;
  borough: "Manhattan" | "Brooklyn" | "Queens" | "Bronx" | "Staten Island";
  type: "senior" | "community" | "graduate";
  lat: number;
  lng: number;
  enrollment: number;
  founded: number;
  website: string;
  programs: string[];
  image_url?: string;
  created_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
