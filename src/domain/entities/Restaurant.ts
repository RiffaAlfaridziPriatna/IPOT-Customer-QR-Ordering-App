export interface Restaurant {
  id: string;
  name: string;
  tableId: string;
}

export const createRestaurant = (
  id: string,
  name: string,
  tableId: string
): Restaurant => ({
  id,
  name,
  tableId,
});
