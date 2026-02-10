import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { TenantRole } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser()
    const { tenantId, handle, displayName } = await req.json()

    // Verify user has access to the tenant
    const membership = await prisma.membership.findFirst({
      where: {
        userId: user.id,
        tenantId,
        role: {
          in: [TenantRole.OWNER, TenantRole.ADMIN, TenantRole.EDITOR],
        },
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied: Insufficient permissions' },
        { status: 403 }
      )
    }

    // Validate handle format
    if (!/^[a-z0-9-]+$/.test(handle)) {
      return NextResponse.json(
        { error: 'Handle can only contain lowercase letters, numbers, and hyphens' },
        { status: 400 }
      )
    }

    // Check if handle is already taken
    const existingProfile = await prisma.profile.findUnique({
      where: { handle },
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Handle already taken' },
        { status: 400 }
      )
    }

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        handle,
        displayName: displayName || handle,
        tenantId,
      },
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error: any) {
    console.error('Profile creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}
