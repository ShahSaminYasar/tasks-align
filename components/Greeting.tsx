import { useSettings } from "@/contexts/SettingsProvider";
import { fonts, loadFonts } from "@/misc/settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  name: string;
  loggedIn: string;
};

export default function Greeting() {
  loadFonts();
  const { colors } = useSettings();
  // States
  const [greeting, setGreeting] = useState<string>("");
  const [user, setUser] = useState<Props>({ name: "", loggedIn: "" });

  useFocusEffect(
    useCallback(() => {
      // Greeting
      const time = new Date().getHours();
      if (time >= 5 && time < 12) {
        setGreeting("morning");
      } else if (time >= 12 && time <= 14) {
        setGreeting("noon");
      } else if (time > 14 && time < 17) {
        setGreeting("afternoon");
      } else if (time >= 17 && time <= 19) {
        setGreeting("evening");
      } else {
        setGreeting("night");
      }

      // Name
      const getName = async () => {
        const getUser = await AsyncStorage.getItem("user");
        if (!getUser) {
          router.replace("/welcome");
        } else {
          setUser(JSON.parse(getUser));
        }
      };

      getName();
    }, [])
  );

  const styles = StyleSheet.create({
    greeting: {
      fontSize: 30,
      fontFamily: fonts.SpaceGroteskBold,
      color: colors.primary,
      paddingHorizontal: 10,
      marginTop: 30,
    },
  });

  return (
    <Text style={styles.greeting}>
      Good {greeting},{" "}
      <Text style={{ fontFamily: fonts.SpaceGroteskLight }}>{user?.name}</Text>
    </Text>
  );
}
