import React, { useState, useEffect } from "react";

function DarkMode({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.body.classList.toggle("dark", newTheme);
  };

  return (
    <div>
      {typeof children === "function"
        ? children({ isDarkMode, toggleDarkMode })
        : React.cloneElement(children, { isDarkMode, toggleDarkMode })}
    </div>
  );
}

export default DarkMode;
