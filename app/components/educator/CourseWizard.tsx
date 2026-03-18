"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseFormData } from "@/types/educator";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CourseWizardProps {
  categories: Category[];
}

export function CourseWizard({ categories }: CourseWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CourseFormData>>({
    title: "",
    slug: "",
    author: "",
    description: "",
    categoryId: undefined,
    includeVisualizer: false,
    status: "draft",
    lessons: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof CourseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    updateField("title", title);
    if (!formData.slug || formData.slug === generateSlug(formData.title || "")) {
      updateField("slug", generateSlug(title));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/educator/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create course");

      const course = await response.json();
      router.push(`/educator/courses/${course.id}/edit`);
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid =
    formData.title &&
    formData.slug &&
    formData.author &&
    formData.description &&
    formData.categoryId;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2].map((step) => (
            <div
              key={step}
              className={`flex items-center ${step === 1 ? "flex-1" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step}
              </div>
              {step === 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > 1 ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <span>Course Details</span>
          <span>Review & Create</span>
        </div>
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTitleChange(e.target.value)}
                placeholder="Introduction to Python"
              />
            </div>

            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("slug", e.target.value)}
                placeholder="introduction-to-python"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This will be used in the course URL
              </p>
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("author", e.target.value)}
                placeholder="Your Name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("description", e.target.value)}
                placeholder="A comprehensive introduction to Python programming..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.categoryId?.toString() || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateField("categoryId", parseInt(e.target.value))
                }
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeVisualizer"
                checked={formData.includeVisualizer || false}
                onChange={(e) =>
                  updateField("includeVisualizer", e.target.checked)
                }
                className="w-4 h-4"
              />
              <Label htmlFor="includeVisualizer">
                Include code visualizer for this course
              </Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!isStep1Valid}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Create</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Title:</span> {formData.title}
              </div>
              <div>
                <span className="font-semibold">Slug:</span> {formData.slug}
              </div>
              <div>
                <span className="font-semibold">Author:</span> {formData.author}
              </div>
              <div>
                <span className="font-semibold">Description:</span>{" "}
                {formData.description}
              </div>
              <div>
                <span className="font-semibold">Category:</span>{" "}
                {categories.find((c) => c.id === formData.categoryId)?.name}
              </div>
              <div>
                <span className="font-semibold">Visualizer:</span>{" "}
                {formData.includeVisualizer ? "Enabled" : "Disabled"}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {formData.status === "draft" ? "Draft" : "Published"}
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                After creating the course, you'll be able to add lessons,
                quizzes, and other content to it.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
