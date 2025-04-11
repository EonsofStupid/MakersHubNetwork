
import { BrowserRouter as Router, Routes as RouterRoutes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import { MainLayout } from "@/ui/layouts/MainLayout"

const Index = lazy(() => import("@/pages/Index"))
const NotFound = lazy(() => import("@/pages/NotFound"))

export function Routes() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterRoutes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </RouterRoutes>
      </Suspense>
    </Router>
  )
}
