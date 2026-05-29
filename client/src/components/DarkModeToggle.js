import { jsx as _jsx } from "react/jsx-runtime";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../store/DarkModeContext";
import { Button } from "./ui/button";
const DarkModeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    return (_jsx(Button, { variant: "ghost", size: "icon", onClick: toggleDarkMode, className: "text-gray-700 dark:text-gray-300", children: isDarkMode ? _jsx(Sun, { className: "h-5 w-5" }) : _jsx(Moon, { className: "h-5 w-5" }) }));
};
export default DarkModeToggle;
