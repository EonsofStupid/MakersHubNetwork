import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group bg-black/90 text-white border border-[#41f0db]/30 shadow-[0_0_15px_rgba(65,240,219,0.2)] backdrop-blur-xl",
          title: "text-white font-semibold",
          description: "text-white/80",
          actionButton: "bg-[#41f0db]/20 text-white border border-[#41f0db]/50 hover:bg-[#41f0db]/30",
          cancelButton: "bg-white/5 text-white border border-white/10 hover:bg-white/10",
          closeButton: "bg-transparent text-white/50 hover:text-white",
          success: "!bg-black/90 border-[#41f0db]/30 text-[#41f0db]",
          error: "!bg-black/90 border-red-500/30 text-red-400",
          info: "!bg-black/90 border-blue-500/30 text-blue-400",
          warning: "!bg-black/90 border-yellow-500/30 text-yellow-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }