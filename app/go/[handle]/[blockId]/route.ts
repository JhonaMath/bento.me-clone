import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  segmentData: { params: Promise<{ handle: string; blockId: string }> }
) {
  try {
    const params = await segmentData.params
    const { handle, blockId } = params

    // Find the profile and block
    const profile = await prisma.profile.findUnique({
      where: { handle },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const block = await prisma.block.findFirst({
      where: {
        id: blockId,
        section: {
          profileId: profile.id,
        },
      },
    })

    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 })
    }

    // Track the click
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    await prisma.click.create({
      data: {
        blockId: block.id,
        profileId: profile.id,
        ipAddress,
        userAgent,
      },
    })

    // Redirect to the URL
    const targetUrl = block.url || block.content
    if (targetUrl) {
      redirect(targetUrl)
    }

    return NextResponse.json({ error: 'No URL found' }, { status: 404 })
  } catch (error) {
    console.error('Click tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
