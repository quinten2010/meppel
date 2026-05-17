import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  text: z.string().min(10, 'Review must be at least 10 characters').max(1000),
  photos: z.array(z.string()).max(5).optional(),
})

export const submitPlaceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  category_id: z.string().uuid(),
  address: z.string().min(5, 'Please enter a valid address'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500),
  photo: z.string().optional(),
})

export const createListSchema = z.object({
  name: z.string().min(1, 'List name is required').max(100),
  description: z.string().max(300).optional(),
  is_public: z.boolean().default(true),
})

export type ReviewInput = z.infer<typeof reviewSchema>
export type SubmitPlaceInput = z.infer<typeof submitPlaceSchema>
export type CreateListInput = z.infer<typeof createListSchema>
