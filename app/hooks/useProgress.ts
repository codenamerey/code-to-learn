"use client";

import { useState, useEffect } from "react";
import { prisma } from "@/lib/prisma";

interface ProgressData {
  courseId: number;
  lessonId: number | null;
  completed: boolean;
}

export function useProgress(courseId: number, lessonId: number) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [courseId]);

  const fetchProgress = async () => {
    try {
      const response = await fetch("/api/progress");
      const data = await response.json();
      if (data.success) {
        const courseProgress = data.progress.find(
          (p: any) => p.courseId === courseId,
        );
        setProgress(courseProgress || null);
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async () => {
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          lessonId,
          completed: true,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setProgress(data.progress);
      }
      return data.success;
    } catch (err) {
      console.error("Error marking complete:", err);
      return false;
    }
  };

  const updateLesson = async (newLessonId: number) => {
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          lessonId: newLessonId,
          completed: progress?.completed || false,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setProgress(data.progress);
      }
      return data.success;
    } catch (err) {
      console.error("Error updating lesson:", err);
      return false;
    }
  };

  return { progress, loading, markComplete, updateLesson, fetchProgress };
}