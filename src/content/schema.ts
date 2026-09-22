export type RankTier = 'Cadet' | 'Astronaut' | 'Mission Specialist' | 'Commander';
export type SpaceRank = RankTier;

export interface LessonContentBlock {
  type: 'paragraph' | 'nasa_fact' | 'analogy' | 'did_you_know';
  heading_bn?: string;
  text_bn: string;
}

export interface Lesson {
  id: string;
  level: RankTier;
  order_index: number;
  title_bn: string;
  summary_bn: string;
  blocks: LessonContentBlock[];
  nasa_source?: string;
  read_time_minutes: number;
  xp_reward: number;
  icon_name?: string;
}

export interface QuizQuestion {
  id: string;
  lesson_id: string;
  order_index: number;
  prompt_bn: string;
  options_bn: string[];
  correct_index: number;
  explanation_bn: string;
  hint_bn?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttemptRecord {
  id?: string;
  lesson_id: string;
  score: number;
  total_questions: number;
  xp_earned: number;
  answers: {
    question_id: string;
    chosen_index: number;
    is_correct: boolean;
  }[];
  completed_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  rank: RankTier;
  xp: number;
  completed_lessons: string[];
  perfect_quizzes: string[];
}
