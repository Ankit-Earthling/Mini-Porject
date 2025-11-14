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
  options: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Resource {
    title: string;
    description: string;
    link: string;
    type: 'helpline' | 'guide' | 'counselor';
}

export interface Disease {
    name: string;
    description: string;
    causes: string[];
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