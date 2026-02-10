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
      select: { id: true, tenantId: true },
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
    const referrer = req.headers.get('referer') || req.headers.get('referrer') || null
    const targetUrl = block.url || block.content

    await prisma.click.create({
      data: {
        tenantId: profile.tenantId,
        profileId: profile.id,
        blockId: block.id,
        url: targetUrl,
        referrer,
        ipAddress,
        userAgent,
      },
    })

    // Redirect to the URL
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
