import AddTask from "@/components/AddTaskBtn";
import Greeting from "@/components/Greeting";
import TodoList from "@/components/TodoList";
import { useSettings } from "@/contexts/SettingsProvider";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function Home() {
  const { bgImage } = useSettings();
  return (
    <ImageBackground
      source={bgImage}
      style={{
        width: "auto",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.container}>
        <Greeting />
        <TodoList />
        <AddTask />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: "column",
    gap: 5,
    width: "100%",
  },
});
