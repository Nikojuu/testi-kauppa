"use server";
import { z } from "zod";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { STORE_NAME } from "@/app/utils/constants";
const RegisterSchema = z.object({
  firstName: z.string().min(1, "Etunimi on pakollinen"),
  lastName: z.string().min(1, "Sukunimi on pakollinen"),
  email: z.string().email("Virheellinen sähköpostiosoite"),
  password: z.string().min(8, "Salasanan on oltava vähintään 8 merkkiä pitkä"),
});

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  emailVerificationToken: string;
  emailVerificationExpiresAt: string;
}

export async function registerCustomer(formData: FormData) {
  const validatedFields = RegisterSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { firstName, lastName, email, password } = validatedFields.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/register`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      }
    );

    // Check if response is ok first
    if (!response.ok) {
      let errorMessage = "Registration failed. Please try again.";
      try {
        const errorData = (await response.json()) as { error?: string };
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use default error message
      }
      return { error: errorMessage };
    }

    const { customer, success } = await (response.json() as Promise<{
      success?: boolean;

      customer: Customer;
    }>);

    // Parse successful response
    if (
      !customer ||
      !success ||
      !customer.emailVerificationToken ||
      !customer.emailVerificationExpiresAt
    ) {
      return { error: "Invalid response from server. Please try again." };
    }

    // send verification email
    const emailResult = await sendVerificationEmail(customer);
    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Don't fail registration, just log the error
    }

    const {
      emailVerificationToken,
      emailVerificationExpiresAt,
      ...customerData
    } = customer;

    return {
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      customer: customerData,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
async function sendVerificationEmail(customer: Customer) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${customer.emailVerificationToken}`;

    const { error } = await resend.emails.send({
      from: `${STORE_NAME} <info@putiikkipalvelu.fi>`,
      to: customer.email,
      subject: `Vahvista sähköpostisi – ${STORE_NAME}`,
      text: `Tervetuloa ${customer.firstName}! Vahvista sähköpostiosoitteesi vierailemalla: ${verificationUrl}`,
      html: `
        <h2>Tervetuloa ${customer.firstName}!</h2>
        <p>Napsauta alla olevaa linkkiä vahvistaaksesi sähköpostisi:</p>
        <a href="${verificationUrl}">Vahvista sähköposti</a>
        <p>Tämä linkki vanhenee 24 tunnin kuluttua.</p>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
const LoginSchema = z.object({
  email: z.string().email("Virheellinen sähköpostiosoite"),
  password: z.string().min(1, "Salasana on pakollinen"),
});

export async function loginCustomer(formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/login`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    // Check if response is ok first
    if (!response.ok) {
      let errorMessage = "Login failed. Please try again.";
      try {
        const errorData = (await response.json()) as {
          requiresVerification?: boolean;
          customerId?: string;
          error?: string;
        };

        // Handle email verification required
        if (errorData.requiresVerification) {
          return {
            requiresVerification: true,
            customerId: errorData.customerId,
            error: "Vahvista sähköpostiosoitteesi ennen sisäänkirjautumista.",
          };
        }

        errorMessage = errorData.error || errorMessage;
      } catch {
        // JSON parsing failed
      }
      return { error: errorMessage };
    }

    // Parse successful response
    let data;
    try {
      data = (await response.json()) as {
        error?: string;
        success?: boolean;
        customer?: {
          id: string;
          firstName: string;
          lastName: string;
          email: string;
          emailVerified: Date | null;
          createdAt: string;
        };
        message?: string;
        sessionId?: string; // Added sessionId
        expiresAt?: string; // Added expiresAt
      };

      if (
        !data.success ||
        !data.customer ||
        !data.sessionId ||
        !data.expiresAt
      ) {
        return { error: "Invalid response from server. Please try again." };
      }
    } catch {
      return { error: "Invalid response from server. Please try again." };
    }

    // Set session cookie
    (await cookies()).set({
      name: "session-id",
      value: data.sessionId,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(data.expiresAt),
    });

    return {
      success: true,
      message: data.message || "Login successful!",
      customer: data.customer,
    };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function getUser() {
  const cookieStore = await cookies();
  const sessionIdCookie = cookieStore.get("session-id");

  if (!sessionIdCookie) {
    return { user: null, error: "No active session found." };
  }

  const sessionId = sessionIdCookie.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/get-user`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
          "x-session-id": sessionId, // Pass the session ID as a custom header
        },
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to fetch user data.";
      try {
        const errorData = (await response.json()) as { error?: string };
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use default error message
      }
      return { user: null, error: errorMessage };
    }

    const data = (await response.json()) as {
      success?: boolean;
      customer?: Customer;
      error?: string;
    };

    if (!data.success || !data.customer) {
      return {
        user: null,
        error: data.error || "Invalid response from server.",
      };
    }

    return {
      success: true,
      user: data.customer,
    };
  } catch (error) {
    console.error("Get user error:", error);
    return {
      user: null,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionIdCookie = cookieStore.get("session-id");

  if (!sessionIdCookie) {
    return;
  }

  const sessionId = sessionIdCookie.value;

  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/logout`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
          "x-session-id": sessionId,
        },
      }
    );

    // Clear session cookie
    (await cookies()).delete("session-id");

    return;
  } catch (error) {
    console.error("Logout error:", error);
    (await cookies()).delete("session-id");
    return;
  }
}

const EditProfileSchema = z.object({
  firstName: z.string().min(1, "Etunimi on pakollinen"),
  lastName: z.string().min(1, "Sukunimi on pakollinen"),
  email: z.string().email("Virheellinen sähköpostiosoite"),
});

export async function editCustomerProfile(formData: FormData) {
  const validatedFields = EditProfileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { firstName, lastName, email } = validatedFields.data;

  // Get session ID from cookies
  const cookieStore = await cookies();
  const sessionIdCookie = cookieStore.get("session-id");
  if (!sessionIdCookie) {
    return { error: "No active session found. Please login again." };
  }
  const sessionId = sessionIdCookie.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/edit-user/`,
      {
        method: "PATCH",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
          "x-session-id": sessionId,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
        }),
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to update profile. Please try again.";
      try {
        const errorData = (await response.json()) as { error?: string };
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use default error message
      }
      return { error: errorMessage };
    }

    const data = (await response.json()) as {
      success?: boolean;
      message?: string;
      customer?: Customer;
      error?: string;
    };

    return {
      success: true,
      message: data.message || "Profile updated successfully!",
      customer: data.customer,
    };
  } catch (error) {
    console.error("Edit profile error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function deleteCustomerAccount() {
  // Get current user session

  const cookieStore = await cookies();
  const sessionIdCookie = cookieStore.get("session-id");

  if (!sessionIdCookie) {
    return { error: "No active session found." };
  }

  const sessionId = sessionIdCookie.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/delete-user/`,
      {
        method: "DELETE",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
          "x-session-id": sessionId,
        },
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to delete account. Please try again.";
      try {
        const errorData = (await response.json()) as { error?: string };
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use default error message
      }
      return { error: errorMessage };
    }

    // Clear session cookie since account is deleted
    (await cookies()).delete("session-id");

    return {
      success: true,
      message: "Account deleted successfully!",
    };
  } catch (error) {
    console.error("Delete account error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function resendVerificationEmail(customerId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/resend-verification`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId }),
      }
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string };
      return {
        error: errorData.error || "Failed to resend verification email",
      };
    }

    const data = (await response.json()) as {
      success?: boolean;
      customer?: Customer;
    };

    // Send the verification email using your existing logic
    if (data.success && data.customer) {
      const emailResult = await sendVerificationEmail(data.customer);
      if (!emailResult.success) {
        return { error: "Failed to send verification email" };
      }
    }

    return { success: true, message: "Email verified successfully!" };
  } catch (error) {
    console.error("Email verification error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function addToWishlist(
  productId: string,
  returnUrl: string,
  variationId?: string
) {
  const cookieStore = await cookies();
  const sessionIdCookie = cookieStore.get("session-id");

  if (!sessionIdCookie) {
    // If not logged in, return a flag for the UI to handle redirect
    return { requiresLogin: true, returnUrl: returnUrl || null };
  }

  const sessionId = sessionIdCookie.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/wishlist`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
          "x-session-id": sessionId,
        },
        body: JSON.stringify({ productId, variationId }),
      }
    );

    if (response.status === 401) {
      // Session expired or invalid, ask UI to redirect to login
      return { requiresLogin: true, returnUrl: returnUrl || null };
    }

    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string };
      return { error: errorData.error || "Failed to add to wishlist" };
    }

    return { success: true, message: "Added to wishlist" };
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// export async function deleteFromWishlist(wishlistItemId: string) {
//   const cookieStore = cookies();
//   const sessionIdCookie = cookieStore.get("session-id");

//   if (!sessionIdCookie) {
//     return { error: "No active session found." };
//   }

//   const sessionId = sessionIdCookie.value;

//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/wishlist/${wishlistItemId}`,
//       {
//         method: "DELETE",
//         headers: {
//           "x-api-key": process.env.STOREFRONT_API_KEY || "",
//           "Content-Type": "application/json",
//           "x-session-id": sessionId,
//         },
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json() as { error?: string };
//       return { error: errorData.error || "Failed to delete from wishlist" };
//     }

//     return { success: true, message: "Deleted from wishlist" };
//   } catch (error) {
//     console.error("Delete from wishlist error:", error);
//     return { error: "An unexpected error occurred. Please try again." };
//   }
// }

// Server action for deleting wishlist items
export async function deleteWishlistItem(
  productId: string,
  variationId?: string | null
) {
  const cookieStore = await cookies();
  const sessionIdCookie = cookieStore.get("session-id");

  if (!sessionIdCookie) {
    return { error: "No active session found." };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/wishlist`,
      {
        method: "DELETE",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
          "x-session-id": sessionIdCookie.value,
        },
        body: JSON.stringify({
          productId: productId,
          variationId: variationId || null,
        }),
      }
    );

    if (response.ok) {
      return { success: true, message: "Deleted from wishlist" };
    }

    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string };
      return { error: errorData.error || "Failed to delete from wishlist" };
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
