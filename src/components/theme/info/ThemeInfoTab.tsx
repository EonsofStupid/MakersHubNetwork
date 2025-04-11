import { Theme } from "@/types/theme";
import { TextWithPopup } from "./TextWithPopup";

interface ThemeInfoTabProps {
  currentTheme: Theme;
}

export function ThemeInfoTab({ currentTheme }: ThemeInfoTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary glitch">{currentTheme.name}</h3>
          <div className="flex items-center space-x-2 mt-2">
            <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
              v{currentTheme.version}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-secondary/20 text-secondary border border-secondary/30">
              {currentTheme.status}
            </span>
            {currentTheme.is_default && (
              <span className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent border border-accent/30">
                Default Theme
              </span>
            )}
          </div>
        </div>
      </div>

      {currentTheme.description && (
        <TextWithPopup text={currentTheme.description} label="Description" />
      )}

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Details</h4>
          <div className="space-y-1">
            <TextWithPopup text={currentTheme.cache_key || 'Not generated'} label="Cache Key" />
            <TextWithPopup text={currentTheme.parent_theme_id || 'None'} label="Parent Theme" />
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Timestamps</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Created: {new Date(currentTheme.created_at || '').toLocaleDateString()}</p>
            <p>Updated: {new Date(currentTheme.updated_at || '').toLocaleDateString()}</p>
            {currentTheme.published_at && (
              <p>Published: {new Date(currentTheme.published_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 