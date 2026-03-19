import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const quizId = parseInt(id)
    
    if (isNaN(quizId)) {
      return NextResponse.json({ success: false, error: 'Invalid quiz ID' }, { status: 400 })
    }

    const questions = await prisma.quizQuestion.findMany({
      where: { quizId },
      orderBy: { index: 'asc' }
    })

    return NextResponse.json({ success: true, questions })
  } catch (error) {
    console.error('Error fetching quiz questions:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const quizId = parseInt(id)
    
    if (isNaN(quizId)) {
      return NextResponse.json({ success: false, error: 'Invalid quiz ID' }, { status: 400 })
    }

    const body = await request.json()
    const { question, type, options, correctAnswer, explanation, index } = body

    // Get the next index if not provided
    let questionIndex = index
    if (questionIndex === undefined) {
      const lastQuestion = await prisma.quizQuestion.findFirst({
        where: { quizId },
        orderBy: { index: 'desc' }
      })
      questionIndex = lastQuestion ? lastQuestion.index + 1 : 0
    }

    const newQuestion = await prisma.quizQuestion.create({
      data: {
        quizId,
        question: question || 'New question',
        type: type || 'multiple_choice',
        options: options || ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: correctAnswer || 'Option A',
        explanation: explanation || '',
        index: questionIndex
      }
    })

    return NextResponse.json({ success: true, question: newQuestion })
  } catch (error) {
    console.error('Error creating quiz question:', error)
    return NextResponse.json({ success: false, error: 'Failed to create question' }, { status: 500 })
  }
}