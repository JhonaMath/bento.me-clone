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

    const { profileId, title, order } = await req.json()

    const section = await prisma.section.create({
      data: {
        profileId,
        title: title || null,
        order: order || 0,
      },
      include: {
        blocks: true,
      },
    })

    return NextResponse.json(section, { status: 201 })
  } catch (error) {
    console.error('Section creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
