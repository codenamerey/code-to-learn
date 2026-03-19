import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    const { questionId } = await params
    const questionIdNum = parseInt(questionId)
    
    if (isNaN(questionIdNum)) {
      return NextResponse.json({ success: false, error: 'Invalid question ID' }, { status: 400 })
    }

    const question = await prisma.quizQuestion.findUnique({
      where: { id: questionIdNum }
    })

    if (!question) {
      return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, question })
  } catch (error) {
    console.error('Error fetching quiz question:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch question' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    const { questionId } = await params
    const questionIdNum = parseInt(questionId)
    
    if (isNaN(questionIdNum)) {
      return NextResponse.json({ success: false, error: 'Invalid question ID' }, { status: 400 })
    }

    const body = await request.json()
    const { question, type, options, correctAnswer, explanation, index } = body

    const updatedQuestion = await prisma.quizQuestion.update({
      where: { id: questionIdNum },
      data: {
        ...(question !== undefined && { question }),
        ...(type !== undefined && { type }),
        ...(options !== undefined && { options }),
        ...(correctAnswer !== undefined && { correctAnswer }),
        ...(explanation !== undefined && { explanation }),
        ...(index !== undefined && { index })
      }
    })

    return NextResponse.json({ success: true, question: updatedQuestion })
  } catch (error) {
    console.error('Error updating quiz question:', error)
    return NextResponse.json({ success: false, error: 'Failed to update question' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    const { questionId } = await params
    const questionIdNum = parseInt(questionId)
    
    if (isNaN(questionIdNum)) {
      return NextResponse.json({ success: false, error: 'Invalid question ID' }, { status: 400 })
    }

    await prisma.quizQuestion.delete({
      where: { id: questionIdNum }
    })

    return NextResponse.json({ success: true, message: 'Question deleted successfully' })
  } catch (error) {
    console.error('Error deleting quiz question:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete question' }, { status: 500 })
  }
}