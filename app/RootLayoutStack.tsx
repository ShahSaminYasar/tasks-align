import { useSettings } from "@/contexts/SettingsProvider";
import { initializeNotifications } from "@/lib";
import { fonts } from "@/misc/settings";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

initializeNotifications();

export default function RootLayoutStack() {
  const { colors, theme } = useSettings();
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar
        style={
          theme === "light"
            ? "dark"
            : theme === "dark"
            ? "light"
            : colorScheme === "light"
            ? "dark"
            : "light"
        }
      />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-task"
          options={{
            headerStyle: {
              backgroundColor:
                theme === "light"
                  ? "#e1f3fd"
                  : theme === "dark"
                  ? "#002E46"
                  : colorScheme === "light"
                  ? "#e1f3fd"
                  : "#002E46",
            },
            headerTitleAlign: "center",
            headerTintColor: colors.neutral,
            title: "Add Task",
            headerTitleStyle: {
              fontFamily: fonts.SpaceGroteskMedium,
              fontSize: 25,
            },
            headerShadowVisible: true,
          }}
        />
        <Stack.Screen
          name="edit-task"
          options={{
            headerStyle: {
              backgroundColor:
                theme === "light"
                  ? "#e1f3fd"
                  : theme === "dark"
                  ? "#002E46"
                  : colorScheme === "light"
                  ? "#e1f3fd"
                  : "#002E46",
            },
            headerTitleAlign: "center",
            headerTintColor: colors.neutral,
            title: "Edit Task",
            headerTitleStyle: {
              fontFamily: fonts.SpaceGroteskMedium,
              fontSize: 25,
            },
            headerShadowVisible: true,
          }}
        />
      </Stack>
    </>
  );
}
