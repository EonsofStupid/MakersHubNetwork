
import React from 'react';
import { Admin, Resource } from 'react-admin';
import { dataProvider } from '@/admin/integrations/supabase/client';
import { authProvider } from '@/admin/integrations/supabase/authProvider';
import { UsersTab } from '@/admin/tabs/UsersTab';
import { ContentTab } from "@/admin/tabs/ContentTab";
import { OverviewTab } from '@/admin/tabs/OverviewTab';

const App = () => (
  <Admin
    title="3D Printer Parts Database Admin"
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={OverviewTab}
  >
    <Resource name="users" list={UsersTab} />
    <Resource name="content" options={{ label: 'Content' }} render={ContentTab} />
  </Admin>
);

export default App;
