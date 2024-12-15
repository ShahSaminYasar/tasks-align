import { Text, View } from "react-native";
import TodosListView from "./TodosListView";
import { fonts } from "@/misc/settings";
import { useSettings } from "@/contexts/SettingsProvider";

type TodoGroup = {
  group: string;
  todos: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    date: string;
  }>;
};

type Props = {
  todoGroup: TodoGroup;
  getSetTodos: () => void;
};

export default function TodosGroupView({ todoGroup, getSetTodos }: Props) {
  const { colors } = useSettings();

  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.6)",
        padding: 12,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.02)",
        boxShadow: "0px 1px 2px rgba(0,0,0,0.04)",
        borderRadius: 10,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.SpaceGroteskSemiBold,
          fontSize: 18,
          textTransform: "capitalize",
          marginBottom: 0,
          color: colors.accent,
        }}
      >
        {todoGroup?.group}
      </Text>
      <TodosListView
        todosList={todoGroup?.todos}
        getSetTodos={getSetTodos}
        group={todoGroup?.group}
      />
    </View>
  );
}
