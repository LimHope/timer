import axios from 'axios'

export async function sendMessage(message: string): Promise<string> {
  try {
    const response = await axios.post('/api/chat', { message })
    return response.data.reply
  } catch (error) {
    console.error('Failed to send message:', error)
    throw new Error('메시지 전송에 실패했습니다.')
  }
}
