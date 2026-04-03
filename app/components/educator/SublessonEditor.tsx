'use client'

import { useState, useEffect } from 'react'
import { Editor } from '@monaco-editor/react'
import { EditorLayout } from './EditorLayout'
import { ContentPreview } from './ContentPreview'
import { useAutoSave } from '@/hooks/useAutoSave'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Save, FileText, Code, Lightbulb, BookOpen, Video, ChevronLeft, ChevronRight, Square, Circle, Triangle, Settings, Puzzle, Edit3 } from 'lucide-react'
import type { SublessonFormData, Hint, DocClass, DocMethod, DocProperty, DbQuiz, DbCodeChallenge, DbFillInBlank } from '@/types/educator'

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

interface SublessonEditorProps {
  sublesson: Sublesson
  allSublessons: Sublesson[]
  courseId: string
  lessonId: string
  onSave: (sublesson: Sublesson) => void
  onNavigate: (sublessonId: number) => void
}

export function SublessonEditor({ sublesson, allSublessons, courseId, lessonId, onSave, onNavigate }: SublessonEditorProps) {
  // Debug: Log the received sublesson data
  console.log('SublessonEditor received sublesson:', sublesson)
  console.log('SublessonEditor sublessonContent:', sublesson.sublessonContent)

  // Helper function to safely parse JSON strings
  const safeJsonParse = (value: string | object | undefined, defaultValue: any = {}) => {
    if (!value) return defaultValue
    if (typeof value === 'object') return value
    try {
      return JSON.parse(value)
    } catch (e) {
      console.warn('Failed to parse JSON:', value, e)
      return defaultValue
    }
  }

  // Initialize form data from sublesson
  const [formData, setFormData] = useState<SublessonFormData>(() => {
    console.log('Initializing form data with sublesson:', sublesson)
    console.log('sublesson.sublessonContent:', sublesson.sublessonContent)
    
    return {
      title: sublesson.title,
      lessonType: sublesson.lessonType,
      lessonText: sublesson.sublessonContent?.lessonText || '',
      index: sublesson.index,
      defaultCode: safeJsonParse(sublesson.sublessonContent?.defaultCode, {}),
      abstractedCode: safeJsonParse(sublesson.sublessonContent?.abstractedCode, {}),
      testRunner: safeJsonParse(sublesson.sublessonContent?.testRunner, {}),
      demoData: safeJsonParse(sublesson.sublessonContent?.demoData, {}),
      documentationData: sublesson.sublessonContent?.documentationData || [],
      hintsData: sublesson.sublessonContent?.hintsData || [],
      videoUrl: sublesson.sublessonContent?.videoUrl || sublesson.videoUrl || '',
      videoStart: sublesson.sublessonContent?.videoStart || sublesson.videoStart || 0,
      videoEnd: sublesson.sublessonContent?.videoEnd || sublesson.videoEnd || 0,
    }
  })

  const [activeCodeTab, setActiveCodeTab] = useState('javascript')
  const [isDirty, setIsDirty] = useState(false)
  const [activeSection, setActiveSection] = useState('basic')

  // Database exercises state
  const [dbQuizzes, setDbQuizzes] = useState<DbQuiz[]>([])
  const [dbCodeChallenges, setDbCodeChallenges] = useState<DbCodeChallenge[]>([])
  const [dbFillInBlanks, setDbFillInBlanks] = useState<DbFillInBlank[]>([])

  // Fill-in-blank answers state (moved from render function to avoid hook order issues)
  const [blankAnswersMap, setBlankAnswersMap] = useState<Record<number, any[]>>({})
  const [loadingAnswersMap, setLoadingAnswersMap] = useState<Record<number, boolean>>({})
  
  // Quiz questions state
  const [quizQuestionsMap, setQuizQuestionsMap] = useState<Record<number, any[]>>({})
  const [loadingQuestionsMap, setLoadingQuestionsMap] = useState<Record<number, boolean>>({})
  const [expandedQuizzes, setExpandedQuizzes] = useState<Record<number, boolean>>({})

  const saveSublesson = async (data: SublessonFormData) => {
    try {
      console.log('Saving sublesson data:', data)
      
      // Send the data to API - let the API handle JSON serialization
      const response = await fetch(`/api/sublessons/${sublesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save sublesson')
      }

      const result = await response.json()
      console.log('Save result:', result)
      onSave(result.sublesson)
      setIsDirty(false)
      return result
    } catch (error) {
      console.error('Error saving sublesson:', error)
      throw error
    }
  }

  const { status, forceSave } = useAutoSave(formData, {
    onSave: saveSublesson,
    debounceMs: 2000,
    enabled: isDirty
  })

  const updateFormData = (updates: Partial<SublessonFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    setIsDirty(true)
  }

  const updateCodeField = (field: keyof SublessonFormData, language: string, code: string) => {
    const currentField = formData[field] as Record<string, string> || {}
    updateFormData({
      [field]: {
        ...currentField,
        [language]: code
      }
    })
  }

  // Find current sublesson index and navigation info
  const currentIndex = allSublessons.findIndex(s => s.id === sublesson.id)
  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < allSublessons.length - 1

  const navigateToPrevious = () => {
    if (canGoPrevious) {
      onNavigate(allSublessons[currentIndex - 1].id)
    }
  }

  const navigateToNext = () => {
    if (canGoNext) {
      onNavigate(allSublessons[currentIndex + 1].id)
    }
  }

  // Only include JS, Python, and TypeScript
  const codeLanguages = [
    { id: 'javascript', label: 'JavaScript', icon: Square },
    { id: 'python', label: 'Python', icon: Circle },
    { id: 'typescript', label: 'TypeScript', icon: Triangle }
  ]

  const addHint = () => {
    const newHint: Hint = {
      id: `hint_${Date.now()}`,
      title: 'New Hint',
      content: 'Hint content here...'
    }
    const currentHints = Array.isArray(formData.hintsData) ? formData.hintsData : []
    updateFormData({
      hintsData: [...currentHints, newHint]
    })
  }

  const updateHint = (index: number, field: keyof Hint, value: string) => {
    const currentHints = Array.isArray(formData.hintsData) ? formData.hintsData : []
    const hints = [...currentHints]
    if (hints[index]) {
      hints[index] = { ...hints[index], [field]: value }
      updateFormData({ hintsData: hints })
    }
  }

  const removeHint = (index: number) => {
    const currentHints = Array.isArray(formData.hintsData) ? formData.hintsData : []
    const hints = [...currentHints]
    hints.splice(index, 1)
    updateFormData({ hintsData: hints })
  }

  const addDocumentationClass = () => {
    const newDoc: DocClass = {
      className: 'NewClass',
      description: 'Class description...',
      usage: 'const instance = new NewClass();',
      methods: [],
      properties: []
    }
    updateFormData({
      documentationData: [...(formData.documentationData || []), newDoc]
    })
  }

  const updateDocumentation = (index: number, field: keyof DocClass, value: any) => {
    const docs = [...(formData.documentationData || [])]
    docs[index] = { ...docs[index], [field]: value }
    updateFormData({ documentationData: docs })
  }

  const removeDocumentation = (index: number) => {
    const docs = [...(formData.documentationData || [])]
    docs.splice(index, 1)
    updateFormData({ documentationData: docs })
  }

  // Methods management
  const addMethod = (docIndex: number) => {
    const newMethod: DocMethod = {
      method: 'newMethod',
      description: 'Method description...',
      returnType: 'void'
    }
    const docs = [...(formData.documentationData || [])]
    docs[docIndex] = {
      ...docs[docIndex],
      methods: [...(docs[docIndex].methods || []), newMethod]
    }
    updateFormData({ documentationData: docs })
  }

  const updateMethod = (docIndex: number, methodIndex: number, field: keyof DocMethod, value: string) => {
    const docs = [...(formData.documentationData || [])]
    const methods = [...(docs[docIndex].methods || [])]
    methods[methodIndex] = { ...methods[methodIndex], [field]: value }
    docs[docIndex] = { ...docs[docIndex], methods }
    updateFormData({ documentationData: docs })
  }

  const removeMethod = (docIndex: number, methodIndex: number) => {
    const docs = [...(formData.documentationData || [])]
    const methods = [...(docs[docIndex].methods || [])]
    methods.splice(methodIndex, 1)
    docs[docIndex] = { ...docs[docIndex], methods }
    updateFormData({ documentationData: docs })
  }

  // Properties management
  const addProperty = (docIndex: number) => {
    const newProperty: DocProperty = {
      type: 'Read/Write',
      property: 'newProperty',
      dataType: 'string',
      description: 'Property description...'
    }
    const docs = [...(formData.documentationData || [])]
    docs[docIndex] = {
      ...docs[docIndex],
      properties: [...(docs[docIndex].properties || []), newProperty]
    }
    updateFormData({ documentationData: docs })
  }

  const updateProperty = (docIndex: number, propIndex: number, field: keyof DocProperty, value: string) => {
    const docs = [...(formData.documentationData || [])]
    const properties = [...(docs[docIndex].properties || [])]
    properties[propIndex] = { ...properties[propIndex], [field]: value }
    docs[docIndex] = { ...docs[docIndex], properties }
    updateFormData({ documentationData: docs })
  }

  const removeProperty = (docIndex: number, propIndex: number) => {
    const docs = [...(formData.documentationData || [])]
    const properties = [...(docs[docIndex].properties || [])]
    properties.splice(propIndex, 1)
    docs[docIndex] = { ...docs[docIndex], properties }
    updateFormData({ documentationData: docs })
  }

  // Database exercises functions
  useEffect(() => {
    fetchDbExercises()
  }, [sublesson.id])

  // Load fill-in-blank answers for all fill-in-blanks
  useEffect(() => {
    dbFillInBlanks.forEach(fillInBlank => {
      if (!blankAnswersMap[fillInBlank.id]) {
        fetchBlankAnswers(fillInBlank.id)
      }
    })
  }, [dbFillInBlanks])

  // Load quiz questions for all quizzes
  useEffect(() => {
    dbQuizzes.forEach(quiz => {
      if (!quizQuestionsMap[quiz.id]) {
        fetchQuizQuestions(quiz.id)
      }
    })
  }, [dbQuizzes])

  const fetchBlankAnswers = async (fillInBlankId: number) => {
    try {
      setLoadingAnswersMap(prev => ({ ...prev, [fillInBlankId]: true }))
      const response = await fetch(`/api/exercises/fill-in-blanks/${fillInBlankId}/answers/`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', await response.text())
        return
      }
      
      const result = await response.json()
      if (result.success) {
        setBlankAnswersMap(prev => ({ ...prev, [fillInBlankId]: result.answers || [] }))
      }
    } catch (error) {
      console.error('Error fetching blank answers:', error)
    } finally {
      setLoadingAnswersMap(prev => ({ ...prev, [fillInBlankId]: false }))
    }
  }

  const fetchQuizQuestions = async (quizId: number) => {
    try {
      setLoadingQuestionsMap(prev => ({ ...prev, [quizId]: true }))
      const response = await fetch(`/api/exercises/quizzes/${quizId}/questions/`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', await response.text())
        return
      }
      
      const result = await response.json()
      if (result.success) {
        setQuizQuestionsMap(prev => ({ ...prev, [quizId]: result.questions || [] }))
      }
    } catch (error) {
      console.error('Error fetching quiz questions:', error)
    } finally {
      setLoadingQuestionsMap(prev => ({ ...prev, [quizId]: false }))
    }
  }

  const fetchDbExercises = async () => {
    try {
      const [quizzesRes, codeChallengesRes, fillInBlanksRes] = await Promise.all([
        fetch(`/api/exercises/quizzes?sublessonId=${sublesson.id}`),
        fetch(`/api/exercises/code-challenges?sublessonId=${sublesson.id}`),
        fetch(`/api/exercises/fill-in-blanks?sublessonId=${sublesson.id}`)
      ])

      const [quizzesData, codeChallengesData, fillInBlanksData] = await Promise.all([
        quizzesRes.json(),
        codeChallengesRes.json(),
        fillInBlanksRes.json()
      ])

      if (quizzesData.success) setDbQuizzes(quizzesData.quizzes || [])
      if (codeChallengesData.success) setDbCodeChallenges(codeChallengesData.codeChallenges || [])
      if (fillInBlanksData.success) setDbFillInBlanks(fillInBlanksData.fillInBlanks || [])
    } catch (error) {
      console.error('Error fetching exercises:', error)
    }
  }

  const createQuiz = async (quizData: Partial<DbQuiz>) => {
    try {
      const response = await fetch('/api/exercises/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quizData,
          sublessonId: sublesson.id,
          index: dbQuizzes.length
        })
      })
      const result = await response.json()
      if (result.success) {
        setDbQuizzes(prev => [...prev, result.quiz])
      }
    } catch (error) {
      console.error('Error creating quiz:', error)
    }
  }

  const updateQuiz = async (quizId: number, updates: Partial<DbQuiz>) => {
    try {
      const response = await fetch(`/api/exercises/quizzes/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const result = await response.json()
      if (result.success) {
        setDbQuizzes(prev => prev.map(quiz => quiz.id === quizId ? { ...quiz, ...updates } : quiz))
      }
    } catch (error) {
      console.error('Error updating quiz:', error)
    }
  }

  const deleteQuiz = async (quizId: number) => {
    try {
      const response = await fetch(`/api/exercises/quizzes/${quizId}`, { method: 'DELETE' })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json()
        if (result.success) {
          setDbQuizzes(prev => prev.filter(quiz => quiz.id !== quizId))
        }
      } else {
        // If response is not JSON, assume success if status is ok
        if (response.status === 200) {
          setDbQuizzes(prev => prev.filter(quiz => quiz.id !== quizId))
        }
      }
    } catch (error) {
      console.error('Error deleting quiz:', error)
    }
  }

  const createCodeChallenge = async (challengeData: Partial<DbCodeChallenge>) => {
    try {
      const response = await fetch('/api/exercises/code-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...challengeData,
          sublessonId: sublesson.id,
          index: dbCodeChallenges.length
        })
      })
      const result = await response.json()
      if (result.success) {
        setDbCodeChallenges(prev => [...prev, result.codeChallenge])
      }
    } catch (error) {
      console.error('Error creating code challenge:', error)
    }
  }

  const updateCodeChallenge = async (challengeId: number, updates: Partial<DbCodeChallenge>) => {
    try {
      const response = await fetch(`/api/exercises/code-challenges/${challengeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const result = await response.json()
      if (result.success) {
        setDbCodeChallenges(prev => prev.map(challenge => 
          challenge.id === challengeId ? { ...challenge, ...updates } : challenge
        ))
      }
    } catch (error) {
      console.error('Error updating code challenge:', error)
    }
  }

  const deleteCodeChallenge = async (challengeId: number) => {
    try {
      const response = await fetch(`/api/exercises/code-challenges/${challengeId}`, { method: 'DELETE' })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json()
        if (result.success) {
          setDbCodeChallenges(prev => prev.filter(challenge => challenge.id !== challengeId))
        }
      } else {
        // If response is not JSON, assume success if status is ok
        if (response.status === 200) {
          setDbCodeChallenges(prev => prev.filter(challenge => challenge.id !== challengeId))
        }
      }
    } catch (error) {
      console.error('Error deleting code challenge:', error)
    }
  }

  const createFillInBlank = async (fillInBlankData: Partial<DbFillInBlank>) => {
    try {
      const response = await fetch('/api/exercises/fill-in-blanks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fillInBlankData,
          sublessonId: sublesson.id,
          index: dbFillInBlanks.length
        })
      })
      const result = await response.json()
      if (result.success) {
        setDbFillInBlanks(prev => [...prev, result.fillInBlank])
      }
    } catch (error) {
      console.error('Error creating fill-in-blank:', error)
    }
  }

  const updateFillInBlank = async (fillInBlankId: number, updates: Partial<DbFillInBlank>) => {
    try {
      const response = await fetch(`/api/exercises/fill-in-blanks/${fillInBlankId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const result = await response.json()
      if (result.success) {
        setDbFillInBlanks(prev => prev.map(fillInBlank => 
          fillInBlank.id === fillInBlankId ? { ...fillInBlank, ...updates } : fillInBlank
        ))
      }
    } catch (error) {
      console.error('Error updating fill-in-blank:', error)
    }
  }

  const deleteFillInBlank = async (fillInBlankId: number) => {
    try {
      const response = await fetch(`/api/exercises/fill-in-blanks/${fillInBlankId}`, { method: 'DELETE' })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json()
        if (result.success) {
          setDbFillInBlanks(prev => prev.filter(fillInBlank => fillInBlank.id !== fillInBlankId))
        }
      } else {
        // If response is not JSON, assume success if status is ok
        if (response.status === 200) {
          setDbFillInBlanks(prev => prev.filter(fillInBlank => fillInBlank.id !== fillInBlankId))
        }
      }
    } catch (error) {
      console.error('Error deleting fill-in-blank:', error)
    }
  }

  const addDbQuiz = () => createQuiz({ title: 'New Quiz', description: '' })
  const addDbCodeChallenge = () => createCodeChallenge({ title: 'New Code Challenge', description: '' })
  const addDbFillInBlank = () => createFillInBlank({ title: 'New Fill-in-Blank', text: 'Enter text with ___BLANK___ markers' })

  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Sublesson</h1>
            <p className="text-gray-600 text-sm mt-1">
              Course ID: {courseId} • Lesson ID: {lessonId} • Sublesson {currentIndex + 1} of {allSublessons.length}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {status === 'saving' && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm">Saving...</span>
              </div>
            )}
            {status === 'saved' && (
              <div className="flex items-center text-green-600">
                <div className="h-4 w-4 mr-2">✓</div>
                <span className="text-sm">Saved</span>
              </div>
            )}
            {isDirty && status !== 'saving' && status !== 'saved' && (
              <span className="text-sm text-orange-600 flex items-center">
                <div className="h-2 w-2 bg-orange-500 rounded-full mr-2"></div>
                Unsaved changes
              </span>
            )}
          </div>
          <Button 
            onClick={forceSave} 
            disabled={!isDirty || status === 'saving'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Now
          </Button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <Button
            onClick={navigateToPrevious}
            disabled={!canGoPrevious}
            size="sm"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-gray-600 px-2">
            Sublesson {currentIndex + 1} of {allSublessons.length}
          </span>
          <Button
            onClick={navigateToNext}
            disabled={!canGoNext}
            size="sm"
            variant="outline"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => window.history.back()}
            size="sm"
            variant="outline"
          >
            Back to Lesson
          </Button>
        </div>
      </div>
    </div>
  )

  const renderBasicInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Sublesson Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">Sublesson Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className="mt-1 text-lg font-medium"
            placeholder="Enter sublesson title..."
          />
        </div>

        <div>
          <Label htmlFor="lessonType" className="text-sm font-medium text-gray-700">Sublesson Type</Label>
          <Select 
            value={formData.lessonType}
            onValueChange={(value) => updateFormData({ lessonType: value as 'code' | 'quiz' | 'video' })}
          >
            <option value="code">Code Exercise</option>
            <option value="quiz">Quiz</option>
            <option value="video">Video</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="lessonText" className="text-sm font-medium text-gray-700">
            Sublesson Content (Markdown)
          </Label>
          <Textarea
            id="lessonText"
            value={formData.lessonText}
            onChange={(e) => updateFormData({ lessonText: e.target.value })}
            rows={12}
            className="mt-1 font-mono text-sm"
            placeholder="Write your sublesson content using Markdown..."
          />
          <p className="text-xs text-gray-500 mt-2">
            Supports Markdown formatting, code blocks, and mathematical expressions with KaTeX
          </p>
        </div>
      </CardContent>
    </Card>
  )

  const renderCodeEditor = () => {
    if (formData.lessonType !== 'code') return null

    const currentCode = (formData.defaultCode as Record<string, string>)?.[activeCodeTab] || ''
    const currentTestCode = (formData.testRunner as Record<string, string>)?.[activeCodeTab] || ''

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Code Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Language Tabs */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Programming Language</Label>
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {codeLanguages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setActiveCodeTab(lang.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeCodeTab === lang.id 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <lang.icon className="h-4 w-4" />
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Default Code Editor */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Default Code (Starting template for students)
              </Label>
              <div className="border rounded-lg overflow-hidden">
                <Editor
                  height="300px"
                  language={activeCodeTab}
                  value={currentCode}
                  onChange={(value) => updateCodeField('defaultCode', activeCodeTab, value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    scrollBeyondLastLine: false,
                    renderLineHighlight: 'line',
                    selectOnLineNumbers: true,
                  }}
                />
              </div>
            </div>

            {/* Test Runner Code Editor */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Test Runner Code (Code that validates student solutions)
              </Label>
              <div className="border rounded-lg overflow-hidden">
                <Editor
                  height="200px"
                  language={activeCodeTab}
                  value={currentTestCode}
                  onChange={(value) => updateCodeField('testRunner', activeCodeTab, value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    wordWrap: 'on',
                    automaticLayout: true,
                    padding: { top: 12, bottom: 12 },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderHintsEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Hints
          </div>
          <Button onClick={addHint} size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-1" />
            Add Hint
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(!Array.isArray(formData.hintsData) || formData.hintsData.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No hints yet. Add hints to help students when they're stuck.</p>
            <Button onClick={addHint} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add First Hint
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {(Array.isArray(formData.hintsData) ? formData.hintsData : []).map((hint, index) => (
              <Card key={hint.id} className="border-l-4 border-l-yellow-400">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={hint.title}
                        onChange={(e) => updateHint(index, 'title', e.target.value)}
                        className="font-medium"
                        placeholder="Hint title..."
                      />
                      <Button
                        onClick={() => removeHint(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={hint.content}
                      onChange={(e) => updateHint(index, 'content', e.target.value)}
                      rows={3}
                      className="text-sm"
                      placeholder="Hint content (supports Markdown)..."
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderDocumentationEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Documentation
          </div>
          <Button onClick={addDocumentationClass} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-1" />
            Add Class
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(!formData.documentationData || formData.documentationData.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No documentation yet. Add API documentation for classes, methods, and properties.</p>
            <Button onClick={addDocumentationClass} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add First Class
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {(formData.documentationData || []).map((doc, index) => (
              <Card key={index} className="border-l-4 border-l-purple-400">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Input
                      value={doc.className}
                      onChange={(e) => updateDocumentation(index, 'className', e.target.value)}
                      className="font-mono text-lg font-bold"
                      placeholder="ClassName"
                    />
                    <Button
                      onClick={() => removeDocumentation(index)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      value={doc.description}
                      onChange={(e) => updateDocumentation(index, 'description', e.target.value)}
                      rows={2}
                      className="mt-1"
                      placeholder="Describe what this class does..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Usage Example</Label>
                    <Textarea
                      value={doc.usage}
                      onChange={(e) => updateDocumentation(index, 'usage', e.target.value)}
                      rows={3}
                      className="mt-1 font-mono text-sm"
                      placeholder="const instance = new ClassName();"
                    />
                  </div>

                  {/* Methods Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium text-gray-700">Methods</Label>
                      <Button
                        onClick={() => addMethod(index)}
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:bg-green-50"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Method
                      </Button>
                    </div>
                    {(!doc.methods || doc.methods.length === 0) ? (
                      <p className="text-xs text-gray-500 text-center py-4">No methods yet. Add methods to document the class API.</p>
                    ) : (
                      <div className="space-y-3">
                        {doc.methods.map((method, methodIndex) => (
                          <div key={methodIndex} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <Input
                                value={method.method}
                                onChange={(e) => updateMethod(index, methodIndex, 'method', e.target.value)}
                                className="font-mono text-sm font-medium"
                                placeholder="methodName()"
                              />
                              <Button
                                onClick={() => removeMethod(index, methodIndex)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 ml-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div>
                                <Label className="text-xs text-gray-600">Return Type</Label>
                                <Input
                                  value={method.returnType}
                                  onChange={(e) => updateMethod(index, methodIndex, 'returnType', e.target.value)}
                                  className="text-xs"
                                  placeholder="string"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Description</Label>
                              <Textarea
                                value={method.description}
                                onChange={(e) => updateMethod(index, methodIndex, 'description', e.target.value)}
                                rows={2}
                                className="text-xs"
                                placeholder="Describe what this method does..."
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Properties Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium text-gray-700">Properties</Label>
                      <Button
                        onClick={() => addProperty(index)}
                        size="sm"
                        variant="outline"
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Property
                      </Button>
                    </div>
                    {(!doc.properties || doc.properties.length === 0) ? (
                      <p className="text-xs text-gray-500 text-center py-4">No properties yet. Add properties to document the class attributes.</p>
                    ) : (
                      <div className="space-y-3">
                        {doc.properties.map((property, propIndex) => (
                          <div key={propIndex} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <Input
                                value={property.property}
                                onChange={(e) => updateProperty(index, propIndex, 'property', e.target.value)}
                                className="font-mono text-sm font-medium"
                                placeholder="propertyName"
                              />
                              <Button
                                onClick={() => removeProperty(index, propIndex)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 ml-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div>
                                <Label className="text-xs text-gray-600">Data Type</Label>
                                <Input
                                  value={property.dataType}
                                  onChange={(e) => updateProperty(index, propIndex, 'dataType', e.target.value)}
                                  className="text-xs"
                                  placeholder="string"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600">Access</Label>
                                <Select
                                  value={property.type}
                                  onValueChange={(value) => updateProperty(index, propIndex, 'type', value)}
                                >
                                  <option value="Read/Write">Read/Write</option>
                                  <option value="Read-Only">Read-Only</option>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Description</Label>
                              <Textarea
                                value={property.description}
                                onChange={(e) => updateProperty(index, propIndex, 'description', e.target.value)}
                                rows={2}
                                className="text-xs"
                                placeholder="Describe what this property represents..."
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderVideoEditor = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Video className="h-5 w-5 mr-2" />
            Video Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="videoUrl" className="text-sm font-medium text-gray-700">Video URL</Label>
            <Input
              id="videoUrl"
              value={formData.videoUrl || ''}
              onChange={(e) => updateFormData({ videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="videoStart" className="text-sm font-medium text-gray-700">Start Time (seconds)</Label>
              <Input
                id="videoStart"
                type="number"
                value={formData.videoStart || 0}
                onChange={(e) => updateFormData({ videoStart: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="videoEnd" className="text-sm font-medium text-gray-700">End Time (seconds)</Label>
              <Input
                id="videoEnd"
                type="number"
                value={formData.videoEnd || 0}
                onChange={(e) => updateFormData({ videoEnd: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderDbQuizEditor = (quiz: DbQuiz) => {
    const questions = quizQuestionsMap[quiz.id] || []
    const loadingQuestions = loadingQuestionsMap[quiz.id] || false
    const isExpanded = expandedQuizzes[quiz.id] || false

    const toggleExpanded = () => {
      setExpandedQuizzes(prev => ({ ...prev, [quiz.id]: !isExpanded }))
    }

    const addQuestion = async () => {
      try {
        const response = await fetch(`/api/exercises/quizzes/${quiz.id}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: 'New question',
            type: 'multiple_choice',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option A',
            explanation: ''
          })
        })
        const result = await response.json()
        if (result.success) {
          setQuizQuestionsMap(prev => ({
            ...prev,
            [quiz.id]: [...questions, result.question]
          }))
        }
      } catch (error) {
        console.error('Error adding question:', error)
      }
    }

    const updateQuestion = async (questionId: number, updates: any) => {
      try {
        const response = await fetch(`/api/exercises/quizzes/${quiz.id}/questions/${questionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
        const result = await response.json()
        if (result.success) {
          setQuizQuestionsMap(prev => ({
            ...prev,
            [quiz.id]: questions.map(q => q.id === questionId ? { ...q, ...updates } : q)
          }))
        }
      } catch (error) {
        console.error('Error updating question:', error)
      }
    }

    const deleteQuestion = async (questionId: number) => {
      if (!confirm('Are you sure you want to delete this question?')) return

      try {
        const response = await fetch(`/api/exercises/quizzes/${quiz.id}/questions/${questionId}`, {
          method: 'DELETE'
        })
        const result = await response.json()
        if (result.success) {
          setQuizQuestionsMap(prev => ({
            ...prev,
            [quiz.id]: questions.filter(q => q.id !== questionId)
          }))
        }
      } catch (error) {
        console.error('Error deleting question:', error)
      }
    }

    const updateOption = (questionId: number, optionIndex: number, value: string) => {
      const question = questions.find(q => q.id === questionId)
      if (!question) return

      const newOptions = [...question.options]
      newOptions[optionIndex] = value
      updateQuestion(questionId, { options: newOptions })
    }

    const addOption = (questionId: number) => {
      const question = questions.find(q => q.id === questionId)
      if (!question) return

      const newOptions = [...question.options, `Option ${String.fromCharCode(65 + question.options.length)}`]
      updateQuestion(questionId, { options: newOptions })
    }

    const removeOption = (questionId: number, optionIndex: number) => {
      const question = questions.find(q => q.id === questionId)
      if (!question || question.options.length <= 2) return

      const newOptions = question.options.filter((_: any, index: number) => index !== optionIndex)
      let newCorrectAnswer = question.correctAnswer
      
      if (question.correctAnswer === question.options[optionIndex]) {
        newCorrectAnswer = newOptions[0]
      }
      
      updateQuestion(questionId, { 
        options: newOptions,
        correctAnswer: newCorrectAnswer
      })
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              value={quiz.description || ''}
              onChange={(e) => updateQuiz(quiz.id, { description: e.target.value })}
              placeholder="Quiz description..."
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Passing Score (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={quiz.passingScore || 70}
              onChange={(e) => updateQuiz(quiz.id, { passingScore: parseInt(e.target.value) || 70 })}
              className="mt-1"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`show-explanations-${quiz.id}`}
            checked={quiz.showExplanations}
            onChange={(e) => updateQuiz(quiz.id, { showExplanations: e.target.checked })}
          />
          <Label htmlFor={`show-explanations-${quiz.id}`} className="text-sm">Show explanations</Label>
        </div>
        
        {/* Questions Management */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Label className="text-sm font-medium text-gray-700">Questions ({questions.length})</Label>
              <Button
                onClick={toggleExpanded}
                size="sm"
                variant="outline"
              >
                {isExpanded ? 'Hide Questions' : 'Show Questions'}
              </Button>
            </div>
            <Button 
              onClick={addQuestion}
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </div>

          {isExpanded && (
            <div className="space-y-4 pl-4 border-l-2 border-blue-200">
              {loadingQuestions ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="mb-3">No questions yet</p>
                  <Button onClick={addQuestion} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add First Question
                  </Button>
                </div>
              ) : (
                questions.map((question, index) => (
                  <Card key={question.id} className="bg-blue-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                        <Button
                          onClick={() => deleteQuestion(question.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Question Text */}
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Question</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                          placeholder="Enter your question..."
                          className="mt-1"
                          rows={2}
                        />
                      </div>

                      {/* Question Type */}
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Type</Label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(question.id, { type: e.target.value })}
                          className="mt-1 block w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="true_false">True/False</option>
                          <option value="fill_blank">Fill in the Blank</option>
                        </select>
                      </div>

                      {/* Options for multiple choice */}
                      {question.type === 'multiple_choice' && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs font-medium text-gray-600">Options</Label>
                            <Button
                              onClick={() => addOption(question.id)}
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:bg-green-50 text-xs px-2 py-1 h-6"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {question.options.map((option: string, optionIndex: number) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`}
                                  checked={question.correctAnswer === option}
                                  onChange={() => updateQuestion(question.id, { correctAnswer: option })}
                                  className="text-blue-600"
                                />
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                  className="flex-1 text-sm"
                                  placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                />
                                {question.options.length > 2 && (
                                  <Button
                                    onClick={() => removeOption(question.id, optionIndex)}
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:bg-red-50 px-2 py-1 h-8"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* True/False options */}
                      {question.type === 'true_false' && (
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Correct Answer</Label>
                          <div className="mt-1 space-x-4">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`tf-${question.id}`}
                                value="True"
                                checked={question.correctAnswer === 'True'}
                                onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                                className="text-blue-600"
                              />
                              <span className="ml-2 text-sm">True</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`tf-${question.id}`}
                                value="False"
                                checked={question.correctAnswer === 'False'}
                                onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                                className="text-blue-600"
                              />
                              <span className="ml-2 text-sm">False</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Fill in blank */}
                      {question.type === 'fill_blank' && (
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Correct Answer</Label>
                          <Input
                            value={question.correctAnswer}
                            onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                            placeholder="Enter the correct answer..."
                            className="mt-1 text-sm"
                          />
                        </div>
                      )}

                      {/* Explanation */}
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Explanation (Optional)</Label>
                        <Textarea
                          value={question.explanation || ''}
                          onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                          placeholder="Explain why this is correct..."
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderDbCodeChallengeEditor = (challenge: DbCodeChallenge) => {
    const starterCode = (challenge.starterCode as Record<string, string>) || {}
    const abstractedCode = (challenge.abstractedCode as Record<string, string>) || {}
    const tests = (challenge.tests as Record<string, string>) || {}
    const demoData = (challenge.demoData as Record<string, string>) || {}
    
    const updateChallengeCode = (field: 'starterCode' | 'abstractedCode' | 'tests' | 'demoData', language: string, code: string) => {
      const currentField = (challenge[field] as Record<string, string>) || {}
      updateCodeChallenge(challenge.id, {
        [field]: {
          ...currentField,
          [language]: code
        }
      })
    }

    return (
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700">Description</Label>
          <Textarea
            value={challenge.description || ''}
            onChange={(e) => updateCodeChallenge(challenge.id, { description: e.target.value })}
            placeholder="Challenge description..."
            className="mt-1"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Difficulty</Label>
            <select
              value={challenge.difficulty}
              onChange={(e) => updateCodeChallenge(challenge.id, { difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Programming Language</Label>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {codeLanguages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setActiveCodeTab(lang.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeCodeTab === lang.id 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <lang.icon className="h-4 w-4" />
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Starter Code Editor */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Starter Code (Initial code for students)
            </Label>
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="200px"
                language={activeCodeTab}
                value={starterCode[activeCodeTab] || ''}
                onChange={(value) => updateChallengeCode('starterCode', activeCodeTab, value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>

          {/* Solution Code Editor */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Abstracted Code (Hidden implementation)
            </Label>
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="200px"
                language={activeCodeTab}
                value={abstractedCode[activeCodeTab] || ''}
                onChange={(value) => updateChallengeCode('abstractedCode', activeCodeTab, value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>

          {/* Test Code Editor */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Test Code (Code that validates solutions)
            </Label>
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="150px"
                language={activeCodeTab}
                value={tests[activeCodeTab] || ''}
                onChange={(value) => updateChallengeCode('tests', activeCodeTab, value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  wordWrap: 'on',
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>

          {/* Demo Data Editor */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Demo Data (Test data for visualization)
            </Label>
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="150px"
                language={activeCodeTab}
                value={demoData[activeCodeTab] || ''}
                onChange={(value) => updateChallengeCode('demoData', activeCodeTab, value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  wordWrap: 'on',
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderDbFillInBlankEditor = (fillInBlank: DbFillInBlank) => {
    const blankAnswers = blankAnswersMap[fillInBlank.id] || []
    const loadingAnswers = loadingAnswersMap[fillInBlank.id] || false

    const addBlankAnswer = async () => {
      try {
        const blankNumber = blankAnswers.length + 1
        const response = await fetch(`/api/exercises/fill-in-blanks/${fillInBlank.id}/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blankId: `BLANK_${blankNumber}`,
            correctAnswer: '',
            alternatives: [],
            caseSensitive: false
          })
        })
        const result = await response.json()
        if (result.success) {
          setBlankAnswersMap(prev => ({
            ...prev,
            [fillInBlank.id]: [...blankAnswers, result.answer]
          }))
        }
      } catch (error) {
        console.error('Error adding blank answer:', error)
      }
    }

    const updateBlankAnswer = async (answerId: number, updates: any) => {
      try {
        const response = await fetch(`/api/exercises/fill-in-blanks/${fillInBlank.id}/answers/${answerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
        const result = await response.json()
        if (result.success) {
          setBlankAnswersMap(prev => ({
            ...prev,
            [fillInBlank.id]: blankAnswers.map(answer => 
              answer.id === answerId ? { ...answer, ...updates } : answer
            )
          }))
        }
      } catch (error) {
        console.error('Error updating blank answer:', error)
      }
    }

    const deleteBlankAnswer = async (answerId: number) => {
      if (!confirm('Are you sure you want to delete this blank answer?')) return

      try {
        const response = await fetch(`/api/exercises/fill-in-blanks/${fillInBlank.id}/answers/${answerId}`, {
          method: 'DELETE'
        })
        const result = await response.json()
        if (result.success) {
          setBlankAnswersMap(prev => ({
            ...prev,
            [fillInBlank.id]: blankAnswers.filter(answer => answer.id !== answerId)
          }))
        }
      } catch (error) {
        console.error('Error deleting blank answer:', error)
      }
    }

    const addAlternative = (answerId: number) => {
      const answer = blankAnswers.find(a => a.id === answerId)
      if (!answer) return

      const alternatives = Array.isArray(answer.alternatives) ? answer.alternatives : []
      updateBlankAnswer(answerId, {
        alternatives: [...alternatives, '']
      })
    }

    const updateAlternative = (answerId: number, altIndex: number, value: string) => {
      const answer = blankAnswers.find(a => a.id === answerId)
      if (!answer) return

      const alternatives = Array.isArray(answer.alternatives) ? [...answer.alternatives] : []
      alternatives[altIndex] = value
      updateBlankAnswer(answerId, { alternatives })
    }

    const removeAlternative = (answerId: number, altIndex: number) => {
      const answer = blankAnswers.find(a => a.id === answerId)
      if (!answer) return

      const alternatives = Array.isArray(answer.alternatives) ? [...answer.alternatives] : []
      alternatives.splice(altIndex, 1)
      updateBlankAnswer(answerId, { alternatives })
    }

    return (
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700">Text with Blanks</Label>
          <Textarea
            value={fillInBlank.text}
            onChange={(e) => updateFillInBlank(fillInBlank.id, { text: e.target.value })}
            placeholder="Enter text with ___BLANK_1___, ___BLANK_2___ markers..."
            className="mt-1"
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1">
            Use ___BLANK_1___, ___BLANK_2___, etc. to mark blanks in your text
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700">Explanation</Label>
          <Textarea
            value={fillInBlank.explanation || ''}
            onChange={(e) => updateFillInBlank(fillInBlank.id, { explanation: e.target.value })}
            placeholder="Optional explanation..."
            className="mt-1"
            rows={2}
          />
        </div>

        {/* Blank Answers Management */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-sm font-medium text-gray-700">Blank Answers</Label>
            <Button
              onClick={addBlankAnswer}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Blank
            </Button>
          </div>

          {loadingAnswers ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading answers...</p>
            </div>
          ) : blankAnswers.length === 0 ? (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
              <p className="mb-3">No blank answers defined yet</p>
              <Button onClick={addBlankAnswer} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add First Blank
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {blankAnswers.map((answer) => (
                <Card key={answer.id} className="border-l-4 border-l-purple-400">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {/* Blank ID and Correct Answer */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Blank ID</Label>
                          <Input
                            value={answer.blankId}
                            onChange={(e) => updateBlankAnswer(answer.id, { blankId: e.target.value })}
                            placeholder="BLANK_1"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Correct Answer</Label>
                          <Input
                            value={answer.correctAnswer}
                            onChange={(e) => updateBlankAnswer(answer.id, { correctAnswer: e.target.value })}
                            placeholder="Enter correct answer..."
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* Case Sensitivity */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`case-sensitive-${answer.id}`}
                          checked={answer.caseSensitive}
                          onChange={(e) => updateBlankAnswer(answer.id, { caseSensitive: e.target.checked })}
                        />
                        <Label htmlFor={`case-sensitive-${answer.id}`} className="text-sm">
                          Case sensitive
                        </Label>
                      </div>

                      {/* Alternative Answers */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium text-gray-700">Alternative Answers</Label>
                          <Button
                            onClick={() => addAlternative(answer.id)}
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:bg-green-50"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Alternative
                          </Button>
                        </div>
                        
                        {Array.isArray(answer.alternatives) && answer.alternatives.length > 0 ? (
                          <div className="space-y-2">
                            {answer.alternatives.map((alt: string, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Input
                                  value={alt}
                                  onChange={(e) => updateAlternative(answer.id, index, e.target.value)}
                                  placeholder={`Alternative ${index + 1}`}
                                  className="flex-1"
                                />
                                <Button
                                  onClick={() => removeAlternative(answer.id, index)}
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 text-center py-2">
                            No alternative answers. Add alternatives that should also be accepted.
                          </p>
                        )}
                      </div>

                      {/* Delete Button */}
                      <div className="flex justify-end pt-2 border-t border-gray-200">
                        <Button
                          onClick={() => deleteBlankAnswer(answer.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete Blank
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderExercisesEditor = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Puzzle className="h-5 w-5 mr-2" />
              Exercises
            </div>
            <div className="flex space-x-2">
              <Button onClick={addDbQuiz} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                Add Quiz
              </Button>
              <Button onClick={addDbCodeChallenge} size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-1" />
                Add Code Challenge
              </Button>
              <Button onClick={addDbFillInBlank} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-1" />
                Add Fill in Blank
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Database Quizzes */}
          {dbQuizzes.map((quiz) => (
            <Card key={`quiz-${quiz.id}`} className="border-l-4 border-l-blue-400">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <Input
                      value={quiz.title}
                      onChange={(e) => updateQuiz(quiz.id, { title: e.target.value })}
                      className="font-medium"
                      placeholder="Quiz title..."
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuiz(quiz.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {renderDbQuizEditor(quiz)}
              </CardContent>
            </Card>
          ))}
          
          {/* Database Code Challenges */}
          {dbCodeChallenges.map((challenge) => (
            <Card key={`challenge-${challenge.id}`} className="border-l-4 border-l-green-400">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Code className="h-5 w-5 text-green-500" />
                    <Input
                      value={challenge.title}
                      onChange={(e) => updateCodeChallenge(challenge.id, { title: e.target.value })}
                      className="font-medium"
                      placeholder="Code challenge title..."
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCodeChallenge(challenge.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {renderDbCodeChallengeEditor(challenge)}
              </CardContent>
            </Card>
          ))}
          
          {/* Database Fill-in-Blanks */}
          {dbFillInBlanks.map((fillInBlank) => (
            <Card key={`fillinblank-${fillInBlank.id}`} className="border-l-4 border-l-purple-400">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Edit3 className="h-5 w-5 text-purple-500" />
                    <Input
                      value={fillInBlank.title}
                      onChange={(e) => updateFillInBlank(fillInBlank.id, { title: e.target.value })}
                      className="font-medium"
                      placeholder="Fill-in-blank title..."
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFillInBlank(fillInBlank.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {renderDbFillInBlankEditor(fillInBlank)}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const editorContent = (
    <div className="h-full flex flex-col bg-gray-50">
      {renderHeader()}
      
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="h-full flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6">
            <TabsList className="grid w-full bg-gray-100" style={{ gridTemplateColumns: `repeat(${formData.lessonType === 'code' ? 6 : 5}, 1fr)` }}>
              <TabsTrigger value="basic" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Basic</span>
              </TabsTrigger>
              {formData.lessonType === 'code' && (
                <TabsTrigger value="code" className="flex items-center space-x-2">
                  <Code className="h-4 w-4" />
                  <span>Code</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="exercises" className="flex items-center space-x-2">
                <Puzzle className="h-4 w-4" />
                <span>Exercises</span>
              </TabsTrigger>
              <TabsTrigger value="hints" className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>Hints</span>
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Docs</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Video</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="basic" className="mt-0">
              {renderBasicInfo()}
            </TabsContent>

            {formData.lessonType === 'code' && (
              <TabsContent value="code" className="mt-0">
                {renderCodeEditor()}
              </TabsContent>
            )}

            <TabsContent value="exercises" className="mt-0">
              {renderExercisesEditor()}
            </TabsContent>

            <TabsContent value="hints" className="mt-0">
              {renderHintsEditor()}
            </TabsContent>

            <TabsContent value="docs" className="mt-0">
              {renderDocumentationEditor()}
            </TabsContent>

            <TabsContent value="video" className="mt-0">
              {renderVideoEditor()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )

  const previewContent = (
    <div className="h-full bg-white">
      <ContentPreview
        lessonContent={formData.lessonText}
        documentationData={Array.isArray(formData.documentationData) ? formData.documentationData : []}
        hints={Array.isArray(formData.hintsData) ? formData.hintsData : []}
      />
    </div>
  )

  return (
    <EditorLayout 
      editor={editorContent}
      preview={previewContent}
      defaultLayout={[60, 40]}
    />
  )
}