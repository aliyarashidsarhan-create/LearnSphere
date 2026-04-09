export interface Course {
  id: number;
  title: string;
  category: string;
  instructor: string;
  rating: number;
  price: number;
  duration: string;
  level: string;
  studentsCount: number;
  available: boolean;
  topics: string[];
}
