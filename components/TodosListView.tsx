import { fonts } from "@/misc/settings";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, useColorScheme } from "react-native";
import { Pressable, Text } from "react-native";
import { View } from "react-native";
import ViewModal from "./ViewModal";
import { useSettings } from "@/contexts/SettingsProvider";

type Props = {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
};

type GroupedTodos = {
  date: string;
  tasks: Omit<Props, "date">[];
};

type ParamsProps = {
  todosList: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    completed: boolean;
  }>;
  getSetTodos: () => void;
  group: string;
};

export default function TodosListView({
  todosList,
  getSetTodos,
  group,
}: ParamsProps) {
  const { colors, theme } = useSettings();
  const colorScheme = useColorScheme();

  const [todos, setTodos] = useState<GroupedTodos[]>([]);
  const [inViewTask, setInViewTask] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
    isVisible: false,
    group: "",
    completed: false,
  });

  useEffect(() => {
    if (todosList) {
      let todosGrp = todosList?.reduce((acc: GroupedTodos[], item: Props) => {
        let { date, ...rest } = item;
        if (acc?.length > 0) {
          let group = acc?.find(
            (g) => g.date?.split("T")[0] === date?.split("T")[0]
          );
          if (group) {
            group.tasks.push(rest);
          } else {
            acc.push({ date, tasks: [rest] });
          }
        } else {
          acc.push({ date, tasks: [rest] });
        }
        return acc;
      }, []);
      todosGrp = todosGrp.sort((a: GroupedTodos, b: GroupedTodos) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return dateA - dateB; // Ascending order
      });
      setTodos(todosGrp);
    } else {
      setTodos([]);
    }
  }, [todosList]);

  const handleMarkAsDone = async (id: string) => {
    Alert.alert(
      "Confirm Completion", // Title of the alert
      "Are you sure to mark the task as completed?", // Message
      [
        {
          text: "Cancel", // Button label
          onPress: () => console.log("Task not marked as completed"), // Action on cancel
          style: "cancel", // Optional, makes it look like a cancel button
        },
        {
          text: "Yes", // Button label
          onPress: async () => {
            // console.log("Marking...");
            let getTodos = await AsyncStorage.getItem("todos");
            let storedTodos: Props[] = getTodos ? JSON.parse(getTodos) : [];
            const updatedTodos = storedTodos?.map((todo) =>
              todo?.id === id ? { ...todo, completed: true } : todo
            );
            await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
            // console.log("Task Marked");

            return getSetTodos();
          },
        },
      ]
    );
  };

  const handleUnmarkAsDone = async (id: string) => {
    Alert.alert(
      "Revert Completion",
      "Are you sure to mark the task as incomplete?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Task not marked as incomplete"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            // console.log("Unmarking...");
            let getTodos = await AsyncStorage.getItem("todos");
            let storedTodos: Props[] = getTodos ? JSON.parse(getTodos) : [];
            const updatedTodos = storedTodos?.map((todo) =>
              todo?.id === id ? { ...todo, completed: false } : todo
            );
            await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
            // console.log("Task Unmarked");

            return getSetTodos();
          },
        },
      ]
    );
  };

  const handleDeleteTask = async (id: string) => {
    Alert.alert("Delete Task", "Are you sure to delete the task?", [
      {
        text: "Cancel",
        onPress: () => console.log("Task not confirmed for deletion"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          let getTodos = await AsyncStorage.getItem("todos");
          let storedTodos: Props[] = getTodos ? JSON.parse(getTodos) : [];
          let updatedTodos = storedTodos?.filter(
            (todo: Props) => todo?.id !== id
          );
          await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
          // console.log("Task Deleted");
          return getSetTodos();
        },
      },
    ]);
  };

  const closeInViewModal = () => {
    return setInViewTask({
      id: "",
      title: "",
      description: "",
      date: "",
      isVisible: false,
      group: "",
      completed: false,
    });
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: 17,
      fontFamily: fonts.SpaceGroteskLight,
      color: "rgba(255, 255, 255, 0.70)",
    },
  });

  return (
    <>
      {todos?.length > 0
        ? todos?.map((date) => (
            <View key={date?.date}>
              <Text
                style={{
                  fontFamily: fonts.SpaceGroteskMedium,
                  color: colors.accent,
                  marginBottom: 2,
                  marginTop: 7,
                }}
              >
                {Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(date?.date))}{" "}
                {/* {new Date(date?.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })} */}
                {new Date(date?.date).toDateString() ===
                  new Date(Date.now() + 86400000).toDateString() &&
                  "(Tomorrow)"}
                {new Date(date?.date).toDateString() ===
                  new Date(Date.now()).toDateString() && "(Today)"}
              </Text>
              {date?.tasks?.map((todo) =>
                !todo?.completed ? (
                  <View
                    key={todo?.id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor:
                        theme === "light"
                          ? "rgba(255, 255, 255, 0.8)"
                          : theme === "dark"
                          ? "rgba(255, 255, 255, 0.5)"
                          : colorScheme === "light"
                          ? "rgba(255, 255, 255, 0.8)"
                          : "rgba(255, 255, 255, 0.5)",
                      gap: 10,
                      borderRadius: 10,
                      paddingVertical: 7,
                      paddingHorizontal: 10,
                      marginVertical: 4,
                      boxShadow: "0px 1px 5px rgba(0,0,0,0.05)",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 18,
                        alignItems: "center",
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          setInViewTask({
                            id: todo?.id,
                            date: date?.date,
                            title: todo?.title,
                            description: todo?.description,
                            isVisible: true,
                            group: group,
                            completed: todo?.completed,
                          });
                        }}
                        style={{
                          padding: 5,
                          borderWidth: 1,
                          borderColor: colors.neutral,
                          borderRadius: 5,
                        }}
                      >
                        <Ionicons
                          name="eye-outline"
                          size={20}
                          color={colors.neutral}
                        />
                      </Pressable>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: 1,
                        }}
                      >
                        <Text
                          style={[
                            styles.text,
                            {
                              fontFamily: fonts.SpaceGroteskRegular,
                              color: colors.secondary,
                            },
                          ]}
                        >
                          {todo?.title}
                        </Text>
                        <Text
                          style={[
                            styles.text,
                            {
                              fontSize: 13,
                              opacity: 0.8,
                              color: colors.secondary,
                            },
                          ]}
                        >
                          {todo?.description?.length > 0
                            ? todo?.description?.length > 22
                              ? todo?.description?.slice(0, 22) + "..."
                              : todo?.description
                            : "No description"}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                      }}
                    >
                      <Pressable
                        style={{
                          padding: 5,
                          borderWidth: 2,
                          borderColor: colors.neutral,
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          router.push({
                            pathname: "/edit-task",
                            params: {
                              id: todo?.id,
                              title: todo?.title,
                              description: todo?.description,
                              date: date?.date,
                              group: group,
                            },
                          });
                        }}
                      >
                        <Ionicons
                          name="pencil-sharp"
                          size={20}
                          color={colors.neutral}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => handleMarkAsDone(todo?.id)}
                        style={{
                          padding: 5,
                          borderWidth: 2,
                          borderColor: colors.success,
                          borderRadius: 5,
                        }}
                      >
                        <Ionicons
                          name="checkmark-done-sharp"
                          size={20}
                          color={colors.success}
                        />
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View
                    key={todo?.id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor:
                        theme === "light"
                          ? "rgba(4, 189, 44, 0.45)"
                          : theme === "dark"
                          ? "rgba(6, 157, 84, 0.45)"
                          : colorScheme === "light"
                          ? "rgba(4, 189, 44, 0.45)"
                          : "rgba(6, 157, 84, 0.45)",
                      gap: 10,
                      borderRadius: 10,
                      paddingVertical: 7,
                      paddingHorizontal: 10,
                      marginVertical: 4,
                      boxShadow: "0px 1px 5px rgba(0,0,0,0.05)",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 18,
                        alignItems: "center",
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          setInViewTask({
                            id: todo?.id,
                            date: date?.date,
                            title: todo?.title,
                            description: todo?.description,
                            isVisible: true,
                            completed: todo?.completed,
                            group: group,
                          });
                        }}
                        style={{
                          padding: 5,
                          borderWidth: 1,
                          borderColor: "rgba(255, 255, 255, 0.65)",
                          borderRadius: 5,
                        }}
                      >
                        <Ionicons
                          name="eye-outline"
                          size={20}
                          color="rgba(255, 255, 255, 0.65)"
                        />
                      </Pressable>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: 1,
                        }}
                      >
                        <Text
                          style={[
                            styles.text,
                            {
                              fontFamily: fonts.SpaceGroteskRegular,
                              textDecorationLine: "line-through",
                            },
                          ]}
                        >
                          {todo?.title}
                        </Text>
                        <Text
                          style={[
                            styles.text,
                            {
                              fontSize: 13,
                              opacity: 0.8,
                            },
                          ]}
                        >
                          {todo?.description?.length > 0
                            ? todo?.description?.length > 22
                              ? todo?.description?.slice(0, 22) + "..."
                              : todo?.description
                            : "No description"}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                      }}
                    >
                      <Pressable
                        onPress={() => handleUnmarkAsDone(todo?.id)}
                        style={{
                          padding: 5,
                          borderWidth: 2,
                          borderColor: colors.pending,
                          borderRadius: 5,
                          backgroundColor: colors.pendingLow,
                        }}
                      >
                        <Ionicons
                          name="return-down-back-sharp"
                          size={20}
                          color="#fff"
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => handleDeleteTask(todo?.id)}
                        style={{
                          padding: 5,
                          borderWidth: 2,
                          borderColor: colors.failed,
                          borderRadius: 5,
                          backgroundColor: colors.failed,
                        }}
                      >
                        <Ionicons
                          name="trash-bin-outline"
                          size={20}
                          color="#fff"
                        />
                      </Pressable>
                    </View>
                  </View>
                )
              )}
            </View>
          ))
        : null}
      <ViewModal
        id={inViewTask?.id}
        title={inViewTask?.title}
        description={inViewTask?.description}
        date={inViewTask?.date}
        isVisible={inViewTask?.isVisible}
        closeInViewModal={closeInViewModal}
        group={inViewTask?.group}
        completed={inViewTask?.completed}
      />
    </>
  );
}
