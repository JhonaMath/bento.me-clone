import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { TenantRole } from '@prisma/client'

// Function to generate slug from tenant name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, tenantName } = await req.json()

    // Validation
    if (!email || !password || !name || !tenantName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Generate unique slug
    let slug = generateSlug(tenantName)
    let slugExists = await prisma.tenant.findUnique({ where: { slug } })
    let counter = 1
    const maxAttempts = 100
    
    while (slugExists && counter < maxAttempts) {
      slug = `${generateSlug(tenantName)}-${counter}`
      slugExists = await prisma.tenant.findUnique({ where: { slug } })
      counter++
    }
    
    if (slugExists) {
      return NextResponse.json(
        { error: 'Unable to generate unique slug. Please try a different workspace name.' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user, tenant, and membership in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      })

      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          name: tenantName,
          slug,
          ownerId: user.id,
        },
      })

      // Create membership with OWNER role
      await tx.membership.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          role: TenantRole.OWNER,
        },
      })

      return { user, tenant }
    })

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        userId: result.user.id,
        tenantSlug: result.tenant.slug,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
