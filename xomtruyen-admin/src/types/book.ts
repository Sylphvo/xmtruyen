export interface IBook {
  id: string;
  title: string;
  slug: string;
  formatType: number;
  accessLevel: number;
  author: string;
  coverImageUrl: string;
  viewCount: number;
  averageRating: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  categories?: { id: number; name: string }[];
  topics?: { id: number; name: string }[];
}
