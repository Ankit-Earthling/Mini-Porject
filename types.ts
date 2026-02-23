
// FIX: Import FC and SVGProps from react to resolve namespace error.
import type { FC, SVGProps } from 'react';

export interface Contribution {
  id: string;
  name: string;
  content: string;
  type: 'quote' | 'story';
  status: 'pending' | 'published';
  timestamp: number;
}

export interface NavLink {
  name: string;
  path: string;
  isPrimary?: boolean;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface QuizQuestion {
  question: string;
  type: 'radio' | 'select';
  options?: string[];
  section: string;
  next: string | { [answer: string]: string };
}

export interface UserInputs {
  courseSatisfaction: string;
  academicPressure: string;
  sourceOfPressure?: string;
  workload: string;
  copingWithWorkload?: string;
  peerComparison: string;
  impostorSyndrome: string;
  futureAnxiety: string;
  relationshipStatus: string;
  relationshipHealth?: string;
  satisfactionWithSingleLife?: string;
  relationshipStress?: string;
  socialSatisfaction: string;
  loneliness: string;
  supportSystem: string;
  familyPressure: string;
  sleepQuality: string;
  socialMediaImpact: string;
  doomscrolling: string;
  financialAnxiety: string;
  burnoutFeeling: string;
  stressManagement: string;
  energyLevels: string;
  interestLoss: string;
  feelingDown: string;
  anxiety: string;
  worrying: string;
  panicAttack: string;
  soughtTreatment: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Resource {
    title: string;
    description:string;
    link: string;
    type: 'helpline' | 'guide' | 'counselor';
}

export interface ArticleSection {
  heading: string;
  content: string;
  image?: string;
}

export interface LearnTopic {
  slug: string;
  title: string;
  cardImage: string;
  cardDescription: string;
  article: {
    title: string;
    introduction: string;
    sections: ArticleSection[];
    conclusion: string;
  }
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface VideoResource {
  title: string;
  description: string;
  videoId: string;
}

export interface Quote {
  quote: string;
  author: string;
}

export interface MindfulExercise {
  title: string;
  description: string;
}

export interface PositiveStory {
  title: string;
  content: string;
}

export interface Counselor {
  name: string;
  address: string;
  phone: string;
  specialty?: string;
}

export interface Suggestion {
  title: string;
  text: string;
  link: string;
  linkText: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
}

export interface YogaAsana {
  id: string;
  name: string;
  sanskritName: string;
  benefits: string;
  steps: string[];
  image: string;
  focus?: string;
  didYouKnow?: string;
  physiologicalEffect?: string;
  cautions?: string;
}

export interface UserFeedback {
  id: string;
  content: string;
  type: 'suggestion' | 'complaint' | 'general';
  timestamp: number;
}
