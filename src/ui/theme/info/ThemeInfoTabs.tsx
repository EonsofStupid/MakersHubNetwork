
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/core/tabs";
import { ThemeInfoTab } from "./ThemeInfoTab";
import { ThemeTokenTab } from "./ThemeTokenTab";
import { ThemeComponentPreview } from "../ThemeComponentPreview";
import { useThemeStore } from "@/stores/theme/store";

export function ThemeInfoTabs() {
  const { theme } = useThemeStore();

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
        <TabsTrigger value="components">Components</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="space-y-4 mt-2">
        <div className="text-sm space-y-2">
          <h3 className="font-medium">Current Theme: {theme.name}</h3>
          <p className="text-muted-foreground">
            The current theme defines the visual appearance of the UI.
          </p>
          <ThemeInfoTab />
        </div>
      </TabsContent>
      
      <TabsContent value="tokens" className="mt-2">
        <ThemeTokenTab />
      </TabsContent>
      
      <TabsContent value="components" className="mt-2">
        <ThemeComponentPreview />
      </TabsContent>
    </Tabs>
  );
}
