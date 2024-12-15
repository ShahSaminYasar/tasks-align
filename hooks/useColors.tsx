import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export default function useColors() {
  const colorScheme = useColorScheme();

  const lightColors = {
    primary: "#006BFF",
    secondary: "#BFECFF",
    accent: "#2884FF",
    neutral: "#08C2FF",
    lowOpacity: "rgba(0, 0, 0, 0.2)",
    black: "#373A40",
    success: "#73EC8B",
    pending: "#FF9A00",
    pendingLow: "rgba(255, 154, 0, 0.7)",
    failed: "#EE4E4E",
  };

  const darkColors = {
    primary: "#ff0000",
    secondary: "#ff0000",
    accent: "#ff0000",
    neutral: "#ff0000",
    lowOpacity: "rgba(0, 0, 0, 0.2)",
    black: "#ff0000",
    success: "#ff0000",
    pending: "#ff0000",
    pendingLow: "rgba(255, 154, 0, 0.7)",
    failed: "#ff0000",
  };

  const [theme, setTheme] = useState("light");
  const [colors, setColors] = useState(lightColors);
  const [firstFlag, setFirstFlag] = useState(true);

  useEffect(() => {
    const getTheme = async () => {
      let res = await AsyncStorage.getItem("theme");
      if (res) {
        let selectedTheme = JSON.parse(res);
        setTheme(selectedTheme);
      }
    };

    getTheme();
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      setColors(darkColors);
    } else if (theme === "light") {
      setColors(lightColors);
    } else if (theme === "device") {
      if (colorScheme === "dark") {
        setColors(darkColors);
      } else {
        setColors(lightColors);
      }
    }

    if (!firstFlag) {
      updateTheme();
    } else {
      setFirstFlag(false);
    }
  }, [theme, colorScheme]);

  const updateTheme = async () => {
    // console.log("Changing theme to ", theme);
    await AsyncStorage.setItem("theme", JSON.stringify(theme));
  };

  return { setTheme, colors, theme };
}
