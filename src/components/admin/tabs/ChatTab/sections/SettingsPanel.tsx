
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export const SettingsPanel = () => {
  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Chat Settings
        </CardTitle>
        <CardDescription>
          Configure AI model parameters and user access controls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-model">Default Model</Label>
              <Select defaultValue="gpt-4o-mini">
                <SelectTrigger id="default-model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea 
                id="system-prompt" 
                placeholder="Enter default system prompt here..."
                defaultValue="You are a helpful AI assistant for the MakersImpulse platform, an online community for 3D printing enthusiasts."
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Temperature: 0.7</Label>
              <Slider defaultValue={[0.7]} min={0} max={1} step={0.1} />
            </div>
            
            <div className="space-y-2">
              <Label>Max Response Tokens: 1024</Label>
              <Slider defaultValue={[1024]} min={256} max={4096} step={256} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="moderation-toggle">Enable Moderation</Label>
              <Switch id="moderation-toggle" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="customization-toggle">Allow User Customization</Label>
              <Switch id="customization-toggle" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t flex justify-end space-x-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};
