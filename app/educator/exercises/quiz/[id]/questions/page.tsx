'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Save, ChevronLeft, GripVertical } from 'lucide-react'

interface QuizQuestion {
  id: number
  question: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank'
  options: string[]
  correctAnswer: string
  explanation?: string
  index: number
}

interface Quiz {
  id: number
  title: string
  description?: string
  passingScore: number
  showExplanations: boolean
}

export default function QuizQuestionManager() {
  const params = useParams()
  const router = useRouter()
  const quizId = parseInt(params.id as string)
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isNaN(quizId)) {
      fetchQuizAndQuestions()
    }
  }, [quizId])

  const fetchQuizAndQuestions = async () => {
    try {
      setLoading(true)
      
      // Fetch quiz details and questions in parallel
      const [quizRes, questionsRes] = await Promise.all([
        fetch(`/api/exercises/quizzes/${quizId}`),
        fetch(`/api/exercises/quizzes/${quizId}/questions`)
      ])

      const [quizData, questionsData] = await Promise.all([
        quizRes.json(),
        questionsRes.json()
      ])

      if (quizData.success) {
        setQuiz(quizData.quiz)
      } else {
        setError('Failed to load quiz details')
      }

      if (questionsData.success) {
        setQuestions(questionsData.questions)
      } else {
        setError('Failed to load questions')
      }
    } catch (err) {
      setError('Failed to load quiz data')
      console.error('Error fetching quiz data:', err)
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = async () => {
    try {
      setSaving(true)
      const response = await fetch(`/api/exercises/quizzes/${quizId}/questions`, {
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
        setQuestions(prev => [...prev, result.question])
      } else {
        setError('Failed to add question')
      }
    } catch (err) {
      setError('Failed to add question')
      console.error('Error adding question:', err)
    } finally {
      setSaving(false)
    }
  }

  const updateQuestion = async (questionId: number, updates: Partial<QuizQuestion>) => {
    try {
      const response = await fetch(`/api/exercises/quizzes/${quizId}/questions/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      const result = await response.json()
      if (result.success) {
        setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, ...updates } : q))
      } else {
        setError('Failed to update question')
      }
    } catch (err) {
      setError('Failed to update question')
      console.error('Error updating question:', err)
    }
  }

  const deleteQuestion = async (questionId: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      const response = await fetch(`/api/exercises/quizzes/${quizId}/questions/${questionId}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        setQuestions(prev => prev.filter(q => q.id !== questionId))
      } else {
        setError('Failed to delete question')
      }
    } catch (err) {
      setError('Failed to delete question')
      console.error('Error deleting question:', err)
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

    const newOptions = question.options.filter((_, index) => index !== optionIndex)
    let newCorrectAnswer = question.correctAnswer
    
    // Update correct answer if it was the deleted option
    if (question.correctAnswer === question.options[optionIndex]) {
      newCorrectAnswer = newOptions[0]
    }
    
    updateQuestion(questionId, { 
      options: newOptions,
      correctAnswer: newCorrectAnswer
    })
  }

  const renderQuestionEditor = (question: QuizQuestion) => (
    <Card key={question.id} className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-3">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Question {question.index + 1}</span>
        </div>
        <Button
          onClick={() => deleteQuestion(question.id)}
          size="sm"
          variant="outline"
          className="text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Text */}
        <div>
          <Label className="text-sm font-medium text-gray-700">Question</Label>
          <Textarea
            value={question.question}
            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
            placeholder="Enter your question here..."
            className="mt-1"
            rows={2}
          />
        </div>

        {/* Question Type */}
        <div>
          <Label className="text-sm font-medium text-gray-700">Type</Label>
          <select
            value={question.type}
            onChange={(e) => updateQuestion(question.id, { type: e.target.value as QuizQuestion['type'] })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True/False</option>
            <option value="fill_blank">Fill in the Blank</option>
          </select>
        </div>

        {/* Options (for multiple choice) */}
        {question.type === 'multiple_choice' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-gray-700">Options</Label>
              <Button
                onClick={() => addOption(question.id)}
                size="sm"
                variant="outline"
                className="text-green-600 hover:bg-green-50"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctAnswer === option}
                    onChange={() => updateQuestion(question.id, { correctAnswer: option })}
                    className="text-blue-600"
                  />
                  <Input
                    value={option}
                    onChange={(e) => updateOption(question.id, index, e.target.value)}
                    className="flex-1"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                  {question.options.length > 2 && (
                    <Button
                      onClick={() => removeOption(question.id, index)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* True/False Options */}
        {question.type === 'true_false' && (
          <div>
            <Label className="text-sm font-medium text-gray-700">Correct Answer</Label>
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
                <span className="ml-2">True</span>
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
                <span className="ml-2">False</span>
              </label>
            </div>
          </div>
        )}

        {/* Fill in the blank */}
        {question.type === 'fill_blank' && (
          <div>
            <Label className="text-sm font-medium text-gray-700">Correct Answer</Label>
            <Input
              value={question.correctAnswer}
              onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
              placeholder="Enter the correct answer..."
              className="mt-1"
            />
          </div>
        )}

        {/* Explanation */}
        <div>
          <Label className="text-sm font-medium text-gray-700">Explanation (Optional)</Label>
          <Textarea
            value={question.explanation || ''}
            onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
            placeholder="Explain why this is the correct answer..."
            className="mt-1"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz questions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchQuizAndQuestions} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => window.close()}
              size="sm"
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Questions</h1>
              <p className="text-gray-600 text-sm mt-1">
                {quiz?.title} • {questions.length} question{questions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {saving && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm">Saving...</span>
              </div>
            )}
            <Button 
              onClick={addQuestion}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">No questions yet. Add your first question to get started.</p>
            <Button onClick={addQuestion} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add First Question
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {questions
              .sort((a, b) => a.index - b.index)
              .map(question => renderQuestionEditor(question))
            }
          </div>
        )}
      </div>
    </div>
  )
}