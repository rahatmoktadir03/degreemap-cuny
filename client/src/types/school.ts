export interface School {
  id: string;
  name: string;
  borough: string;
  website: string;
  phone: string;
  address: string;
  programs: string[];
  established: number;
}

export interface Review {
  id: string;
  school_id: string;
  user_id: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
}
