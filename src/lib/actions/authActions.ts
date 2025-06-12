"use server";
import { z } from "zod";
import fetch from "node-fetch";
import { cookies } from "next/headers";
const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
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

    const { sessionId, expiresAt, customer, success } =
      await (response.json() as Promise<{
        success?: boolean;
        sessionId: string;
        expiresAt: string;
        customer: Customer;
      }>);

    // Parse successful response
    if (!sessionId || !expiresAt || !customer || !success) {
      return { error: "Invalid response from server. Please try again." };
    }

    // Set session cookie
    cookies().set({
      name: "session-id",
      value: sessionId,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(expiresAt),
    });

    return {
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      customer,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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
        const errorData = (await response.json()) as { error?: string };
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use default error message
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
    cookies().set({
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
  const cookieStore = cookies();
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
  const cookieStore = cookies();
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
    cookies().delete("session-id");

    return;
  } catch (error) {
    console.error("Logout error:", error);
    cookies().delete("session-id");
    return;
  }
}
