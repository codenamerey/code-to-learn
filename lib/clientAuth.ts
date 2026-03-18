"use client";

import { useUser } from "@clerk/nextjs";

export interface AuthUser {
  userId: string;
  isLoading: boolean;
}

export function useAuth(): AuthUser {
  const { user, isLoaded } = useUser();
  
  // For development/testing, provide fake user data if not logged in
  if (process.env.NODE_ENV === 'development') {
    return {
      userId: user?.id || 'dev-user-123',
      isLoading: !isLoaded
    };
  }
  
  return {
    userId: user?.id || '',
    isLoading: !isLoaded
  };
}

export interface EducatorRole {
  isEducator: boolean;
  canEditAllCourses: boolean;
  allowedCourseIds?: number[];
}

export function useEducatorRole(): EducatorRole {
  const { user } = useUser();

  if (!user) {
    return {
      isEducator: false,
      canEditAllCourses: false,
    };
  }

  const publicMetadata = user.publicMetadata as {
    role?: string;
    educator?: boolean;
    allowedCourseIds?: number[];
  };

  const isEducator =
    publicMetadata?.role === "educator" || publicMetadata?.educator === true;
  const canEditAllCourses = isEducator && !publicMetadata?.allowedCourseIds;

  return {
    isEducator,
    canEditAllCourses,
    allowedCourseIds: publicMetadata?.allowedCourseIds,
  };
}

export function useIsEducator(): boolean {
  const role = useEducatorRole();
  
  // For development/testing, allow educator access if no user is logged in
  if (process.env.NODE_ENV === 'development' && !role.isEducator) {
    return true;
  }
  
  return role.isEducator;
}

export function useCanEditCourse(courseId: number): boolean {
  const role = useEducatorRole();

  // For development/testing, allow editing if no user is logged in
  if (process.env.NODE_ENV === 'development' && !role.isEducator) {
    return true;
  }

  if (!role.isEducator) {
    return false;
  }

  if (role.canEditAllCourses) {
    return true;
  }

  if (role.allowedCourseIds) {
    return role.allowedCourseIds.includes(courseId);
  }

  return false;
}