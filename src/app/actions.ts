"use server";

import { z } from "zod";
import { Resend } from "resend";
import ContactFormEmail from "@/components/Email/ContactFormEmail";
import { EMAIL } from "./utils/constants";

const resend = new Resend(process.env.RESEND_API_KEY);
const FormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message must be at least 5 characters long"),
});

export async function submitContactForm(formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { firstName, lastName, email, message } = validatedFields.data;

  try {
    const { error } = await resend.emails.send({
      from: "Putiikkipalvelu <info@putiikkipalvelu.fi>",
      to: [EMAIL],
      subject: "Sinulle on uusi yhteydenottopyyntö",
      react: ContactFormEmail({ firstName, lastName, email, message }),
    });

    if (error) {
      console.error("Error sending email:", error);
      return { error: "Failed to send email. Please try again." };
    }

    return {
      success:
        "Kiitos yhteydenotostasi olen sinuun yhteydessä mahdollisimman pian!",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
