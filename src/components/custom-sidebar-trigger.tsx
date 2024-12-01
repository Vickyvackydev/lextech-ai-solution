"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface CustomTriggerProps {
  className?: string
  isHistoryOpen?: boolean
}

export function CustomTrigger({ className, isHistoryOpen }: CustomTriggerProps) {
  const { 
    isMobile,
    open,
    toggleSidebar,
  } = useSidebar()

  const getTranslateX = () => {
    if (isHistoryOpen) {
      return open ? "translate-x-[580px]" : "translate-x-[365px]"
    } else if (isMobile) {
      return open ? "translate-x-[5px]" : "translate-x-16"
    }
    return open ? "translate-x-[275px]" : "translate-x-16"
  }

  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "fixed top-3 z-50 flex h-6 w-6 items-center justify-center rounded-lg border bg-background shadow-sm transition-all duration-300",
        getTranslateX(),
        className
      )}
      aria-label="Toggle Sidebar"
    >
      {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </button>
  )
}