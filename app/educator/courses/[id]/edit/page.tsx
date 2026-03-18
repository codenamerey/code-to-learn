"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCanEditCourse } from "@/lib/clientAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";

interface Course {
  id: number;
  title: string;
  description: string;
  slug: string;
  status: string;
  category: {
    name: string;
  };
  lessons: Array<{
    id: number;
    title: string;
    index: number;
    lessonType: string;
    status: string;
    sublessons: Array<{
      id: number;
      title: string;
      index: number;
    }>;
  }>;
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const courseId = parseInt(params.id as string);
  const canEdit = useCanEditCourse(courseId);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip auth check in development
    if (process.env.NODE_ENV === 'development') {
      fetchCourse();
      return;
    }

    if (isLoaded && !isSignedIn) {
      router.push("/");
      return;
    }

    if (isLoaded && isSignedIn && !canEdit) {
      router.push("/educator");
      return;
    }

    if (isLoaded && isSignedIn && canEdit) {
      fetchCourse();
    }
  }, [isLoaded, isSignedIn, canEdit, router, courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/educator/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Failed to fetch course ${courseId}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        // Show error for 2 seconds before redirecting
        setTimeout(() => {
          router.push("/educator");
        }, 2000);
      }
    } catch (error) {
      console.error("Network error fetching course:", error);
      setTimeout(() => {
        router.push("/educator");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn || !canEdit || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600 mb-6">
              The course with ID {courseId} could not be found or you don't have permission to edit it.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to educator dashboard...
            </p>
            <Link href="/educator" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Go to Dashboard Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const courseStatus = course.status || "published";

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/educator">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
          <div className="flex gap-4 mt-4">
            <span className="text-sm">
              Status:{" "}
              <span
                className={
                  courseStatus === "published"
                    ? "text-green-600 font-semibold"
                    : "text-yellow-600 font-semibold"
                }
              >
                {courseStatus}
              </span>
            </span>
            <span className="text-sm">
              Lessons: {course.lessons.length}
            </span>
            <span className="text-sm">
              Category: {course.category.name}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/courses/${course.slug}`}>
            <Button variant="outline">Preview Course</Button>
          </Link>
          <Link href={`/educator/courses/${course.id}/settings`}>
            <Button variant="outline">Settings</Button>
          </Link>
          <Link href={`/educator/courses/${course.id}/lessons/new`}>
            <Button>Add Lesson</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Lessons</h2>
        
        {course.lessons.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No lessons yet. Start by creating your first lesson.
              </p>
              <Link href={`/educator/courses/${course.id}/lessons/new`}>
                <Button>Create First Lesson</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {course.lessons.map((lesson, index) => {
              const lessonStatus = lesson.status || "published";
              return (
                <Card key={lesson.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                      <div>
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-1 rounded bg-muted">
                            {lesson.lessonType}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              lessonStatus === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {lessonStatus}
                          </span>
                          {lesson.sublessons.length > 0 && (
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                              {lesson.sublessons.length} sublessons
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/educator/courses/${course.id}/lessons/${lesson.id}/edit`}
                      >
                        <Button size="sm">Edit Lesson</Button>
                      </Link>
                      {lesson.sublessons.length > 0 && (
                        <Link
                          href={`/educator/courses/${course.id}/lessons/${lesson.id}/sublessons/${lesson.sublessons[0]?.id}/edit`}
                        >
                          <Button size="sm" variant="outline">Edit Sublessons</Button>
                        </Link>
                      )}
                      <Link href={`/courses/${course.slug}/lessons/${lesson.index}`}>
                        <Button size="sm" variant="outline">
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Course Actions</h3>
        <div className="flex gap-2">
          {courseStatus === "draft" && (
            <Button variant="default">Publish Course</Button>
          )}
          {courseStatus === "published" && (
            <Button variant="outline">Unpublish Course</Button>
          )}
          <Button variant="destructive">Delete Course</Button>
        </div>
      </div>
    </div>
  );
}