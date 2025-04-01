
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { getDefaultAdminPreferences } from '@/admin/utils/adminInitialization';

interface AdminState {
  // Layout configuration
  sidebarExpanded: boolean;
  showLabels: boolean;
  topnavItems: string[];
  dashboardItems: string[];
  activeSection: string;
  isDarkMode: boolean;
  themePreference: string;
  layoutPreference: string;
  shortcuts: string[];
  
  // UI State
  syncing: boolean;
  syncError: string | null;
  lastSynced: Date | null;
  
  // Runtime state
  hasInitialized: boolean;
  editMode: boolean;
  permissions: string[];
  
  // Database state
  adminShortcutsId: string | null;
  
  // Actions
  toggleSidebar: () => void;
  toggleShowLabels: () => void;
  toggleEditMode: () => void;
  toggleDarkMode: () => void;
  setActiveSection: (section: string) => void;
  setThemePreference: (theme: string) => void;
  setLayoutPreference: (layout: string) => void;
  setPinnedTopNavItems: (items: string[]) => void;
  setDashboardItems: (items: string[]) => void;
  setShortcuts: (shortcuts: string[]) => void;
  
  // Admin functionality
  initializeStore: () => Promise<void>;
  loadPermissions: () => Promise<void>;
  savePreferences: () => Promise<void>;
  
  // Reset state
  reset: () => void;
}

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set, get) => ({
        // Layout configuration
        sidebarExpanded: true,
        showLabels: true,
        topnavItems: [],
        dashboardItems: [],
        activeSection: 'overview',
        isDarkMode: false,
        themePreference: 'cyberpunk',
        layoutPreference: 'default',
        shortcuts: [],
        
        // UI State
        syncing: false,
        syncError: null,
        lastSynced: null,
        
        // Runtime state
        hasInitialized: false,
        editMode: false,
        permissions: [],
        
        // Database state
        adminShortcutsId: null,
        
        // Actions
        toggleSidebar: () => set(state => ({ sidebarExpanded: !state.sidebarExpanded })),
        toggleShowLabels: () => set(state => ({ showLabels: !state.showLabels })),
        toggleEditMode: () => set(state => ({ editMode: !state.editMode })),
        toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
        setActiveSection: (section) => set({ activeSection: section }),
        setThemePreference: (theme) => set({ themePreference: theme }),
        setLayoutPreference: (layout) => set({ layoutPreference: layout }),
        setPinnedTopNavItems: (items) => set({ topnavItems: items }),
        setDashboardItems: (items) => set({ dashboardItems: items }),
        setShortcuts: (shortcuts) => set({ shortcuts }),
        
        // Admin functionality
        initializeStore: async () => {
          try {
            set({ syncing: true, syncError: null });
            
            // Load user preferences from the database
            const { data: user } = await supabase.auth.getUser();
            if (!user || !user.user) {
              throw new Error('User not authenticated');
            }
            
            // Get admin shortcuts from database
            const { data: shortcuts, error } = await supabase
              .from('admin_shortcuts')
              .select('*')
              .eq('user_id', user.user.id)
              .single();
            
            if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which just means we need to create a record
              console.error('Error loading admin shortcuts:', error);
              set({ syncError: error.message });
            }
            
            if (shortcuts) {
              // Update state with saved preferences
              set({
                adminShortcutsId: shortcuts.id,
                sidebarExpanded: shortcuts.sidebar_expanded,
                showLabels: shortcuts.show_labels,
                isDarkMode: shortcuts.is_dark_mode,
                topnavItems: shortcuts.topnav_items || [],
                dashboardItems: shortcuts.dashboard_items || [],
                themePreference: shortcuts.theme_preference || 'cyberpunk',
                layoutPreference: shortcuts.layout_preference || 'default',
                activeSection: shortcuts.active_section || 'overview',
                shortcuts: shortcuts.shortcuts || [],
                hasInitialized: true,
                lastSynced: new Date()
              });
            } else {
              // Create a new record with default settings
              const defaults = getDefaultAdminPreferences();
              
              const { data: newShortcuts, error: insertError } = await supabase
                .from('admin_shortcuts')
                .insert({
                  user_id: user.user.id,
                  sidebar_expanded: defaults.sidebarExpanded,
                  show_labels: defaults.showLabels,
                  is_dark_mode: defaults.isDarkMode,
                  topnav_items: defaults.topnavItems,
                  dashboard_items: defaults.dashboardItems,
                  theme_preference: defaults.themePreference,
                  layout_preference: defaults.layoutPreference,
                  active_section: defaults.activeSection,
                  shortcuts: []
                })
                .select()
                .single();
              
              if (insertError) {
                console.error('Error creating admin shortcuts:', insertError);
                set({ syncError: insertError.message });
              }
              
              if (newShortcuts) {
                set({
                  adminShortcutsId: newShortcuts.id,
                  hasInitialized: true,
                  lastSynced: new Date()
                });
              }
            }
          } catch (error) {
            console.error('Error initializing admin store:', error);
            set({ syncError: error instanceof Error ? error.message : 'Unknown error' });
          } finally {
            set({ syncing: false });
          }
        },
        
        loadPermissions: async () => {
          try {
            // Get user roles and permissions
            const { data: user } = await supabase.auth.getUser();
            if (!user || !user.user) {
              throw new Error('User not authenticated');
            }
            
            // Get user roles
            const { data: userRoles, error: rolesError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', user.user.id);
            
            if (rolesError) {
              console.error('Error loading user roles:', rolesError);
              return;
            }
            
            const roles = userRoles.map(ur => ur.role);
            
            // Get permissions for these roles
            const { data: permissionsData, error: permsError } = await supabase
              .from('role_permissions')
              .select('action, subject')
              .in('role', roles);
            
            if (permsError) {
              console.error('Error loading permissions:', permsError);
              return;
            }
            
            // Format permissions as CASL can use
            const permissions = permissionsData.map(p => `${p.action}:${p.subject}`);
            set({ permissions });
            
          } catch (error) {
            console.error('Error loading permissions:', error);
          }
        },
        
        savePreferences: async () => {
          const state = get();
          if (!state.adminShortcutsId) {
            console.warn('Cannot save preferences: No admin shortcuts ID');
            return;
          }
          
          try {
            set({ syncing: true, syncError: null });
            
            // Update record in database
            const { error } = await supabase
              .from('admin_shortcuts')
              .update({
                sidebar_expanded: state.sidebarExpanded,
                show_labels: state.showLabels,
                is_dark_mode: state.isDarkMode,
                topnav_items: state.topnavItems,
                dashboard_items: state.dashboardItems,
                theme_preference: state.themePreference,
                layout_preference: state.layoutPreference,
                active_section: state.activeSection,
                shortcuts: state.shortcuts
              })
              .eq('id', state.adminShortcutsId);
            
            if (error) {
              console.error('Error saving admin preferences:', error);
              set({ syncError: error.message });
            } else {
              set({ lastSynced: new Date() });
            }
          } catch (error) {
            console.error('Error saving preferences:', error);
            set({ syncError: error instanceof Error ? error.message : 'Unknown error' });
          } finally {
            set({ syncing: false });
          }
        },
        
        reset: () => {
          const defaults = getDefaultAdminPreferences();
          set({
            sidebarExpanded: defaults.sidebarExpanded,
            showLabels: defaults.showLabels,
            topnavItems: defaults.topnavItems,
            dashboardItems: defaults.dashboardItems,
            isDarkMode: defaults.isDarkMode,
            themePreference: defaults.themePreference,
            layoutPreference: defaults.layoutPreference,
            activeSection: defaults.activeSection,
            hasInitialized: false
          });
        }
      }),
      {
        name: 'admin-store'
      }
    ),
    {
      name: 'AdminStore'
    }
  )
);
