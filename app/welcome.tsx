import { useSettings } from "@/contexts/SettingsProvider";
import { fonts, loadFonts } from "@/misc/settings";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

export default function Welcome() {
  loadFonts();
  const { colors, bgImage, theme } = useSettings();
  const colorScheme = useColorScheme();

  const [name, setName] = useState<string>("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (name?.length >= 3) {
      setOk(true);
    } else {
      setOk(false);
    }
  }, [name]);

  const handleSetName = async () => {
    try {
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ name, loggedIn: new Date().toLocaleTimeString() })
      );

      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    welcomeText: {
      fontFamily: fonts.SpaceGroteskLight,
      fontSize: 40,
      color: colors.neutral,
    },
    textInput: {
      fontSize: 30,
      fontFamily: fonts.SpaceGroteskMedium,
      color: colors.accent,
    },
    button: {
      marginLeft: "auto",
      marginRight: 70,
    },
    button_icon: {
      fontSize: 50,
      color: colors.neutral,
    },
  });

  return (
    <ImageBackground
      source={bgImage}
      style={{
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <TextInput
          placeholder="Enter your name"
          style={styles.textInput}
          placeholderTextColor={
            theme === "light"
              ? "rgba(0,0,0,0.2)"
              : theme === "dark"
              ? "rgba(255,255,255,0.3)"
              : colorScheme === "light"
              ? "rgba(0,0,0,0.2)"
              : "rgba(255,255,255,0.3)"
          }
          value={name}
          onChangeText={setName}
        />
        <Pressable
          style={[!ok && { opacity: 0, pointerEvents: "none" }, styles.button]}
          onPress={handleSetName}
        >
          <Ionicons name="arrow-forward-circle" style={styles.button_icon} />
        </Pressable>
      </View>
    </ImageBackground>
  );
}
