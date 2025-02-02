import { useState } from "react";
import { useSettingsFetch } from "./handlers/useSettingsFetch";
import { useSettingsUpdateHandlers } from "./handlers/useSettingsUpdateHandlers";
import { useSettingsReset } from "./handlers/useSettingsReset";

export const useSettingsForm = () => {
  const { data: settings, isLoading } = useSettingsFetch();
  const { 
    isSaving, 
    logoFile, 
    faviconFile, 
    handleLogoUpload, 
    handleFaviconUpload, 
    handleSettingsUpdate 
  } = useSettingsUpdateHandlers();
  const { isResetting, handleResetToDefault } = useSettingsReset();

  return {
    settings,
    isLoading,
    isSaving,
    isResetting,
    logoFile,
    faviconFile,
    handleLogoUpload,
    handleFaviconUpload,
    handleSettingsUpdate,
    handleResetToDefault,
  };
};