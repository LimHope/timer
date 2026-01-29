'use client'

import { create } from 'zustand'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatState {
  messages: Message[]
  isOpen: boolean
  isLoading: boolean

  open: () => void
  close: () => void
  addMessage: (role: 'user' | 'assistant', content: string) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
}

export const useChatState = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  addMessage: (role, content) =>
    set((state) => ({
      messages: [...state.messages, { role, content }]
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] })
}))
