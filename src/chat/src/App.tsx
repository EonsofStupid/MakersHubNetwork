
import { BrowserRouter as Router } from "react-router-dom"
import { Toaster } from "@/ui/core/toaster"
import { Toaster as SonnerToaster } from "@/ui/core/sonner"
import { TooltipProvider } from "@/ui/core/tooltip"

function App() {
  return (
    <Router>
      <TooltipProvider>
        <div className="chat-app">
          {/* Your routes and components go here */}
          <Toaster />
          <SonnerToaster />
        </div>
      </TooltipProvider>
    </Router>
  )
}

export default App
