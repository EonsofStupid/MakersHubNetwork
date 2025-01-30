import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { MobileLayout } from './layouts/MobileLayout'
import { MobileRoutes } from './routes/MobileRoutes'

const MobileApp = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MobileLayout>
          <MobileRoutes />
        </MobileLayout>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default MobileApp 