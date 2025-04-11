
import { ThemeInitializer } from "@/ui/theme/ThemeInitializer"
import { Routes } from "@/router/Routes"
import { AuthProvider } from "@/auth/components/AuthProvider"
import { Toaster } from "@/ui/core/toaster"

function App() {
  return (
    <ThemeInitializer>
      <AuthProvider>
        <Routes />
        <Toaster />
      </AuthProvider>
    </ThemeInitializer>
  )
}

export default App
