
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';
import { validateThemeSchema } from '@/admin/theme/utils/themeUtils';
import { validateThemeVariables, logThemeState } from '@/utils/ThemeValidationUtils';
import { useThemeStore } from '@/stores/theme/store';

const logger = getLogger('ThemeDebugger', { category: LogCategory.THEME as string });

interface ThemeDebuggerProps {
  showControls?: boolean;
}

export function ThemeDebugger({ showControls = true }: ThemeDebuggerProps) {
  const { currentTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [cssVariablesValid, setCssVariablesValid] = useState<boolean | null>(null);
  
  // Perform validation when theme changes
  useEffect(() => {
    try {
      // Check theme schema
      const issues = currentTheme ? validateThemeSchema(currentTheme) : ['No theme loaded'];
      setValidationIssues(issues);
      
      // Check CSS variables
      const cssValid = validateThemeVariables();
      setCssVariablesValid(cssValid);
      
      // Log current state
      if (issues.length > 0 || !cssValid) {
        logger.warn('Theme validation issues detected', { 
          details: { 
            schemaIssues: issues, 
            cssVariablesValid: cssValid,
            themeName: currentTheme?.name || 'none'
          } 
        });
        logThemeState();
      }
    } catch (error) {
      logger.error('Error during theme validation', { details: safeDetails(error) });
    }
  }, [currentTheme]);
  
  // Check if there are issues
  const hasIssues = validationIssues.length > 0 || cssVariablesValid === false;
  
  if (!hasIssues && !showControls) {
    return null;
  }
  
  return (
    <Alert variant={hasIssues ? "destructive" : "default"} className="mb-4">
      <AlertTitle>Theme Status</AlertTitle>
      <AlertDescription>
        {hasIssues ? (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex items-center justify-between">
              <p>Found {validationIssues.length} issues with the current theme.</p>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  {isOpen ? 'Hide' : 'Show'} Details
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="mt-2">
              <div className="p-2 rounded bg-muted/20">
                <p className="mb-2 font-semibold">Theme Schema Issues:</p>
                {validationIssues.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {validationIssues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">✅ No schema issues</p>
                )}
                
                <p className="mt-4 mb-2 font-semibold">CSS Variables Status:</p>
                {cssVariablesValid === false ? (
                  <p className="text-sm">❌ Critical CSS variables are missing</p>
                ) : cssVariablesValid === true ? (
                  <p className="text-sm">✅ All critical CSS variables are set</p>
                ) : (
                  <p className="text-sm">⏳ CSS variable validation not yet run</p>
                )}
                
                <div className="mt-4 space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      logThemeState();
                      logger.info('Theme state logged to console');
                    }}
                  >
                    Log Theme State
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <p>✅ Theme is valid and correctly applied.</p>
        )}
      </AlertDescription>
    </Alert>
  );
}
