
import { adminRouter } from '@/admin/router';
import { RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export default function AdminWithTanstack() {
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <>
      <RouterProvider router={adminRouter} />
      {isDev && (
        <>
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
          <TanStackRouterDevtools initialIsOpen={false} position="bottom-left" />
        </>
      )}
    </>
  );
}
