'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Plus, Trash2, Save, FileText, Code, Lightbulb, BookOpen, Video, List, Square, Circle, Triangle, Puzzle, Brain, Edit3 } from 'lucide-react'
import type { FullLesson, LessonFormData, Hint, DocClass, DocMethod, DocProperty, Exercise, ExerciseContainer, QuizData, CodeChallenge, FillInBlank, QuizQuestion, DbQuiz, DbCodeChallenge, DbFillInBlank } from '@/types/educator'

interface LessonEditorProps {
  lesson: FullLesson
  courseId: string
  onSave: (lesson: FullLesson) => void
}

export function LessonEditor({ lesson, courseId, onSave }: LessonEditorProps) {
  const [formData, setFormData] = useState<LessonFormData>(() => {
    // Check if quizData contains legacy quiz or new exercise system
    const quizData = lesson.lessonContent?.quizData
    let legacyQuizData = null
    let exerciseData = { exercises: [] }

    if (quizData) {
      // If it has a 'questions' array directly, it's legacy quiz data
      if (quizData.questions && Array.isArray(quizData.questions)) {
        legacyQuizData = quizData
      } else if (quizData.exercises && Array.isArray(quizData.exercises)) {
        // If it has 'exercises' array, it's new exercise system
        exerciseData = quizData
      }
    }

    return {
      title: lesson.title,
      lessonType: lesson.lessonType,
      lessonText: lesson.lessonContent?.lessonText || '',
      defaultCode: lesson.lessonContent?.defaultCode || {},
      abstractedCode: lesson.lessonContent?.abstractedCode || {},
      testRunner: lesson.lessonContent?.testRunner || {},
      demoData: lesson.lessonContent?.demoData || {},
      documentationData: Array.isArray(lesson.lessonContent?.documentationData) ? lesson.lessonContent?.documentationData : [],
      hintsData: Array.isArray(lesson.lessonContent?.hintsData) ? lesson.lessonContent?.hintsData : [],
      visualizerConfig: lesson.lessonContent?.visualizerConfig || undefined,
      quizData: legacyQuizData,
      exerciseData: exerciseData,
      videoUrl: lesson.lessonContent?.videoUrl || '',
      videoStart: lesson.lessonContent?.videoStart || 0,
      videoEnd: lesson.lessonContent?.videoEnd || 0,
    }
  })

  const [activeCodeTab, setActiveCodeTab] = useState('javascript')
  const [isDirty, setIsDirty] = useState(false)
  const [activeSection, setActiveSection] = useState('basic')
  const [sublessons, setSublessons] = useState<any[]>([])
  const [loadingSublessons, setLoadingSublessons] = useState(false)

  // State for database exercises
  const [dbQuizzes, setDbQuizzes] = useState<DbQuiz[]>([])
  const [dbCodeChallenges, setDbCodeChallenges] = useState<DbCodeChallenge[]>([])
  const [dbFillInBlanks, setDbFillInBlanks] = useState<DbFillInBlank[]>([])
  const [exercisesLoading, setExercisesLoading] = useState(true)

  // Fetch sublessons for display purposes only
  useEffect(() => {
    fetchSublessons()
  }, [lesson.id])

  const fetchSublessons = async () => {
    try {
      setLoadingSublessons(true)
      const response = await fetch(`/api/sublessons?lessonId=${lesson.id}`)
      if (!response.ok) throw new Error('Failed to fetch sublessons')
      
      const data = await response.json()
      setSublessons(data.sublessons || [])
    } catch (error) {
      console.error('Error fetching sublessons:', error)
    } finally {
      setLoadingSublessons(false)
    }
  }

  const saveLesson = async (data: LessonFormData) => {
    try {
      const response = await fetch(`/api/educator/courses/${courseId}/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save lesson')
      }

      const updatedLesson = await response.json()
      onSave(updatedLesson)
      setIsDirty(false)
      return updatedLesson
    } catch (error) {
      console.error('Error saving lesson:', error)
      throw error
    }
  }

  // API functions for database exercises
  const fetchExercises = useCallback(async () => {
    try {
      setExercisesLoading(true)
      const [quizzesRes, codeChallengesRes, fillInBlanksRes] = await Promise.all([
        fetch(`/api/exercises/quizzes?lessonId=${lesson.id}`),
        fetch(`/api/exercises/code-challenges?lessonId=${lesson.id}`),
        fetch(`/api/exercises/fill-in-blanks?lessonId=${lesson.id}`)
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
    } finally {
      setExercisesLoading(false)
    }
  }, [lesson.id])

  const createQuiz = async (quizData: Partial<DbQuiz>) => {
    try {
      const response = await fetch('/api/exercises/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quizData,
          lessonId: lesson.id,
          index: dbQuizzes.length
        })
      })
      const result = await response.json()
      if (result.success) {
        setDbQuizzes(prev => [...prev, result.quiz])
      }
      return result
    } catch (error) {
      console.error('Error creating quiz:', error)
      throw error
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
        setDbQuizzes(prev => prev.map(q => q.id === quizId ? result.quiz : q))
      }
      return result
    } catch (error) {
      console.error('Error updating quiz:', error)
      throw error
    }
  }

  const deleteQuiz = async (quizId: number) => {
    try {
      const response = await fetch(`/api/exercises/quizzes/${quizId}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        setDbQuizzes(prev => prev.filter(q => q.id !== quizId))
      }
      return result
    } catch (error) {
      console.error('Error deleting quiz:', error)
      throw error
    }
  }

  const createCodeChallenge = async (challengeData: Partial<DbCodeChallenge>) => {
    try {
      const response = await fetch('/api/exercises/code-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...challengeData,
          lessonId: lesson.id,
          index: dbCodeChallenges.length
        })
      })
      const result = await response.json()
      if (result.success) {
        setDbCodeChallenges(prev => [...prev, result.codeChallenge])
      }
      return result
    } catch (error) {
      console.error('Error creating code challenge:', error)
      throw error
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
        setDbCodeChallenges(prev => prev.map(c => c.id === challengeId ? result.codeChallenge : c))
      }
      return result
    } catch (error) {
      console.error('Error updating code challenge:', error)
      throw error
    }
  }

  const deleteCodeChallenge = async (challengeId: number) => {
    try {
      const response = await fetch(`/api/exercises/code-challenges/${challengeId}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        setDbCodeChallenges(prev => prev.filter(c => c.id !== challengeId))
      }
      return result
    } catch (error) {
      console.error('Error deleting code challenge:', error)
      throw error
    }
  }

  const createFillInBlank = async (fillInBlankData: Partial<DbFillInBlank>) => {
    try {
      const response = await fetch('/api/exercises/fill-in-blanks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fillInBlankData,
          lessonId: lesson.id,
          index: dbFillInBlanks.length
        })
      })
      const result = await response.json()
      if (result.success) {
        setDbFillInBlanks(prev => [...prev, result.fillInBlank])
      }
      return result
    } catch (error) {
      console.error('Error creating fill-in-blank:', error)
      throw error
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
        setDbFillInBlanks(prev => prev.map(f => f.id === fillInBlankId ? result.fillInBlank : f))
      }
      return result
    } catch (error) {
      console.error('Error updating fill-in-blank:', error)
      throw error
    }
  }

  const deleteFillInBlank = async (fillInBlankId: number) => {
    try {
      const response = await fetch(`/api/exercises/fill-in-blanks/${fillInBlankId}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        setDbFillInBlanks(prev => prev.filter(f => f.id !== fillInBlankId))
      }
      return result
    } catch (error) {
      console.error('Error deleting fill-in-blank:', error)
      throw error
    }
  }

  // Load exercises when component mounts or lesson changes
  useEffect(() => {
    fetchExercises()
  }, [fetchExercises])

  const { status, forceSave } = useAutoSave(formData, {
    onSave: saveLesson,
    debounceMs: 2000,
    enabled: isDirty
  })

  const updateFormData = (updates: Partial<LessonFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    setIsDirty(true)
  }

  const updateCodeField = (field: keyof LessonFormData, language: string, code: string) => {
    const currentField = formData[field] as Record<string, string> || {}
    updateFormData({
      [field]: {
        ...currentField,
        [language]: code
      }
    })
  }

  // Only include JS, Python, and TypeScript
  const codeLanguages = [
    { id: 'javascript', label: 'JavaScript', icon: Square },
    { id: 'python', label: 'Python', icon: Circle },
    { id: 'typescript', label: 'TypeScript', icon: Triangle }
  ]

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
              <Button onClick={() => createQuiz({ title: 'New Quiz' })} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                Add Quiz
              </Button>
              <Button onClick={() => createCodeChallenge({ title: 'New Code Challenge', description: '', starterCode: '{}', abstractedCode: '{}', tests: '{}', demoData: '{}' })} size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-1" />
                Add Code Challenge
              </Button>
              <Button onClick={() => createFillInBlank({ title: 'New Fill in Blank', text: '' })} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-1" />
                Add Fill in Blank
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {exercisesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-500">Loading exercises...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Database Quizzes */}
              {dbQuizzes.map((quiz) => (
                <Card key={`quiz-${quiz.id}`} className="border-l-4 border-l-blue-400">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Brain className="h-5 w-5 text-blue-500" />
                        <Input
                          value={quiz.title}
                          onChange={(e) => updateQuiz(quiz.id, { title: e.target.value })}
                          className="font-medium text-lg"
                          placeholder="Quiz title..."
                        />
                      </div>
                      <Button
                        onClick={() => deleteQuiz(quiz.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
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
                          className="font-medium text-lg"
                          placeholder="Code challenge title..."
                        />
                      </div>
                      <Button
                        onClick={() => deleteCodeChallenge(challenge.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
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
                          className="font-medium text-lg"
                          placeholder="Fill-in-blank title..."
                        />
                      </div>
                      <Button
                        onClick={() => deleteFillInBlank(fillInBlank.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
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

              {/* Show empty state if no exercises */}
              {dbQuizzes.length === 0 && dbCodeChallenges.length === 0 && dbFillInBlanks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">No exercises yet. Add quizzes, code challenges, or fill-in-the-blank exercises.</p>
                  <div className="flex justify-center space-x-2">
                    <Button onClick={() => createQuiz({ title: 'New Quiz' })} variant="outline">
                      <Brain className="h-4 w-4 mr-2" />
                      Add First Quiz
                    </Button>
                    <Button onClick={() => createCodeChallenge({ title: 'New Code Challenge', description: '', starterCode: '{}', abstractedCode: '{}', tests: '{}', demoData: '{}' })} variant="outline">
                      <Code className="h-4 w-4 mr-2" />
                      Add Code Challenge
                    </Button>
                    <Button onClick={() => createFillInBlank({ title: 'New Fill in Blank', text: '' })} variant="outline">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Add Fill-in-Blank
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // New database exercise render functions
  const renderDbQuizEditor = (quiz: DbQuiz) => {
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
        <div className="text-sm text-gray-500">
          Questions: {quiz.questions?.length || 0} (managed separately)
        </div>
      </div>
    )
  }

  const renderDbCodeChallengeEditor = (challenge: DbCodeChallenge) => {
    return (
      <div className="space-y-4">
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
        <div className="text-sm text-gray-500">
          Code editing available in full editor mode
        </div>
      </div>
    )
  }

  const renderDbFillInBlankEditor = (fillInBlank: DbFillInBlank) => {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700">Text with Blanks</Label>
          <Textarea
            value={fillInBlank.text}
            onChange={(e) => updateFillInBlank(fillInBlank.id, { text: e.target.value })}
            placeholder="Enter text with ___BLANK___ markers..."
            className="mt-1"
            rows={3}
          />
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
        <div className="text-sm text-gray-500">
          Blanks: {fillInBlank.blanks?.length || 0} (managed separately)
        </div>
      </div>
    )
  }

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
      method: '',
      description: '',
      returnType: 'void'
    }
    
    const docs = [...(formData.documentationData || [])]
    if (!docs[docIndex].methods) {
      docs[docIndex].methods = []
    }
    docs[docIndex].methods.push(newMethod)
    updateFormData({ documentationData: docs })
  }

  const updateMethod = (docIndex: number, methodIndex: number, field: keyof DocMethod, value: string) => {
    const docs = [...(formData.documentationData || [])]
    docs[docIndex].methods[methodIndex] = {
      ...docs[docIndex].methods[methodIndex],
      [field]: value
    }
    updateFormData({ documentationData: docs })
  }

  const removeMethod = (docIndex: number, methodIndex: number) => {
    const docs = [...(formData.documentationData || [])]
    docs[docIndex].methods.splice(methodIndex, 1)
    updateFormData({ documentationData: docs })
  }

  // Properties management
  const addProperty = (docIndex: number) => {
    const newProperty: DocProperty = {
      property: '',
      description: '',
      dataType: 'string',
      type: 'Read/Write'
    }
    
    const docs = [...(formData.documentationData || [])]
    if (!docs[docIndex].properties) {
      docs[docIndex].properties = []
    }
    docs[docIndex].properties.push(newProperty)
    updateFormData({ documentationData: docs })
  }

  const updateProperty = (docIndex: number, propIndex: number, field: keyof DocProperty, value: string) => {
    const docs = [...(formData.documentationData || [])]
    docs[docIndex].properties[propIndex] = {
      ...docs[docIndex].properties[propIndex],
      [field]: value
    }
    updateFormData({ documentationData: docs })
  }

  const removeProperty = (docIndex: number, propIndex: number) => {
    const docs = [...(formData.documentationData || [])]
    docs[docIndex].properties.splice(propIndex, 1)
    updateFormData({ documentationData: docs })
  }

  const createNewSublesson = async () => {
    const newSublessonData = {
      lessonId: lesson.id,
      title: 'New Sublesson',
      lessonType: 'code',
      lessonText: '## New Sublesson\n\nAdd your content here...',
      defaultCode: {},
      abstractedCode: {},
      testRunner: {},
      demoData: {},
      documentationData: [],
      hintsData: [],
    }

    try {
      const response = await fetch('/api/sublessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSublessonData),
      })

      if (!response.ok) {
        throw new Error('Failed to create sublesson')
      }

      const result = await response.json()
      await fetchSublessons() // Refresh the list
      
      // Navigate to the new sublesson editor
      window.location.href = `/educator/courses/${courseId}/lessons/${lesson.id}/sublessons/${result.sublesson.id}/edit`
    } catch (error) {
      console.error('Failed to create sublesson:', error)
    }
  }

  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Lesson</h1>
            <p className="text-gray-600 text-sm mt-1">Course ID: {courseId} • Lesson ID: {lesson.id}</p>
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

      {/* Sublessons Summary */}
      {sublessons.length > 0 && (
        <div className="mt-4 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <List className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">
                This lesson has {sublessons.length} sublesson{sublessons.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={createNewSublesson}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Sublesson
              </Button>
              <Button
                onClick={() => window.location.href = `/educator/courses/${courseId}/lessons/${lesson.id}/sublessons/${sublessons[0]?.id}/edit`}
                size="sm"
                variant="outline"
                disabled={sublessons.length === 0}
              >
                Edit Sublessons
              </Button>
            </div>
          </div>
          {sublessons.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {sublessons.map((sublesson: any, index: number) => (
                <button
                  key={sublesson.id}
                  onClick={() => window.location.href = `/educator/courses/${courseId}/lessons/${lesson.id}/sublessons/${sublesson.id}/edit`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  {index + 1}. {sublesson.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create First Sublesson */}
      {sublessons.length === 0 && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-gray-600 mb-3">This lesson doesn't have any sublessons yet.</p>
          <Button
            onClick={createNewSublesson}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create First Sublesson
          </Button>
        </div>
      )}
    </div>
  )

  const renderBasicInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">Lesson Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className="mt-1 text-lg font-medium"
            placeholder="Enter lesson title..."
          />
        </div>

        <div>
          <Label htmlFor="lessonType" className="text-sm font-medium text-gray-700">Lesson Type</Label>
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
            Lesson Content (Markdown)
          </Label>
          <Textarea
            id="lessonText"
            value={formData.lessonText}
            onChange={(e) => updateFormData({ lessonText: e.target.value })}
            rows={12}
            className="mt-1 font-mono text-sm"
            placeholder="Write your lesson content using Markdown..."
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
    if (formData.lessonType !== 'video') return null

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

  const editorContent = (
    <div className="h-full flex flex-col bg-gray-50">
      {renderHeader()}
      
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="h-full flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
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
              <TabsTrigger value="hints" className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>Hints</span>
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Docs</span>
              </TabsTrigger>
              <TabsTrigger value="exercises" className="flex items-center space-x-2">
                <Puzzle className="h-4 w-4" />
                <span>Exercises</span>
              </TabsTrigger>
              {formData.lessonType === 'video' && (
                <TabsTrigger value="video" className="flex items-center space-x-2">
                  <Video className="h-4 w-4" />
                  <span>Video</span>
                </TabsTrigger>
              )}
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

            <TabsContent value="hints" className="mt-0">
              {renderHintsEditor()}
            </TabsContent>

            <TabsContent value="docs" className="mt-0">
              {renderDocumentationEditor()}
            </TabsContent>

            <TabsContent value="exercises" className="mt-0">
              {renderExercisesEditor()}
            </TabsContent>

            {formData.lessonType === 'video' && (
              <TabsContent value="video" className="mt-0">
                {renderVideoEditor()}
              </TabsContent>
            )}
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
