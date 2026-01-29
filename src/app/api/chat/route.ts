import { openai } from '@/shared/api/openai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Using OpenAI Chat Completions API with full conversation history
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful study assistant. Provide clear, accurate, and educational answers. Always respond in Korean. Use examples when helpful and break down complex topics into understandable parts.'
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const reply = response.choices[0]?.message?.content || '응답을 생성할 수 없습니다.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    )
  }
}
