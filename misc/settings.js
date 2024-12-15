import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";

export const colors = {
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

export const fonts = {
  SpaceGroteskLight: "SpaceGroteskLight",
  SpaceGroteskRegular: "SpaceGroteskRegular",
  SpaceGroteskMedium: "SpaceGroteskMedium",
  SpaceGroteskSemiBold: "SpaceGroteskSemiBold",
  SpaceGroteskBold: "SpaceGroteskBold",
};

export const loadFonts = () => {
  const [fontsLoaded] = useFonts({
    SpaceGroteskLight: require("@/assets/fonts/SpaceGrotesk-Light.ttf"),
    SpaceGroteskRegular: require("@/assets/fonts/SpaceGrotesk-Regular.ttf"),
    SpaceGroteskMedium: require("@/assets/fonts/SpaceGrotesk-Medium.ttf"),
    SpaceGroteskSemiBold: require("@/assets/fonts/SpaceGrotesk-SemiBold.ttf"),
    SpaceGroteskBold: require("@/assets/fonts/SpaceGrotesk-Bold.ttf"),
  });

  return fontsLoaded;
};
