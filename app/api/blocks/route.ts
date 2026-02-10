import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sectionId, type, order } = await req.json()

    const block = await prisma.block.create({
      data: {
        sectionId,
        type,
        order: order || 0,
        content: '',
      },
    })

    return NextResponse.json(block, { status: 201 })
  } catch (error) {
    console.error('Block creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
