'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { useChatState } from '../model/useChatState'
import { sendMessage } from '../api/sendMessage'
import { useToast } from '@/hooks/use-toast'

export function ChatModal() {
  const { isOpen, close, messages, addMessage, isLoading, setLoading } = useChatState()
  const { toast } = useToast()

  const handleSend = async (message: string) => {
    addMessage('user', message)
    setLoading(true)

    try {
      const reply = await sendMessage(message)
      addMessage('assistant', reply)
    } catch (error) {
      toast({
        title: '오류',
        description: '메시지 전송에 실패했습니다.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI 공부 도우미</DialogTitle>
        </DialogHeader>

        <MessageList messages={messages} isLoading={isLoading} />

        <div className="border-t pt-4">
          <MessageInput onSend={handleSend} disabled={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
