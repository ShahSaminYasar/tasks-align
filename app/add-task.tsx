import { useSettings } from "@/contexts/SettingsProvider";
import { fonts } from "@/misc/settings";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type GroupItem = {
  group: string;
};

export default function AddTask() {
  const { bgImage, colors } = useSettings();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [group, setGroup] = useState("");
  const [groupList, setGroupList] = useState<string[]>([]);
  const [showGroupList, setShowGroupList] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleSaveTask = async () => {
    try {
      if (title?.length === 0) return alert("Please give a name to the task");

      let todos = [];
      const getTodos = await AsyncStorage.getItem("todos");
      if (getTodos) {
        todos = JSON.parse(getTodos);
      }

      todos.push({
        id: Date.now().toString(),
        title,
        description,
        group: group?.toLowerCase() || "default",
        // date: new Date(date).toISOString().split("T")[0],
        date: new Date(date).toISOString(),
        completed: false,
      });

      await AsyncStorage.setItem("todos", JSON.stringify(todos));

      return router.navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const onSetDate = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const getSetGroups = async () => {
        let todos = await AsyncStorage.getItem("todos");
        if (todos) {
          let parsedTodos: GroupItem[] = JSON.parse(todos);
          if (parsedTodos?.length > 0) {
            setGroupList([...new Set(parsedTodos?.map((item) => item?.group))]);
          } else {
            setGroupList(["study", "work", "game"]);
          }
        } else {
          setGroupList(["study", "work", "game"]);
        }
      };
      getSetGroups();
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      width: "100%",
    },
    form: {
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      backdropFilter: "blur(20px)",
      padding: 15,
      borderRadius: 10,
      boxShadow: "0px 1px 3px rgba(0,0,0,0.06)",
      paddingTop: 20,
      paddingBottom: 50,
    },
    label: {
      fontSize: 14,
      fontFamily: fonts.SpaceGroteskMedium,
      color: colors.accent,
      marginLeft: 3,
      marginBottom: -3,
    },
    input: {
      fontSize: 16,
      fontFamily: fonts.SpaceGroteskMedium,
      padding: 10,
      borderRadius: 5,
      borderColor: "rgba(0, 30, 69, 0.5)",
      borderBottomWidth: 2,
      paddingTop: 10,
    },
    button: {
      paddingHorizontal: 2,
      paddingVertical: 10,
      backgroundColor: colors.accent,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      width: 120,
      justifyContent: "center",
      borderRadius: 5,
      marginLeft: "auto",
      marginTop: 20,
    },
  });

  return (
    <ImageBackground
      source={bgImage}
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>Task Title</Text>
          <TextInput
            placeholder="Task title"
            value={title}
            onChangeText={setTitle}
            style={[
              styles.input,
              {
                marginBottom: 30,
              },
            ]}
          />
          <Text style={styles.label}>Task Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Task description (optional)"
            style={[styles.input]}
            multiline
            numberOfLines={10}
          />

          <Text
            style={[
              styles.label,
              {
                marginTop: 25,
                marginBottom: -10,
              },
            ]}
          >
            Target Date
          </Text>
          <View>
            <Pressable
              style={{
                borderTopWidth: 2,
                borderBottomWidth: 2,
                borderRightWidth: 2,
                borderLeftWidth: 2,
                borderColor: "rgba(0, 30, 69, 0.5)",
                padding: 5,
                borderRadius: 5,
                marginTop: 20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                if (Platform.OS === "android") {
                  DateTimePickerAndroid.open({
                    value: new Date(),
                    onChange: onSetDate,
                    mode: "date",
                    display: "default",
                  });
                } else {
                  setShowPicker(true);
                }
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                style={{ width: 30 }}
              />
              <Text
                style={{ fontSize: 17, fontFamily: fonts.SpaceGroteskRegular }}
              >
                {date.toLocaleDateString() || "Set Date"}
              </Text>
            </Pressable>
          </View>

          {showPicker && Platform.OS === "ios" && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={onSetDate}
              style={{ width: "100%" }}
            />
          )}

          <Text
            style={[
              styles.label,
              {
                marginTop: 25,
              },
            ]}
          >
            Task Group
          </Text>
          <View style={{ position: "relative" }}>
            <Pressable onPress={() => setShowGroupList((prev) => !prev)}>
              <MaterialIcons
                name="arrow-drop-down"
                size={35}
                color={colors.accent}
                style={{
                  position: "absolute",
                  top: 5,
                  left: -5,
                  transform: showGroupList ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </Pressable>
            <TextInput
              value={group}
              onChangeText={setGroup}
              placeholder="Ex. study, work..."
              style={[styles.input, { marginLeft: 25 }]}
              onFocus={() => setShowGroupList(true)}
            />
            {showGroupList && (
              <ScrollView
                style={{
                  width: 170,
                  maxHeight: 150,
                  backgroundColor: "rgba(255,255,255,0.99)",
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 2,
                  borderWidth: 2,
                  borderColor: colors.lowOpacity,
                  boxShadow: "0px 2px 10px rgba(0,0,0,0.06)",
                }}
              >
                <Pressable
                  style={{
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.lowOpacity,
                  }}
                  onPress={() => {
                    setGroup("default");
                    setShowGroupList(false);
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.SpaceGroteskMedium,
                      color: colors.neutral,
                      textTransform: "capitalize",
                    }}
                  >
                    Default
                  </Text>
                </Pressable>
                {groupList
                  ?.filter((items) => items !== "default")
                  ?.map((groupItem) => (
                    <Pressable
                      key={groupItem}
                      style={{
                        padding: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.lowOpacity,
                      }}
                      onPress={() => {
                        setGroup(groupItem);
                        setShowGroupList(false);
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.SpaceGroteskMedium,
                          color: colors.neutral,
                          textTransform: "capitalize",
                        }}
                      >
                        {groupItem}
                      </Text>
                    </Pressable>
                  ))}
              </ScrollView>
            )}
          </View>

          <Pressable style={styles.button} onPress={handleSaveTask}>
            <Ionicons name="save" style={{ color: "white", fontSize: 15 }} />
            <Text
              style={{
                color: "white",
                fontSize: 15,
                fontFamily: fonts.SpaceGroteskMedium,
              }}
            >
              Save Task
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}
