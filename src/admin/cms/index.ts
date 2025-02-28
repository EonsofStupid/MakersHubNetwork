import React from 'react';
import { Admin, Resource } from 'react-admin';
import { dataProvider } from '@/admin/integrations/supabase/client';
import { authProvider } from '@/admin/integrations/supabase/authProvider';
import { UserList, UserEdit, UserCreate } from '@/admin/components/users';
import { PartList, PartEdit, PartCreate } from '@/admin/components/parts';
import { ReviewList } from '@/admin/components/reviews';
import { Dashboard } from '@/admin/components/dashboard';
import { ContentTab } from "@/admin/tabs/ContentTab"

const App = () => (
  <Admin
    title="3D Printer Parts Database Admin"
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={Dashboard}
  >
    <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
    <Resource name="printer_parts" list={PartList} edit={PartEdit} create={PartCreate} />
    <Resource name="reviews" list={ReviewList} />
    <Resource name="content" options={{ label: 'Content' }} render={ContentTab} />
  </Admin>
);

export default App;
