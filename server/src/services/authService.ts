import { supabaseAdmin } from "../supabase/client.js";

interface RegisterResult {
  success: boolean;
  message: string;
  user?: { id: string; email: string };
}

interface LoginResult {
  success: boolean;
  message: string;
  user?: { id: string; email: string };
  session?: { access_token: string; user: unknown };
}

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  profile: { school?: string; major?: string } = {}
): Promise<RegisterResult> => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      if (/already (registered|exists)/i.test(error.message ?? "")) {
        return { success: false, message: "Email already registered" };
      }
      return { success: false, message: error.message || "Failed to create user" };
    }

    if (!data?.user) {
      return { success: false, message: "Failed to create user" };
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: data.user.id,
      name,
      school: profile.school ?? null,
      major: profile.major ?? null,
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      // Best-effort rollback of the auth user so the next signup can succeed.
      try {
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
      } catch {
        /* ignore */
      }
      return {
        success: false,
        message: profileError.message || "Failed to create profile",
      };
    }

    return {
      success: true,
      message: "User registered successfully",
      user: { id: data.user.id, email: data.user.email! },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    };
  }
};

export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user || !data.session) {
      return { success: false, message: error?.message || "Login failed" };
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    return {
      success: true,
      message: "Login successful",
      user: { id: data.user.id, email: data.user.email! },
      session: {
        access_token: data.session.access_token,
        user: profile ?? { id: data.user.id, email: data.user.email },
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
};
