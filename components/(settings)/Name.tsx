import { useSettings } from "@/contexts/SettingsProvider";
import { fonts } from "@/misc/settings";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Name() {
  const { colors } = useSettings();

  // States
  const [userName, setUserName] = useState("");

  useFocusEffect(
    useCallback(() => {
      const getSetUser = async () => {
        let user = await AsyncStorage.getItem("user");
        if (user) {
          setUserName(JSON.parse(user)?.name);
        } else {
          setUserName("");
          router.replace("/welcome");
        }
      };
      getSetUser();
    }, [])
  );

  const handleUpdateName = async () => {
    if (userName?.length === 0) return alert("Please type your name to save.");
    await AsyncStorage.setItem(
      "user",
      JSON.stringify({
        name: userName,
        loggedIn: new Date().toLocaleTimeString(),
      })
    );
    return alert("Your name was updated successfully.");
  };

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
          marginBottom: -3,
        }}
      >
        Your name
      </Text>
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.5)",
          borderRadius: 10,
          padding: 3,
          paddingLeft: 10,
          marginTop: 10,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,1)",
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 3,
          alignItems: "center",
        }}
      >
        <MaterialIcons name="edit" size={20} color="rgba(0,0,0,0.34)" />
        <TextInput
          placeholder="Your name"
          maxLength={20}
          value={userName}
          onChangeText={setUserName}
          style={{
            width: "70%",
            fontFamily: fonts.SpaceGroteskRegular,
            fontSize: 18,
          }}
          onSubmitEditing={handleUpdateName}
        />
        <Pressable
          onPress={handleUpdateName}
          style={{
            backgroundColor: colors.accent,
            padding: 8,
            borderRadius: 10,
            width: 80,
            position: "absolute",
            top: 7,
            right: 5,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.SpaceGroteskMedium,
              color: "#fff",
              fontSize: 15,
              textAlign: "center",
            }}
          >
            Update
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
