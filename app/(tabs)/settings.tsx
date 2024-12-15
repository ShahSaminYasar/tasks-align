import Name from "@/components/(settings)/Name";
import Theme from "@/components/(settings)/Theme";
import { useSettings } from "@/contexts/SettingsProvider";
import { fonts } from "@/misc/settings";
import {
  Alert,
  ImageBackground,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";

export default function Settings() {
  const { colors, bgImage } = useSettings();

  return (
    <ImageBackground
      source={bgImage}
      style={{
        width: "auto",
        flex: 1,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 25,
          fontFamily: fonts.SpaceGroteskSemiBold,
          color: colors.primary,
          marginBottom: 10,
          marginTop: 25,
        }}
      >
        Your Account
      </Text>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Name />
        <Theme />

        {/* Copyright */}
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 50,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: fonts.SpaceGroteskLight,
              fontSize: 13,
              color: colors.black,
            }}
          >
            Copyright 2024 @{" "}
          </Text>
          <Pressable
            onPress={async () => {
              let url = "https://shahsaminyasar.github.io/linktree";
              let supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              } else {
                return Alert.alert(
                  "Failed to open. Please visit through browser @ https://shahsaminyasar.github.io/portfolio"
                );
              }
            }}
          >
            <Text
              style={{
                fontFamily: fonts.SpaceGroteskBold,
                fontSize: 13,
                color: colors.primary,
              }}
            >
              SHAH SAMIN YASAR
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}
