import { z } from "zod";

export const customerDataSchema = z.object({
  first_name: z.string({ message: "Anna etunimesi" }).min(1, "Anna etunimesi"),
  last_name: z.string({ message: "Anna sukunimesi" }).min(1, "Anna sukunimesi"),
  email: z
    .string({ message: "Sähköposti vaaditaan" })
    .email("Anna kelvollinen sähköpostiosoite"),
  address: z
    .string({ message: "Katuosoite vaaditaan" })
    .min(1, "Katuosoite vaaditaan"),
  postal_code: z
    .string({ message: "Postinumero vaaditaan" })
    .regex(/^\d{5}$/, "Postinumeron on oltava viisi numeroa"),
  city: z
    .string({ message: "Kaupunki vaaditaan" })
    .min(1, "Kaupunki vaaditaan"),
  phone: z
    .string()
    .min(1, "Puhelin numero vaaditaan")
    .regex(/^[\d\s\-\+\(\)]+$/, "Puhelin numero saa sisältää vain numeroita ja välilyöntejä"),
});
export type CustomerData = z.infer<typeof customerDataSchema>;


