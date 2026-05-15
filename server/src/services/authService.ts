import { supabaseAdmin } from "../supabase/client.js";
import { writeFileSync, appendFileSync } from "fs";

interface RegisterResult {
  success: boolean;
  message: string;
  user?: { id: string; email: string };
}

const logToFile = (message: string) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  appendFileSync("auth.log", logEntry, "utf-8");
  console.log(logEntry);
};

interface LoginResult {
  success: boolean;
  message: string;
  user?: { id: string; email: string };
  session?: { access_token: string; user: any };
}

export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<RegisterResult> => {
  try {
    logToFile(`Starting registration for: ${email}`);

    // Use admin API to create user
    logToFile(`Creating user via admin API with email: ${email}`);
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
    });

    logToFile(`Auth response: userId=${data?.user?.id}, error=${error?.message}`);

    if (error) {
      logToFile(`Auth error details: ${JSON.stringify(error, null, 2)}`);
      logToFile(`Auth error message: ${error.message}`);
      logToFile(`Auth error status: ${error.status}`);
      logToFile(`Auth error code: ${(error as any).code}`);
      console.error("FULL ERROR OBJECT:", error);
      if (error.message?.includes("already registered")) {
        return {
          success: false,
          message: "Email already registered",
        };
      }
      return {
        success: false,
        message: `Auth error: ${error.message || "Unknown error"}`,
        user: undefined,
      };
    }

    if (!data.user) {
      logToFile(`No user returned from auth`);
      return {
        success: false,
        message: "Failed to create user - no user returned",
      };
    }

    logToFile(`Auth user created: ${data.user.id}`);

    // Create user profile in database
    logToFile(`Creating profile in database for user: ${data.user.id}`);
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: data.user.id,
      name,
      created_at: new Date().toISOString(),
    });

    logToFile(`Profile response: error=${profileError?.message}`);

    if (profileError) {
      logToFile(`Profile creation error: ${JSON.stringify(profileError)}`);
      // Delete the auth user if profile creation fails (best effort)
      try {
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
      } catch (e) {
        logToFile(`Could not delete auth user on failure: ${e}`);
      }
      return {
        success: false,
        message: `Database error: ${profileError.message || "Failed to create profile"}`,
      };
    }

    logToFile(`User registration successful for: ${email}`);
    return {
      success: true,
      message: "User registered successfully",
      user: {
        id: data.user.id,
        email: data.user.email!,
      },
    };
  } catch (error) {
    logToFile(`Register error: ${error}`);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    };
  }
};

export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  try {
    // Sign in with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Auth error:", error);
      return {
        success: false,
        message: error.message || "Login failed",
      };
    }

    if (!data.user || !data.session) {
      return {
        success: false,
        message: "Login failed",
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
    }

    return {
      success: true,
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email!,
      },
      session: {
        access_token: data.session.access_token,
        user: profile || { id: data.user.id, email: data.user.email },
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
};
