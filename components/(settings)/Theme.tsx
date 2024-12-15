import { useSettings } from "@/contexts/SettingsProvider";
import { fonts } from "@/misc/settings";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

export default function Theme() {
  const { colors, setTheme, theme } = useSettings();
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255, 0.5)",
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderRadius: 10,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: fonts.SpaceGroteskMedium,
          color: colors.accent,
          marginLeft: 3,
          marginBottom: 10,
        }}
      >
        App theme
      </Text>

      <Pressable
        onPress={() => setTheme("device")}
        style={[
          styles.themeBtn,
          {
            backgroundColor: "#2757cf",
            borderColor:
              theme === "device" ? "rgba(50, 168, 82, 0.6)" : "transparent",
          },
        ]}
      >
        <Ionicons
          name="phone-portrait-outline"
          size={25}
          style={[styles.themeBtnIcon, { color: "#fff" }]}
        />
        <Text style={[styles.themeBtnTxt, { color: "#fff" }]}>Device</Text>
        {theme === "device" && (
          <Ionicons
            name="checkmark-sharp"
            color="rgba(50, 168, 82, 1)"
            size={25}
            style={{
              position: "absolute",
              right: 12,
            }}
          />
        )}
      </Pressable>

      <Pressable
        onPress={() => setTheme("light")}
        style={[
          styles.themeBtn,
          {
            borderColor:
              theme === "light" ? "rgba(50, 168, 82, 0.6)" : "transparent",
          },
        ]}
      >
        <Ionicons name="sunny-outline" size={25} style={styles.themeBtnIcon} />
        <Text style={styles.themeBtnTxt}>Light</Text>
        {theme === "light" && (
          <Ionicons
            name="checkmark-sharp"
            color="rgba(50, 168, 82, 1)"
            size={25}
            style={{
              position: "absolute",
              right: 12,
            }}
          />
        )}
      </Pressable>

      <Pressable
        onPress={() => setTheme("dark")}
        style={[
          styles.themeBtn,
          {
            backgroundColor: "#000",
            borderColor:
              theme === "dark" ? "rgba(50, 168, 82, 0.6)" : "transparent",
          },
        ]}
      >
        <Ionicons
          name="moon-outline"
          size={25}
          style={[styles.themeBtnIcon, { color: "#fff" }]}
        />
        <Text style={[styles.themeBtnTxt, { color: "#fff" }]}>Dark</Text>
        {theme === "dark" && (
          <Ionicons
            name="checkmark-sharp"
            color="rgba(50, 168, 82, 1)"
            size={25}
            style={{
              position: "absolute",
              right: 12,
            }}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  themeBtn: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "#ffcc00",
    borderWidth: 5,
    borderColor: "transparent",
    borderRadius: 10,
    marginVertical: 6,
    boxShadow: "0px 1px 5px rgba(0,0,0,0.03)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    position: "relative",
  },
  themeBtnIcon: {
    width: 30,
  },
  themeBtnTxt: {
    fontFamily: fonts.SpaceGroteskMedium,
    fontSize: 18,
    color: "#000",
  },
});
