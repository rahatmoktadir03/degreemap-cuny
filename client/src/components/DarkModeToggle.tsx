import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useDarkMode } from "../store/DarkModeContext";

export const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Button
      onClick={toggleDarkMode}
      variant="ghost"
      size="icon"
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="h-9 w-9 rounded-lg"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600" />
      )}
    </Button>
  );
};
