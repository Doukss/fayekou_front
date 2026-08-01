import { z } from 'zod'

export const tenantSchema = z.object({
  name: z.string().trim().min(2, 'Indiquez le nom complet du locataire.'),
  phone: z.string().trim().min(8, 'Indiquez un numéro de téléphone valide.'),
  email: z.string().trim().email('Saisissez une adresse email valide.'),
  unit: z.string().trim().min(1, 'Indiquez le logement.'),
  rent: z.coerce.number().positive('Le loyer doit être supérieur à 0.'),
  dueDate: z.string().min(1, "Indiquez la date d'échéance."),
})
