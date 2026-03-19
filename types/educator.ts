// Database models for exercises
export interface DbQuiz {
  id: number;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  showExplanations: boolean;
  index: number;
  lessonId?: number;
  sublessonId?: number;
  questions: DbQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DbQuizQuestion {
  id: number;
  quizId: number;
  question: string;
  type: string;
  options?: any;
  correctAnswer: string;
  explanation?: string;
  index: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbCodeChallenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  starterCode: any;
  solution: any;
  tests: any;
  hints: any;
  index: number;
  lessonId?: number;
  sublessonId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbFillInBlank {
  id: number;
  title: string;
  text: string;
  explanation?: string;
  index: number;
  lessonId?: number;
  sublessonId?: number;
  blanks: DbFillInBlankAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DbFillInBlankAnswer {
  id: number;
  fillInBlankId: number;
  blankId: string;
  correctAnswer: string;
  alternatives: any;
  caseSensitive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

// Enhanced exercise system types
export interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  starterCode: Record<string, string>; // language -> code
  solution: Record<string, string>; // language -> solution
  tests: Record<string, string>; // language -> test code
  hints?: string[];
  difficulty: "easy" | "medium" | "hard";
}

export interface FillInBlank {
  id: string;
  title: string;
  text: string; // Text with ___BLANK_1___, ___BLANK_2___ placeholders
  blanks: {
    id: string;
    correctAnswer: string;
    alternatives?: string[]; // Alternative correct answers
    caseSensitive?: boolean;
  }[];
  explanation?: string;
}

// Client-side exercise interface (for form state)
export interface Exercise {
  id: string;
  type: "quiz" | "code_challenge" | "fill_in_blank";
  title: string;
  data: QuizData | CodeChallenge | FillInBlank;
}

export interface ExerciseContainer {
  exercises: Exercise[];
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
  quizData?: QuizData; // Legacy support
  exerciseData?: ExerciseContainer; // New exercise system
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
