export const RESTAURANT_MESSAGES = {
  CREATED: 'Restaurant created successfully',
  LISTED: 'Restaurants retrieved successfully',
  RETRIEVED: 'Restaurant retrieved successfully',
  NEARBY_LISTED: 'Nearby restaurants retrieved successfully',
  NOT_FOUND: 'Restaurant not found',
  SLUG_TAKEN: (slug: string) => `Restaurant with slug "${slug}" already exists`,
} as const;
