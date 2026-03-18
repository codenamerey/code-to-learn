'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/clientAuth'
import { LessonEditor } from '@/app/components/educator/LessonEditor'
import type { FullLesson } from '@/types/educator'

export default function LessonEditPage() {
  const { id: courseId, lessonId } = useParams()
  const { userId, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [lesson, setLesson] = useState<FullLesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    // Skip auth check in development
    if (process.env.NODE_ENV === 'development') {
      fetchLesson()
      return
    }

    if (!userId) {
      router.push('/sign-in')
      return
    }

    fetchLesson()
  }, [courseId, lessonId, userId, authLoading, router])

  const fetchLesson = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/educator/courses/${courseId}/lessons/${lessonId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch lesson')
      }

      const data = await response.json()
      setLesson(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading lesson...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Lesson not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LessonEditor 
        lesson={lesson} 
        courseId={courseId as string}
        onSave={(updatedLesson: FullLesson) => {
          setLesson(updatedLesson)
        }}
      />
    </div>
  )
}