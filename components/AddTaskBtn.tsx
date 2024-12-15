import { useSettings } from "@/contexts/SettingsProvider";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Pressable, StyleSheet, useColorScheme } from "react-native";

export default function () {
  const { colors, theme } = useSettings();
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    button: {
      position: "absolute",
      bottom: 10,
      right: 15,
      width: 50,
      backgroundColor:
        theme === "light"
          ? "#fff"
          : theme === "dark"
          ? "rgba(22, 0, 66, 0.87)"
          : colorScheme === "light"
          ? "#fff"
          : "rgba(22, 0, 66, 0.87)",
      borderRadius: 100,
      boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    },
    button_icon: {
      fontSize: 50,
      color: colors.accent,
    },
  });

  return (
    <Link href="/add-task" style={styles.button}>
      <Ionicons name="add-circle" style={styles.button_icon} />
    </Link>
  );
}
