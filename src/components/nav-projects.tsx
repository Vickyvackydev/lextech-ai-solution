"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
  HistoryIcon,
  Frame,
} from "lucide-react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { fetcher } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { shareChat, deleteChatById } from "@/lib/actions/chat"

interface NavProjectsProps {
  onToggleHistory: () => void
  isHistoryOpen: boolean
}

interface ChatHistory {
  id: string
  title: string
  summary: string
  lastMessageAt: string
}

export function NavProjects({
  onToggleHistory,
  isHistoryOpen
}: NavProjectsProps) {
  const router = useRouter()
  const { isMobile, open } = useSidebar()

  // Fetch chat history with 10-minute revalidation
  const { data: chatHistory, isLoading, mutate } = useSWR<ChatHistory[]>(
    '/api/history',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 600000,
      fallbackData: [],
    }
  )

  // Convert chat history to projects format
  const projects = chatHistory
    ?.slice(0, 13)
    .map(chat => ({
      name: chat.title || 'Untitled Chat',
      url: `/chat/${chat.id}`,
      id: chat.id,
      icon: Frame as LucideIcon,
    })) || []

  const handleShareChat = async (chatId: string) => {
    const shareUrl = await shareChat(chatId, "telegram")
    window.open(shareUrl, '_blank')
  }

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await deleteChatById(chatId)
      await mutate() // Refresh the chat list
    } catch (error) {
      console.error("Error deleting chat:", error)
    }
  }

  const handleChatClick = (url: string, e: React.MouseEvent) => {
    e.preventDefault()
    router.push(url)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>History</SidebarGroupLabel>
      
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="History">
          {open ? null :
            <a href="#" onClick={(e) => {
              e.preventDefault()
              onToggleHistory()
            }}>
              <HistoryIcon />
              <span>History</span>
            </a>
          }
          </SidebarMenuButton>
        </SidebarMenuItem>

        {isLoading ? (
          // Show skeletons while loading
          Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton>
                <div className="flex items-center space-x-2 w-full">
                  <div className="w-4 h-4 rounded-sm bg-gray-200 animate-pulse" />
                  <div className="h-4 flex-1 rounded bg-gray-200 animate-pulse" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        ) : !open ? null : projects.length === 0 ? (
          <SidebarMenuItem>
            <div className="px-2 py-4 text-sm text-muted-foreground text-center italic">
              No chat history yet
            </div>
          </SidebarMenuItem>
        ) : projects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <a 
                href={item.url}
                onClick={(e) => handleChatClick(item.url, e)}
                className="cursor-pointer"
              >
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push(item.url)
                }}>
                  <Folder className="text-muted-foreground" />
                  <span>View Chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleShareChat(item.id)
                }}>
                  <Forward className="text-muted-foreground" />
                  <span>Share Chat</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => handleDeleteChat(item.id, e)}
                  className="text-red-600"
                >
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}

        {!open || isLoading ? null : 
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="text-sidebar-foreground/70 cursor-pointer"
              onClick={onToggleHistory}
            >
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>{isHistoryOpen ? 'less' : 'more'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        }
      </SidebarMenu>
    </SidebarGroup>
  )
}