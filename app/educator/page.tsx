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

export default function EducatorDashboard() {
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

  const draftCourses = courses.filter((c) => c.status === "draft");
  const publishedCourses = courses.filter((c) => c.status !== "draft");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Educator Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/educator/courses">
            <Button variant="outline">View All Courses</Button>
          </Link>
          <Link href="/educator/courses/new">
            <Button>Create New Course</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Drafts ({draftCourses.length})
          </h2>
          {draftCourses.length === 0 ? (
            <p className="text-muted-foreground">No draft courses</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {draftCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {course.description.slice(0, 100)}...
                    </p>
                    <p className="text-sm mb-4">
                      {course._count.lessons} lessons
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/educator/courses/${course.id}/edit`}>
                        <Button size="sm">Edit</Button>
                      </Link>
                      <Link href={`/courses/${course.slug}`}>
                        <Button size="sm" variant="outline">
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Published ({publishedCourses.length})
          </h2>
          {publishedCourses.length === 0 ? (
            <p className="text-muted-foreground">No published courses</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {publishedCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {course.description.slice(0, 100)}...
                    </p>
                    <p className="text-sm mb-4">
                      {course._count.lessons} lessons • {course.learnCount}{" "}
                      learners
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/educator/courses/${course.id}/edit`}>
                        <Button size="sm">Edit</Button>
                      </Link>
                      <Link href={`/courses/${course.slug}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}