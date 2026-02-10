import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  segmentData: { params: Promise<{ sectionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title } = await req.json()
    const params = await segmentData.params

    const section = await prisma.section.update({
      where: { id: params.sectionId },
      data: { title },
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Section update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  segmentData: { params: Promise<{ sectionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await segmentData.params

    await prisma.section.delete({
      where: { id: params.sectionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Section deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
