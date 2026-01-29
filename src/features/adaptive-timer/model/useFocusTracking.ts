'use client'

import { useEffect, useRef } from 'react'
import { useTimerState } from './useTimerState'
import { calculateFocusScore } from '../lib/calculateFocusScore'

export function useFocusTracking() {
  const { clickTimestamps, recordClick, isRunning } = useTimerState()
  const isMouseMovingRef = useRef<boolean>(false)
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastClickRef = useRef<number>(0)
  const lastKeyPressRef = useRef<number>(0)
  const lastScrollRef = useRef<number>(0)

  useEffect(() => {
    if (!isRunning) return

    // 마우스 이동: 연속된 움직임을 하나로 처리
    const handleMouseMove = () => {
      // 이미 움직이는 중이면 타이머만 리셋
      if (isMouseMovingRef.current) {
        if (mouseMoveTimeoutRef.current) {
          clearTimeout(mouseMoveTimeoutRef.current)
        }
      } else {
        // 새로운 움직임 시작 → 활동 기록
        isMouseMovingRef.current = true
        recordClick()
      }

      // 1초 동안 움직임이 없으면 "멈춤" 상태로 전환
      mouseMoveTimeoutRef.current = setTimeout(() => {
        isMouseMovingRef.current = false
      }, 1000)
    }

    // 클릭: 1초 이내 연속 클릭은 무시
    // AI 도우미 내부 클릭은 제외
    const handleClick = (e: MouseEvent) => {
      // AI 도우미 내부에서의 클릭은 제외
      const target = e.target as HTMLElement
      if (target.closest('[data-ai-helper="true"]')) {
        return
      }

      const now = Date.now()
      if (now - lastClickRef.current > 1000) {
        recordClick()
        lastClickRef.current = now
      }
    }

    // 키보드: 1초 이내 연속 입력은 무시
    // 스페이스바, 엔터, AI 도우미 내부는 제외
    const handleKeyPress = (e: KeyboardEvent) => {
      // 스페이스바와 엔터는 활동 감지에서 제외
      if (e.key === ' ' || e.key === 'Enter') {
        return
      }

      // AI 도우미 내부에서의 입력은 제외
      const target = e.target as HTMLElement
      if (target.closest('[data-ai-helper="true"]')) {
        return
      }

      const now = Date.now()
      if (now - lastKeyPressRef.current > 1000) {
        recordClick()
        lastKeyPressRef.current = now
      }
    }

    // 스크롤: 1초 이내 연속 스크롤은 무시
    // AI 도우미 내부 스크롤은 제외
    const handleScroll = (e: Event) => {
      // AI 도우미 내부에서의 스크롤은 제외
      const target = e.target as HTMLElement
      if (target.closest('[data-ai-helper="true"]')) {
        return
      }

      const now = Date.now()
      if (now - lastScrollRef.current > 1000) {
        recordClick()
        lastScrollRef.current = now
      }
    }

    // 이벤트 리스너 등록
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('scroll', handleScroll)

    return () => {
      // 정리
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('scroll', handleScroll)

      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current)
      }
    }
  }, [isRunning, recordClick])

  const focusScore = calculateFocusScore(clickTimestamps.length)

  return {
    activityCount: clickTimestamps.length,
    focusScore
  }
}
