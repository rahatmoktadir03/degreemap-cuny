import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../store/DarkModeContext";
import { Button } from "./ui/button";

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title="Toggle dark mode"
      className="text-gray-700 dark:text-gray-300"
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default DarkModeToggle;
