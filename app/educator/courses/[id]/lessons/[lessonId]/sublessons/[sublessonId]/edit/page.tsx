'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/clientAuth'
import { SublessonEditor } from '@/app/components/educator/SublessonEditor'

interface Sublesson {
  id: number
  title: string
  lessonType: 'code' | 'quiz' | 'video'
  index: number
  lessonId: number
  videoUrl?: string
  videoStart?: number
  videoEnd?: number
  sublessonContent?: {
    lessonText: string
    defaultCode?: string
    abstractedCode?: string
    testRunner?: string
    demoData?: string
    documentationData?: any
    hintsData?: any
    quizData?: any
    videoUrl?: string
    videoStart?: number
    videoEnd?: number
  }
}

export default function SublessonEditPage() {
  const { id: courseId, lessonId, sublessonId } = useParams()
  const { userId, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [sublesson, setSublesson] = useState<Sublesson | null>(null)
  const [allSublessons, setAllSublessons] = useState<Sublesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    // Skip auth check in development
    if (process.env.NODE_ENV === 'development') {
      fetchData()
      return
    }

    if (!userId) {
      router.push('/sign-in')
      return
    }

    fetchData()
  }, [courseId, lessonId, sublessonId, userId, authLoading, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch the specific sublesson
      const sublessonResponse = await fetch(`/api/sublessons/${sublessonId}`)
      if (!sublessonResponse.ok) {
        throw new Error('Failed to fetch sublesson')
      }
      const sublessonData = await sublessonResponse.json()
      console.log('Fetched sublesson data:', sublessonData)
      setSublesson(sublessonData.sublesson)

      // Fetch all sublessons for navigation
      const allSublessonsResponse = await fetch(`/api/sublessons?lessonId=${lessonId}`)
      if (!allSublessonsResponse.ok) {
        throw new Error('Failed to fetch sublessons list')
      }
      const allSublessonsData = await allSublessonsResponse.json()
      setAllSublessons(allSublessonsData.sublessons || [])

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading sublesson...</div>
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

  if (!sublesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Sublesson not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SublessonEditor 
        sublesson={sublesson}
        allSublessons={allSublessons}
        courseId={courseId as string}
        lessonId={lessonId as string}
        onSave={(updatedSublesson: Sublesson) => {
          setSublesson(updatedSublesson)
        }}
        onNavigate={(newSublessonId: number) => {
          router.push(`/educator/courses/${courseId}/lessons/${lessonId}/sublessons/${newSublessonId}/edit`)
        }}
      />
    </div>
  )
}