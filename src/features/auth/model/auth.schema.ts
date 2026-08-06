import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('Saisissez une adresse email valide.'),
  password: z.string().min(1, 'Saisissez votre mot de passe.'),
})

export const registerSchema = loginSchema.extend({
  agencyName: z.string().trim().min(2, "Le nom de l'agence doit contenir au moins 2 caractères."),
  phone: z.string().trim().optional(),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
})
