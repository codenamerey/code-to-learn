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
import { Plus, Trash2, Save, FileText, Code, Lightbulb, BookOpen, Video, ChevronLeft, ChevronRight, Square, Circle, Triangle, Settings } from 'lucide-react'
import type { SublessonFormData, Hint, DocClass, DocMethod, DocProperty } from '@/types/educator'

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