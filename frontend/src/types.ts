export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  status: string;
  published_at: string | null;
}

export interface TldrResponse {
  summary_points: string[];
  cached: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
}

export interface FlashcardData {
  front: string;
  back: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
  flashcards: FlashcardData[];
  cached: boolean;
}