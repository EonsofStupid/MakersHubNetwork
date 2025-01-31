import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { DesktopLayout } from './layouts/DesktopLayout'
import { DesktopRoutes } from './routes/DesktopRoutes'

const DesktopApp = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <DesktopLayout>
          <DesktopRoutes />
        </DesktopLayout>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default DesktopApp