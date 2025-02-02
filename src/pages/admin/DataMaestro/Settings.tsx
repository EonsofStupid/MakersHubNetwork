import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DatabaseSettingsCard from "@/components/admin/data-maestro/settings/DatabaseSettingsCard";
import ImportSettingsCard from "@/components/admin/data-maestro/settings/ImportSettingsCard";
import InterfaceSettingsCard from "@/components/admin/data-maestro/settings/InterfaceSettingsCard";

interface Settings {
  [key: string]: any;
}

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = {} } = useQuery<Settings>({
    queryKey: ["data-maestro-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) {
        toast({
          title: "Error fetching settings",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      return data || {};
    }
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: boolean }) => {
      const { error } = await supabase
        .from("admin_settings")
        .upsert({
          setting_key: key,
          setting_value: value.toString(),
          setting_type: "string"
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-maestro-settings"] });
      toast({
        title: "Settings Updated",
        description: "Your changes have been saved successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSettingChange = (key: string, value: boolean) => {
    updateSetting.mutate({ key, value });
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Data Maestro Settings
        </h1>
        <p className="text-muted-foreground">
          Configure and customize your Data Maestro experience
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <DatabaseSettingsCard
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ImportSettingsCard
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <InterfaceSettingsCard
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;