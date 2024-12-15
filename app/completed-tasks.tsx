import ViewModal from "@/components/ViewModal";
import { useSettings } from "@/contexts/SettingsProvider";
import { fonts } from "@/misc/settings";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StyleSheet } from "react-native";

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

export default function CompletedTasks() {
  const { bgImage, colors } = useSettings();

  const [todos, setTodos] = useState<GroupedTodos[]>([]);
  const [inViewTask, setInViewTask] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
    isVisible: false,
  });
  const [noTasks, setNoTasks] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getSetTodos();
    }, [])
  );

  const closeInViewModal = () => {
    return setInViewTask({
      id: "",
      title: "",
      description: "",
      date: "",
      isVisible: false,
    });
  };

  const getSetTodos = async () => {
    try {
      const getTodos = await AsyncStorage.getItem("todos");

      if (getTodos) {
        let todosGrp = JSON.parse(getTodos);
        todosGrp = todosGrp?.reduce((acc: GroupedTodos[], item: Props) => {
          let { date, ...rest } = item;
          if (acc?.length > 0) {
            let group = acc?.find((g) => g.date === date);
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
        let hasTasks = todosGrp?.some((date: GroupedTodos) =>
          date?.tasks?.some((todo) => todo.completed)
        );
        setNoTasks(!hasTasks);
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error(error);
    }
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
            let getTodos = await AsyncStorage.getItem("todos");
            let storedTodos: Props[] = getTodos ? JSON.parse(getTodos) : [];
            let target = storedTodos?.find((todo: Props) => todo?.id === id);
            if (!target) {
              console.error("Task not found!");
              return;
            }
            let updatedTarget = { ...target, completed: false };
            let updatedTodos = storedTodos?.filter(
              (todo: Props) => todo?.id !== id
            );
            updatedTodos?.push(updatedTarget);
            await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
            return getSetTodos();
          },
        },
      ]
    );
  };

  const handleDeleteTask = async (id: string) => {
    Alert.alert(
      "Revert Completion",
      "Are you sure to mark the task as incomplete?",
      [
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
            return getSetTodos();
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: 17,
      fontFamily: fonts.SpaceGroteskLight,
      color: colors.black,
    },
    container: {
      width: "100%",
      flex: 1,
      padding: 20,
      flexDirection: "column",
      gap: 5,
    },
  });

  return (
    <ImageBackground
      source={bgImage}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 22,
            fontFamily: fonts.SpaceGroteskSemiBold,
            color: "#E8FFFC",
            marginBottom: 10,
            textAlign: "center",
            backgroundColor: "rgba(10, 200, 10, 0.5)",
            backdropFilter: "blur(10px)",
            paddingVertical: 5,
            borderRadius: 25,
            boxShadow: "0px 3px 5px rgba(0,0,0,0.01)",
            borderWidth: 2,
            borderColor: colors.success,
          }}
        >
          Done!
        </Text>

        <ScrollView>
          <View>
            {todos?.map(
              (date) =>
                date?.tasks?.filter((task) => task?.completed)?.length > 0 && (
                  <View
                    key={date?.date}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.SpaceGroteskMedium,
                        color: colors.accent,
                      }}
                    >
                      {date?.date}{" "}
                      {new Date(date?.date).toDateString() ===
                        new Date(Date.now() + 86400000).toDateString() &&
                        "(Tomorrow)"}
                      {new Date(date?.date).toDateString() ===
                        new Date(Date.now()).toDateString() && "(Today)"}
                    </Text>
                    {date?.tasks
                      ?.filter((task) => task?.completed)
                      ?.map((todo) => (
                        <View
                          key={todo?.id}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "rgba(0, 230, 0, 0.3)",
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
                              <Text style={styles.text}>{todo?.title}</Text>
                              <Text
                                style={[
                                  styles.text,
                                  { fontSize: 15, opacity: 60 },
                                ]}
                              >
                                {todo?.description?.slice(0, 20)}...
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
                      ))}
                  </View>
                )
            )}
            {noTasks && (
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: fonts.SpaceGroteskRegular,
                  fontSize: 16,
                  marginTop: 20,
                  color: colors.black,
                }}
              >
                No completed tasks!{" "}
                <Link href="/" style={{ color: colors.primary }}>
                  View all tasks
                </Link>
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
      {/* <ViewModal
        id={inViewTask?.id}
        title={inViewTask?.title}
        description={inViewTask?.description}
        date={inViewTask?.date}
        isVisible={inViewTask?.isVisible}
        closeInViewModal={closeInViewModal}
      /> */}
    </ImageBackground>
  );
}
