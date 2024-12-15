import { Tabs } from "expo-router";
import { fonts } from "@/misc/settings";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "@/contexts/SettingsProvider";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const { colors, theme } = useSettings();
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.black,
        tabBarStyle: {
          height: 60,
          backgroundColor:
            theme === "light"
              ? "#E8FFFC"
              : theme === "dark"
              ? "#0B0222"
              : colorScheme === "light"
              ? "#E8FFFC"
              : "#0B0222",
          shadowColor: "transparent",
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "checkbox-sharp" : "checkbox-outline"}
              size={19}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-outline"}
              color={color}
              size={19}
            />
          ),
        }}
      />
    </Tabs>
  );
}
