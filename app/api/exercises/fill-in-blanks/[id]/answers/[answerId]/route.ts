import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; answerId: string }> }
) {
  try {
    const { answerId } = await params
    const answerIdNum = parseInt(answerId)
    
    if (isNaN(answerIdNum)) {
      return NextResponse.json({ success: false, error: 'Invalid answer ID' }, { status: 400 })
    }

    const answer = await prisma.fillInBlankAnswer.findUnique({
      where: { id: answerIdNum }
    })

    if (!answer) {
      return NextResponse.json({ success: false, error: 'Answer not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, answer })
  } catch (error) {
    console.error('Error fetching fill-in-blank answer:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch answer' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; answerId: string }> }
) {
  try {
    const { answerId } = await params
    const answerIdNum = parseInt(answerId)
    
    if (isNaN(answerIdNum)) {
      return NextResponse.json({ success: false, error: 'Invalid answer ID' }, { status: 400 })
    }

    const body = await request.json()
    const { blankId, correctAnswer, alternatives, caseSensitive } = body

    const updatedAnswer = await prisma.fillInBlankAnswer.update({
      where: { id: answerIdNum },
      data: {
        ...(blankId !== undefined && { blankId }),
        ...(correctAnswer !== undefined && { correctAnswer }),
        ...(alternatives !== undefined && { alternatives }),
        ...(caseSensitive !== undefined && { caseSensitive })
      }
    })

    return NextResponse.json({ success: true, answer: updatedAnswer })
  } catch (error) {
    console.error('Error updating fill-in-blank answer:', error)
    return NextResponse.json({ success: false, error: 'Failed to update answer' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; answerId: string }> }
) {
  try {
    const { answerId } = await params
    const answerIdNum = parseInt(answerId)
    
    if (isNaN(answerIdNum)) {
      return NextResponse.json({ success: false, error: 'Invalid answer ID' }, { status: 400 })
    }

    await prisma.fillInBlankAnswer.delete({
      where: { id: answerIdNum }
    })

    return NextResponse.json({ success: true, message: 'Answer deleted successfully' })
  } catch (error) {
    console.error('Error deleting fill-in-blank answer:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete answer' }, { status: 500 })
  }
}