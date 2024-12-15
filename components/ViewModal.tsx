import { useSettings } from "@/contexts/SettingsProvider";
import { fonts } from "@/misc/settings";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  id: string;
  title: string;
  date: string;
  description: string;
  isVisible: boolean;
  group: string;
  completed: boolean;
  closeInViewModal: () => void;
};

export default function ViewModal({
  id,
  title,
  date,
  description,
  isVisible,
  group,
  completed,
  closeInViewModal,
}: Props) {
  const { colors, theme } = useSettings();
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    modalLayer: {
      flex: 1,
      backgroundColor: "rgba(100,100,100,0.75)",
    },
    modalContainer: {
      width: "100%",
      minHeight: 350,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      position: "absolute",
      bottom: 0,
      backgroundColor:
        theme === "light"
          ? "#E8FFFC"
          : theme === "dark"
          ? "#0B0222"
          : colorScheme === "light"
          ? "#E8FFFC"
          : "#0B0222",
      boxShadow: "0px 0px 3px rgba(0,0,0,0.05)",
      padding: 25,
    },
    title: {
      fontFamily: fonts.SpaceGroteskSemiBold,
      fontSize: 25,
      textAlign: "left",
      color: colors.primary,
    },
    date: {
      fontFamily: fonts.SpaceGroteskMedium,
      fontSize: 14,
      color: colors.neutral,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor:
        theme === "light"
          ? "rgba(0,0,0,0.05)"
          : theme === "dark"
          ? "rgba(255,255,255,0.2)"
          : colorScheme === "light"
          ? "rgba(0,0,0,0.05)"
          : "rgba(255,255,255,0.2)",
      marginBottom: 10,
    },
    description: {
      fontFamily: fonts.SpaceGroteskLight,
      fontSize: 16,
      color: colors.black,
    },
    closeBtn: {
      position: "absolute",
      top: 20,
      right: 20,
      width: 30,
      opacity: 0.45,
    },
  });

  return (
    <View>
      <Modal visible={isVisible} animationType="slide" transparent={true}>
        <View style={styles.modalLayer}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text
              style={{
                fontFamily: fonts.SpaceGroteskMedium,
                fontSize: 14,
                color: colors.pending,
                marginVertical: 2,
              }}
            >
              Group: {group?.toUpperCase()}
            </Text>
            <Text style={styles.date}>
              Target date:{" "}
              {new Date(date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
            {description?.length > 0 ? (
              <>
                <Text
                  style={{
                    fontFamily: fonts.SpaceGroteskMedium,
                    fontSize: 14,
                    color:
                      theme === "light"
                        ? "rgba(0,0,0,0.25)"
                        : theme === "dark"
                        ? "rgba(255,255,255,0.38)"
                        : colorScheme === "light"
                        ? "rgba(0,0,0,0.25)"
                        : "rgba(255,255,255,0.38)",
                    marginBottom: 2,
                  }}
                >
                  Description
                </Text>
                <Text style={styles.description}>{description}</Text>
              </>
            ) : (
              <Text style={styles.description}>No description</Text>
            )}

            <Text
              style={{
                backgroundColor: completed ? colors.success : colors.failed,
                width: 78,
                fontFamily: fonts.SpaceGroteskMedium,
                fontSize: 12,
                color: "#fff",
                textAlign: "center",
                borderRadius: 10,
                paddingBottom: 2,
                marginVertical: 20,
              }}
            >
              {completed ? "Complete" : "Incomplete"}
            </Text>
            <Pressable
              style={styles.closeBtn}
              onPress={() => closeInViewModal()}
            >
              <Ionicons
                name="close-circle-outline"
                size={30}
                color={colors.black}
              />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
