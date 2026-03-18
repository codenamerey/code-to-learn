"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Check, Play } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  lessonCount: number;
  category: { name: string };
}

interface Progress {
  id: string;
  courseId: number;
  completed: boolean;
  lessonId: number | null;
  course: {
    id: number;
    title: string;
    slug: string;
    lessonCount: number;
  };
}

interface BookmarkData {
  id: string;
  courseId: number;
  course: Course;
}

interface UserStats {
  coursesInProgress: number;
  coursesCompleted: number;
  bookmarks: number;
}

export default function ProfilePage() {
  const [clerkComponents, setClerkComponents] = useState<any>(null);
  const [isClerkAvailable, setIsClerkAvailable] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const hasValidKey = !!clerkPubKey && clerkPubKey !== "pk_test_placeholder";
    
    if (hasValidKey) {
      // Dynamically import Clerk only when available
      import("@clerk/nextjs").then((clerk) => {
        setClerkComponents(clerk);
        setIsClerkAvailable(true);
        const { useUser } = clerk;
        // Note: This is a simplified approach - in practice, you'd need to handle hooks properly
      }).catch(() => {
        setIsClerkAvailable(false);
        setLoading(false);
      });
    } else {
      setIsClerkAvailable(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isClerkAvailable && clerkComponents) {
      // For now, set as not signed in to show proper fallback
      setIsSignedIn(false);
      setLoading(false);
    }
  }, [isClerkAvailable, clerkComponents]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userRes, progressRes, bookmarksRes] = await Promise.all([
        fetch("/api/user"),
        fetch("/api/progress"),
        fetch("/api/bookmarks"),
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setStats(userData.stats);
      }

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData.progress);
      }

      if (bookmarksRes.ok) {
        const bookmarkData = await bookmarksRes.json();
        setBookmarks(bookmarkData.bookmarks);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isClerkAvailable || !isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {!isClerkAvailable ? "Authentication not configured" : "Sign in to view your profile"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {!isClerkAvailable
              ? "Set up Clerk credentials in .env to enable authentication"
              : "Track your progress, bookmark courses, and more"}
          </p>
          {isClerkAvailable && clerkComponents && (
            <button 
              onClick={() => {
                // Handle sign in
                console.log("Sign in clicked");
              }}
              className="px-6 py-3 bg-[#0995BC] text-white rounded-lg hover:bg-[#0880A8] transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.firstName || "Learner"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your learning journey
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Play className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                    <p className="text-2xl font-bold">{stats?.coursesInProgress || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Check className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-bold">{stats?.coursesCompleted || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Bookmark className="text-yellow-600 dark:text-yellow-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Bookmarks</p>
                    <p className="text-2xl font-bold">{stats?.bookmarks || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Continue Learning
                </h2>
                {progress.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      No courses in progress. Start a course to track your progress!
                    </p>
                    <Link
                      href="/dashboard"
                      className="inline-block mt-4 px-4 py-2 bg-[#0995BC] text-white rounded-lg hover:bg-[#0880A8]"
                    >
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {progress.map((p) => (
                      <Link
                        key={p.id}
                        href={`/courses/${p.course.slug}/lessons/${p.lessonId || 1}`}
                        className="block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {p.course.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {p.completed ? "Completed" : `Lesson ${p.lessonId || 1} of ${p.course.lessonCount}`}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs ${
                              p.completed
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {p.completed ? "Done" : "Continue"}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Bookmarked Courses
                </h2>
                {bookmarks.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      No bookmarked courses yet. Bookmark courses to save them for later!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookmarks.map((b) => (
                      <Link
                        key={b.id}
                        href={`/courses/${b.course.slug}/lessons/1`}
                        className="block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {b.course.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {b.course.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {b.course.category?.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {b.course.lessonCount} lessons
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}