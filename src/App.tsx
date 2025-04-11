
import { ThemeInitializer } from "@/ui/theme/ThemeInitializer"
import { Routes } from "@/router/Routes"
import { AuthProvider } from "@/auth/components/AuthProvider"
import { Toaster } from "@/shared/ui/core/toaster"
import { Toaster as SonnerToaster } from "@/shared/ui/core/sonner"

function App() {
  return (
    <ThemeInitializer defaultTheme="Impulsivity">
      <AuthProvider>
        <Routes />
        <Toaster />
        <SonnerToaster />
      </AuthProvider>
    </ThemeInitializer>
  )
}

export default App
