'use client'

import { NavLink } from './NavLink'
import { Button } from '@/components/ui/button'
import { MessageCircle, Timer, LayoutDashboard } from 'lucide-react'
import { useChatState } from '@/features/chat-bot'
import { APP_NAME } from '@/shared/config/constants'

export function Header() {
  const { open } = useChatState()

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-teal-700">{APP_NAME}</h1>

            <nav className="flex items-center gap-2">
              <NavLink href="/timer">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  타이머
                </div>
              </NavLink>
              <NavLink href="/dashboard">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  대시보드
                </div>
              </NavLink>
            </nav>
          </div>

          <Button onClick={open} className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
            <MessageCircle className="w-4 h-4" />
            AI 도우미
          </Button>
        </div>
      </div>
    </header>
  )
}
