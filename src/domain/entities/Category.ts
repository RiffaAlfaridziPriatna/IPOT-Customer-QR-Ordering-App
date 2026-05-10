export interface Category {
  id: number;
  name: string;
  sortOrder: number;
}

export const createCategory = (
  id: number,
  name: string,
  sortOrder: number
): Category => ({
  id,
  name,
  sortOrder,
});
