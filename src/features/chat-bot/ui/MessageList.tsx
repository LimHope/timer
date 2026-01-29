'use client'

import { useEffect, useRef } from 'react'
import { Message } from './Message'

interface MessageListProps {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  isLoading?: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-4">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">
            AI 챗봇에게 공부와 관련된 질문을 해보세요!
          </p>
        </div>
      )}

      {messages.map((message, index) => (
        <Message key={index} role={message.role} content={message.content} />
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-muted rounded-lg px-4 py-2">
            <p className="text-sm text-muted-foreground">입력 중...</p>
          </div>
        </div>
      )}
    </div>
  )
}
