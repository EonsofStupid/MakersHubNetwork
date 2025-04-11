
import { Button } from "@/ui/core/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/core/card";
import { Label } from "@/ui/core/label";
import { Switch } from "@/ui/core/switch";

export function ThemeComponentPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Theme component preview</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="theme-mode">Mode</Label>
          <Switch id="theme-mode" />
        </div>
        <div className="grid gap-2">
          <Label>Buttons</Label>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Default</Button>
            <Button size="sm" variant="secondary">Secondary</Button>
            <Button size="sm" variant="outline">Outline</Button>
            <Button size="sm" variant="ghost">Ghost</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="ml-auto">Save changes</Button>
      </CardFooter>
    </Card>
  );
}
