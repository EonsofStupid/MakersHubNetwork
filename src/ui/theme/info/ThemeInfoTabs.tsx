
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/core/tabs";
import { TextWithPopup } from "./TextWithPopup";
import { useTheme } from "@/ui/theme/theme-provider";
import { ThemeToken } from "@/types/theme.types";
import { ThemeComponentPreview } from "../ThemeComponentPreview";

export function ThemeInfoTabs() {
  const { theme, tokens } = useTheme();

  return (
    <Tabs defaultValue="about">
      <TabsList className="w-full">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
      </TabsList>
      <TabsContent value="about" className="space-y-4">
        <div className="pt-4">
          <h3 className="font-medium">Current Theme</h3>
          <p className="text-sm text-muted-foreground">{theme?.name || 'Default'}</p>
        </div>
        <ThemeComponentPreview />
      </TabsContent>
      <TabsContent value="tokens" className="space-y-2">
        <div className="pt-4">
          <h3 className="font-medium mb-2">Theme Tokens</h3>
          <div className="space-y-1">
            {tokens && Object.entries(tokens).map(([key, token]) => (
              <TextWithPopup 
                key={key} 
                label={key} 
                text={String(token.value)} 
              />
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
