import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { prisma } from './prisma';
import { TenantRole } from '@prisma/client';

/**
 * Get the current authenticated user or throw an error
 */
export async function requireUser() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    throw new Error('Unauthorized: You must be logged in');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Check if user has required tenant membership role
 */
export async function requireTenantMembership(
  tenantSlug: string,
  minRole: TenantRole = TenantRole.VIEWER
) {
  const user = await requireUser();

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      memberships: {
        where: { userId: user.id },
      },
    },
  });

  if (!tenant) {
    throw new Error('Tenant not found');
  }

  const membership = tenant.memberships[0];
  
  if (!membership) {
    throw new Error('Access denied: You are not a member of this workspace');
  }

  // Check role hierarchy: OWNER > ADMIN > EDITOR > VIEWER
  const roleHierarchy: Record<TenantRole, number> = {
    [TenantRole.OWNER]: 4,
    [TenantRole.ADMIN]: 3,
    [TenantRole.EDITOR]: 2,
    [TenantRole.VIEWER]: 1,
  };

  if (roleHierarchy[membership.role] < roleHierarchy[minRole]) {
    throw new Error(`Access denied: Requires ${minRole} role or higher`);
  }

  return {
    user,
    tenant,
    membership,
  };
}

/**
 * Check if user can access a specific profile
 */
export async function requireProfileAccess(profileId: string, minRole: TenantRole = TenantRole.VIEWER) {
  const user = await requireUser();

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      tenant: {
        include: {
          memberships: {
            where: { userId: user.id },
          },
        },
      },
    },
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  const membership = profile.tenant.memberships[0];
  
  if (!membership) {
    throw new Error('Access denied: You are not a member of this workspace');
  }

  // Check role hierarchy
  const roleHierarchy: Record<TenantRole, number> = {
    [TenantRole.OWNER]: 4,
    [TenantRole.ADMIN]: 3,
    [TenantRole.EDITOR]: 2,
    [TenantRole.VIEWER]: 1,
  };

  if (roleHierarchy[membership.role] < roleHierarchy[minRole]) {
    throw new Error(`Access denied: Requires ${minRole} role or higher`);
  }

  return {
    user,
    profile,
    tenant: profile.tenant,
    membership,
  };
}

/**
 * Get user's tenants with membership info
 */
export async function getUserTenants() {
  const user = await requireUser();

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: {
      tenant: {
        include: {
          _count: {
            select: {
              profiles: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return memberships.map((m) => ({
    ...m.tenant,
    role: m.role,
    profileCount: m.tenant._count.profiles,
  }));
}
