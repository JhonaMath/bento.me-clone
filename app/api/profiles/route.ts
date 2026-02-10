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

    const userId = (session.user as any).id
    const { tenantId, handle, displayName } = await req.json()

    // Verify user owns the tenant
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: tenantId,
        ownerId: userId,
      },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
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
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
