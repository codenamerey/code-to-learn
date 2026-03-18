export interface EducatorRole {
  isEducator: boolean;
  canEditAllCourses: boolean;
  allowedCourseIds?: number[];
}

export async function getEducatorRole(): Promise<EducatorRole> {
  try {
    // Development bypass - allow educator access in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] Development mode - allowing educator access');
      return {
        isEducator: true,
        canEditAllCourses: true,
        allowedCourseIds: undefined,
      };
    }

    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();

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
  } catch (error) {
    console.error("Error checking educator role:", error);
    
    // Fallback to allow access in development if Clerk fails
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] Development fallback - allowing educator access due to auth error');
      return {
        isEducator: true,
        canEditAllCourses: true,
        allowedCourseIds: undefined,
      };
    }
    
    return {
      isEducator: false,
      canEditAllCourses: false,
    };
  }
}

export async function isEducator(): Promise<boolean> {
  const role = await getEducatorRole();
  return role.isEducator;
}

export async function canEditCourse(courseId: number): Promise<boolean> {
  const role = await getEducatorRole();

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

export async function requireEducator() {
  const educator = await isEducator();

  if (!educator) {
    throw new Error("Unauthorized: Educator role required");
  }

  return educator;
}

export async function requireCourseEditAccess(courseId: number) {
  const canEdit = await canEditCourse(courseId);

  if (!canEdit) {
    throw new Error("Unauthorized: Cannot edit this course");
  }

  return canEdit;
}

export async function getUserId(): Promise<string | null> {
  try {
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}
