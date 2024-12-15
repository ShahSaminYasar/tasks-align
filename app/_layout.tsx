import { SettingsProvider } from "@/contexts/SettingsProvider";
import { loadFonts } from "@/misc/settings";
import RootLayoutStack from "./RootLayoutStack";

export default function RootLayout() {
  loadFonts();

  return (
    <SettingsProvider>
      <RootLayoutStack />
    </SettingsProvider>
  );
}
