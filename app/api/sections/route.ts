import { NextRequest, NextResponse } from 'next/server'
import { requireProfileAccess } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { TenantRole } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const { profileId, title, order } = await req.json()

    // Verify user has edit access to this profile
    await requireProfileAccess(profileId, TenantRole.EDITOR)

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
  } catch (error: any) {
    console.error('Section creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('Unauthorized') || error.message?.includes('Access denied') ? 403 : 500 }
    )
  }
}
