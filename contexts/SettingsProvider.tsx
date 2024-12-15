import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert, ImageSourcePropType, useColorScheme } from "react-native";
import * as Notifications from "expo-notifications";

type Colors = {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  lowOpacity: string;
  black: string;
  success: string;
  pending: string;
  pendingLow: string;
  failed: string;
};

type Theme = string;

type SettingsContextType = {
  colors: Colors;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  bgImage: ImageSourcePropType;
};

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const colorScheme = useColorScheme();

  const lightColors = {
    primary: "#006BFF",
    secondary: "#0A44A5",
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
    primary: "#71D0FF",
    secondary: "#110064",
    accent: "#094F79",
    neutral: "#0A939A",
    lowOpacity: "rgba(0, 0, 0, 0.2)",
    black: "#EDD5FF",
    success: "#05BE0A",
    pending: "rgba(255, 154, 0, 0.8)",
    pendingLow: "rgba(255, 154, 0, 0.6)",
    failed: "rgba(232, 4, 50, 0.75)",
  };

  const [theme, setTheme] = useState("device");
  const [colors, setColors] = useState(lightColors);
  const [firstFlag, setFirstFlag] = useState(true);
  const [bgImage, setBgImage] = useState(
    require("@/assets/images/bg-image-light.jpg")
  );

  useEffect(() => {
    const getTheme = async () => {
      let res = await AsyncStorage.getItem("theme");
      if (res) {
        let selectedTheme = JSON.parse(res);
        setTheme(selectedTheme);
      }
    };

    getTheme();

    const requestPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert(
          "You need to enable notifications in the settings to receive daily reminders."
        );
      }
    };
    requestPermission();

    const scheduleDailyNotifications = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Have you completed today's tasks?",
          body: "Check out now to see if you have missed anything.",
        },
        trigger: {
          hour: 9,
          minute: 0,
          second: 0,
          repeats: true,
        },
      });
    };
    scheduleDailyNotifications();
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      setColors(darkColors);
      setBgImage(require("@/assets/images/bg-image-dark.jpg"));
    } else if (theme === "light") {
      setBgImage(require("@/assets/images/bg-image-light.jpg"));
      setColors(lightColors);
    } else if (theme === "device") {
      if (colorScheme === "dark") {
        setColors(darkColors);
        setBgImage(require("@/assets/images/bg-image-dark.jpg"));
      } else {
        setBgImage(require("@/assets/images/bg-image-light.jpg"));
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

  const values = { colors, theme, setTheme, bgImage };

  return (
    <SettingsContext.Provider value={values}>
      {children}
    </SettingsContext.Provider>
  );
};
