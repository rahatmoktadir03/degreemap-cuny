import React, { type ReactNode } from "react";

// Simple PageTransition wrapper - no animations, just renders children
export const PageTransition: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;

// Simple StaggerContainer wrapper - no animations
export const StaggerContainer: React.FC<{
  children: ReactNode;
  delayChildren?: number;
}> = ({ children }) => <>{children}</>;

// Simple StaggerItem wrapper - no animations
export const StaggerItem: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
