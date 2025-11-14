import type { NavLink, Testimonial, QuizQuestion, Resource, Disease, FaqItem, VideoResource, Quote } from './types';

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', path: '/', isPrimary: true },
  { name: 'Wellness Test', path: '/quiz', isPrimary: true },
  { name: 'AI Companion', path: '/chatbot', isPrimary: true },
  { name: 'Resources', path: '/resources', isPrimary: true },
  { name: 'Activities', path: '/activities', isPrimary: true },
  { name: 'Learn', path: '/diseases' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "This platform was a guiding light during a tough semester. The AI chatbot provided a safe space to vent, and the resources were incredibly helpful.",
    author: 'Alex Johnson',
    role: 'Computer Science Student',
  },
  {
    quote: "I was hesitant at first, but the anonymity of the wellness test encouraged me to seek help. The results gave me the clarity I needed.",
    author: 'Priya Sharma',
    role: 'Arts & Humanities Student',
  },
  {
    quote: "A truly calming and well-designed space. It feels less like a clinical tool and more like a supportive friend. Highly recommended.",
    author: 'Ben Carter',
    role: 'Graduate Student',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        question: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        question: "How often have you had little interest or pleasure in doing things you normally enjoy?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        question: "How often have you been feeling nervous, anxious, or on edge?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        question: "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        question: "How often have you felt that things were not going your way?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        question: "In the past 2 weeks, have you had thoughts that you would be better off dead, or of hurting yourself?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    }
];


export const RESOURCES: Resource[] = [
    { title: 'National Suicide Prevention Lifeline', description: '24/7, free and confidential support for people in distress.', link: 'tel:988', type: 'helpline' },
    { title: 'Crisis Text Line', description: 'Text HOME to 741741 from anywhere in the US, anytime, about any type of crisis.', link: 'sms:741741', type: 'helpline' },
    { title: 'The Trevor Project', description: 'Support for LGBTQ young people in crisis, 24/7.', link: 'tel:1-866-488-7386', type: 'helpline' },
    { title: 'Mindful Breathing Exercises', description: 'A simple guide to calm your mind and body through breathing.', link: '#/resources', type: 'guide' },
    { title: 'Understanding Cognitive Behavioral Therapy (CBT)', description: 'Learn about a powerful technique for managing anxiety and depression.', link: '#/resources', type: 'guide' },
    { title: 'Campus Counseling Center', description: 'Find professional, confidential support right at your university.', link: '#/resources', type: 'counselor' },
];

export const DISEASES: Disease[] = [
    {
        name: 'Anxiety',
        description: 'Anxiety is your body\'s natural response to stress. It’s a feeling of fear or apprehension about what’s to come. But if your feelings of anxiety are extreme, last for longer than six months, and are interfering with your life, you may have an anxiety disorder.',
        causes: ['High-stress events (exams, deadlines)', 'Genetic predisposition', 'Medical conditions', 'Substance use']
    },
    {
        name: 'Depression',
        description: 'Depression (major depressive disorder) is a common and serious medical illness that negatively affects how you feel, the way you think and how you act. It causes feelings of sadness and/or a loss of interest in activities you once enjoyed.',
        causes: ['Brain chemistry', 'Hormonal changes', 'Life trauma and stress', 'Family history']
    },
    {
        name: 'Stress',
        description: 'Stress is a feeling of emotional or physical tension. It can come from any event or thought that makes you feel frustrated, angry, or nervous. In short bursts, stress can be positive, such as when it helps you avoid danger or meet a deadline. But when stress lasts for a long time, it may harm your health.',
        causes: ['Academic pressure', 'Social challenges', 'Financial worries', 'Major life changes']
    }
];

export const FAQS: FaqItem[] = [
    {
        question: "Is this service confidential?",
        answer: "Yes, your privacy is our top priority. The Wellness Test is completely anonymous, and your conversations with the AI Companion are private and not shared."
    },
    {
        question: "Is the AI Companion a replacement for a therapist?",
        answer: "No. The AI Companion is a supportive tool designed for emotional support, journaling, and providing resources. It is not a substitute for professional medical advice, diagnosis, or treatment. We strongly encourage you to connect with a qualified counselor for personalized care."
    },
    {
        question: "What happens if I'm in a crisis?",
        answer: "If you are in immediate danger or a crisis, please call 911 or a crisis hotline like the National Suicide Prevention Lifeline at 988. Our platform provides quick access to these numbers on the Resources page and other relevant sections."
    },
    {
        question: "How does the Mental Wellness Test work?",
        answer: "The test is a short, adaptive questionnaire based on clinically validated screening tools. It asks about your feelings and experiences over the past few weeks to provide a general indication of your mental well-being and suggest appropriate next steps."
    }
];

export const VIDEO_RESOURCES: VideoResource[] = [
    {
        title: "I had a black dog, his name was depression",
        description: "A moving illustration by the WHO, based on Matthew Johnstone's book, on what it's like to live with depression.",
        videoId: "XiCrniLQGYc"
    },
    {
        title: "There's more to life than being happy",
        description: "In this TED talk, Emily Esfahani Smith discusses the four pillars of a meaningful life, offering a new perspective on happiness.",
        videoId: "y9kb_h_2_uk"
    },
    {
        title: "A simple way to break a bad habit",
        description: "Psychiatrist Judson Brewer shares a simple but profound tactic to beat addictions and habits by understanding your own mind.",
        videoId: "wM1g4kvAbhQ"
    },
];

export const INSPIRATIONAL_QUOTES: Quote[] = [
    { quote: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
    { quote: "The best way out is always through.", author: "Robert Frost" },
    { quote: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
    { quote: "Within you, there is a stillness and a sanctuary to which you can retreat at any time and be yourself.", author: "Hermann Hesse" },
    { quote: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh" },
];