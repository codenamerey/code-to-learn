"use client";

import { useEffect, useState } from "react";
import { useIsEducator } from "@/lib/clientAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAuth } from "@clerk/nextjs";

interface Course {
  id: number;
  title: string;
  description: string;
  slug: string;
  learnCount: number;
  status: string;
  category: {
    name: string;
  };
  _count: {
    lessons: number;
  };
}

export default function CoursesPage() {
  const isEducator = useIsEducator();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
      return;
    }

    if (isLoaded && isSignedIn && !isEducator) {
      router.push("/");
      return;
    }

    if (isLoaded && isSignedIn && isEducator) {
      fetchCourses();
    }
  }, [isLoaded, isSignedIn, isEducator, router]);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/educator/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn || !isEducator || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Courses</h1>
          <p className="text-muted-foreground mt-2">
            Manage all your courses in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/educator">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
          <Link href="/educator/courses/new">
            <Button>Create New Course</Button>
          </Link>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No courses found</p>
          <Link href="/educator/courses/new">
            <Button>Create Your First Course</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === "draft" 
                      ? "bg-gray-100 text-gray-600" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {course.status === "draft" ? "Draft" : "Published"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {course.description.slice(0, 120)}...
                </p>
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span>{course._count.lessons} lessons</span>
                  {course.status !== "draft" && (
                    <span>{course.learnCount} learners</span>
                  )}
                  <span className="px-2 py-1 border border-gray-200 rounded text-xs">
                    {course.category.name}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/educator/courses/${course.id}/edit`}>
                    <Button size="sm" className="flex-1">
                      Edit Course
                    </Button>
                  </Link>
                  <Link href={`/courses/${course.slug}`}>
                    <Button size="sm" variant="outline">
                      {course.status === "draft" ? "Preview" : "View"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}