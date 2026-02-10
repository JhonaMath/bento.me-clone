import { NextRequest, NextResponse } from 'next/server'
import { requireProfileAccess } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { TenantRole } from '@prisma/client'

export async function PATCH(
  req: NextRequest,
  segmentData: { params: Promise<{ profileId: string }> }
) {
  try {
    const params = await segmentData.params
    
    // Verify user has edit access to this profile
    await requireProfileAccess(params.profileId, TenantRole.EDITOR)

    const updates = await req.json()

    // Filter allowed fields
    const allowedFields = [
      'displayName',
      'tagline1',
      'tagline2',
      'bio',
      'avatarUrl',
      'themeJson',
      'published',
    ]
    
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    const profile = await prisma.profile.update({
      where: { id: params.profileId },
      data: filteredUpdates,
    })

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('Unauthorized') || error.message?.includes('Access denied') ? 403 : 500 }
    )
  }
}
