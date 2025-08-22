export interface IProductQuery {
  searchTerm?: string;
  isFeatured?: boolean;
  categoryId?: string;
  variant?: string;
  minPrice?: number;
  maxPrice?: number;
}
