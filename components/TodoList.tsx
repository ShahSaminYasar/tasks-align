import { fonts, loadFonts } from "@/misc/settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import TodosGroupView from "./TodosGroupView";
import { useSettings } from "@/contexts/SettingsProvider";

type Props = {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  group: string;
};

type GroupedTodos = {
  group: string;
  todos: Omit<Props, "group">[];
};

export default function TodoList() {
  loadFonts();
  const { colors } = useSettings();

  const [todosGroups, setTodosGroups] = useState<GroupedTodos[]>([]);

  const getSetTodos = async () => {
    try {
      const getTodos = await AsyncStorage.getItem("todos");

      if (getTodos) {
        let todosGrp = JSON.parse(getTodos);
        todosGrp = todosGrp
          ?.sort(
            (a: Props, b: Props) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          ?.reduce((acc: GroupedTodos[], item: Props) => {
            let { group, ...rest } = item;
            if (acc?.length > 0) {
              let targetGroup = acc?.find((g) => g.group === group);
              if (targetGroup) {
                targetGroup.todos.push(rest);
              } else {
                acc.push({ group, todos: [rest] });
              }
            } else {
              acc.push({ group, todos: [rest] });
            }
            return acc;
          }, []);
        setTodosGroups(todosGrp);
      } else {
        setTodosGroups([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getSetTodos();
    }, [])
  );

  return (
    <View>
      <Text
        style={{
          fontSize: 22,
          fontFamily: fonts.SpaceGroteskSemiBold,
          color: colors.primary,
          marginBottom: 10,
          marginTop: 4,
          paddingHorizontal: 10,
        }}
      >
        Your Todos
      </Text>

      <ScrollView style={{ paddingHorizontal: 7 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
            marginBottom: 150,
          }}
        >
          {todosGroups?.length > 0 ? (
            todosGroups?.map((todoGroup) => (
              <TodosGroupView
                key={todoGroup?.group}
                todoGroup={todoGroup}
                getSetTodos={getSetTodos}
              />
            ))
          ) : (
            <Text
              style={{
                textAlign: "center",
                fontFamily: fonts.SpaceGroteskRegular,
                fontSize: 16,
                marginTop: 20,
                color: colors.black,
              }}
            >
              You haven't added any todos yet.{" "}
              <Link
                href="/add-task"
                style={{
                  color: colors.primary,
                  fontFamily: fonts.SpaceGroteskSemiBold,
                }}
              >
                Add now
              </Link>
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
