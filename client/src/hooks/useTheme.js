// src/hooks/useTheme.js
import { useEffect, useState } from "react";

const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const updateTheme = () => {
      setIsDark(root.classList.contains("dark"));
    };

    updateTheme(); // check initially

    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return isDark;
};

export default useTheme;
