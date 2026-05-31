import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../supabase/client.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: "No authorization token provided",
      });
      return;
    }

    // Verify the JWT against Supabase Auth. NOTE: `auth.admin.getUserById`
    // expects a UUID, not a JWT — using it here was a silent 403 for every
    // protected route. The correct API is `auth.getUser(token)`.
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export { AuthenticatedRequest };
