export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple_choice" | "true_false" | "fill_blank" | "matching";
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface QuizData {
  questions: QuizQuestion[];
  passingScore?: number;
  timeLimit?: number;
  showExplanations?: boolean;
}

export interface Hint {
  id: string;
  title: string;
  content: string;
}

export interface DocMethod {
  method: string;
  description: string;
  returnType: string;
}

export interface DocProperty {
  type: "Read/Write" | "Read-Only";
  property: string;
  dataType: string;
  description: string;
}

export interface DocClass {
  className: string;
  description: string;
  usage: string;
  methods: DocMethod[];
  properties: DocProperty[];
}

export interface VisualizerConfig {
  template: string;
  dataMapping?: Record<string, any>;
  style?: Record<string, any>;
  layout?: Record<string, any>;
}

// Database entity types
export interface FullLesson {
  id: number;
  title: string;
  lessonType: "code" | "quiz" | "video";
  status: "draft" | "published";
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  courseId: number;
  index: number;
  lessonContent?: {
    id: number;
    lessonText: string;
    defaultCode?: any;
    abstractedCode?: any;
    testRunner?: any;
    demoData?: any;
    documentationData?: any;
    hintsData?: any;
    visualizerConfig?: any;
    quizData?: any;
    videoUrl?: string;
    videoStart?: number;
    videoEnd?: number;
  };
  sublessons?: {
    id: number;
    title: string;
    lessonType: "code" | "quiz" | "video";
    index: number;
    defaultCode?: any;
    abstractedCode?: any;
    testRunner?: any;
    demoData?: any;
    documentationData?: any;
    hintsData?: any;
    visualizerConfig?: any;
    quizData?: any;
    videoUrl?: string;
    videoStart?: number;
    videoEnd?: number;
  }[];
}



export interface LessonFormData {
  title: string;
  lessonType: "code" | "quiz" | "video";
  lessonText: string;
  defaultCode?: Record<string, string>;
  abstractedCode?: Record<string, string>;
  testRunner?: Record<string, string>;
  demoData?: Record<string, string>;
  documentationData?: DocClass[];
  hintsData?: Hint[];
  visualizerConfig?: VisualizerConfig;
  quizData?: QuizData;
  videoUrl?: string;
  videoStart?: number;
  videoEnd?: number;
}

export interface SublessonFormData extends LessonFormData {
  index: number;
}

export interface CourseFormData {
  title: string;
  slug: string;
  author: string;
  description: string;
  categoryId: number;
  includeVisualizer: boolean;
  status: "draft" | "published";
  lessons: LessonFormData[];
}
