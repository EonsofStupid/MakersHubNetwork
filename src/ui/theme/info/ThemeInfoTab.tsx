
import { TextWithPopup } from "./TextWithPopup";

export function ThemeInfoTab() {
  return (
    <div className="space-y-3 text-xs">
      <div>
        <TextWithPopup 
          text="Dark Mode Support"
          popupContent="The theme supports automatic dark mode switching based on system preferences."
        />
        <p className="text-muted-foreground">
          The theme automatically adapts to your system's dark/light mode preference.
        </p>
      </div>
      
      <div>
        <TextWithPopup 
          text="CSS Variables"
          popupContent="The theme uses CSS variables to maintain consistency across the application."
        />
        <p className="text-muted-foreground">
          CSS variables are used to define colors, spacing, and other design tokens.
        </p>
      </div>
      
      <div>
        <TextWithPopup 
          text="Tailwind Integration"
          popupContent="The theme is built with Tailwind CSS for efficient styling."
        />
        <p className="text-muted-foreground">
          Tailwind CSS is used for all styling in this application.
        </p>
      </div>
    </div>
  );
}
