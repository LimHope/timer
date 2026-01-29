import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function sendMessage(messages: Message[]): Promise<string> {
  try {
    const response = await axios.post('/api/chat', { messages })
    return response.data.reply
  } catch (error) {
    console.error('Failed to send message:', error)
    throw new Error('메시지 전송에 실패했습니다.')
  }
}
