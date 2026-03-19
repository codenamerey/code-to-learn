import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const fillInBlankId = parseInt(id)
    
    if (isNaN(fillInBlankId)) {
      return NextResponse.json({ success: false, error: 'Invalid fill-in-blank ID' }, { status: 400 })
    }

    const answers = await prisma.fillInBlankAnswer.findMany({
      where: { fillInBlankId },
      orderBy: { blankId: 'asc' }
    })

    return NextResponse.json({ success: true, answers })
  } catch (error) {
    console.error('Error fetching fill-in-blank answers:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch answers' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const fillInBlankId = parseInt(id)
    
    if (isNaN(fillInBlankId)) {
      return NextResponse.json({ success: false, error: 'Invalid fill-in-blank ID' }, { status: 400 })
    }

    const body = await request.json()
    const { blankId, correctAnswer, alternatives, caseSensitive } = body

    const newAnswer = await prisma.fillInBlankAnswer.create({
      data: {
        fillInBlankId,
        blankId: blankId || `BLANK_${Date.now()}`,
        correctAnswer: correctAnswer || 'answer',
        alternatives: alternatives || [],
        caseSensitive: caseSensitive || false
      }
    })

    return NextResponse.json({ success: true, answer: newAnswer })
  } catch (error) {
    console.error('Error creating fill-in-blank answer:', error)
    return NextResponse.json({ success: false, error: 'Failed to create answer' }, { status: 500 })
  }
}