import { NextRequest, NextResponse } from 'next/server'
import { requireProfileAccess } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { TenantRole } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const { sectionId, type, order } = await req.json()

    // Get section to verify profile access
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      select: { profileId: true },
    })

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }

    // Verify user has edit access to this profile
    await requireProfileAccess(section.profileId, TenantRole.EDITOR)

    const block = await prisma.block.create({
      data: {
        sectionId,
        type,
        order: order || 0,
        content: '',
      },
    })

    return NextResponse.json(block, { status: 201 })
  } catch (error: any) {
    console.error('Block creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('Unauthorized') || error.message?.includes('Access denied') ? 403 : 500 }
    )
  }
}
