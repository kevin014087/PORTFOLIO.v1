export type ChatAction =
  | 'NAVIGATE_PROJECTS'
  | 'FILTER_PROJECTS_MOBILE'
  | 'FILTER_PROJECTS_WEB'
  | 'FILTER_PROJECTS_FLUTTER'
  | 'FILTER_PROJECTS_REACT'
  | 'NAVIGATE_CONTACT'
  | 'DOWNLOAD_CV'
  | 'OPEN_WHATSAPP'
  | 'NAVIGATE_SERVICES'
  | 'NAVIGATE_EXPERIENCE'
  | 'NAVIGATE_TESTIMONIALS'
  | null;

export interface ChatCard {
  id?: string;
  title: string;
  description?: string;
  link?: string;
  tag?: string;
  badges?: string[];
  action?: ChatAction;
  filter?: 'all' | 'web' | 'mobile' | 'React' | 'Flutter' | 'Supabase' | 'Python';
  projectId?: string;
}

export interface ChatActionButton {
  label: string;
  action: ChatAction;
  url?: string;
  filter?: 'all' | 'web' | 'mobile' | 'React' | 'Flutter' | 'Supabase' | 'Python';
  icon?: 'cv' | 'whatsapp' | 'projects' | 'contact' | 'web' | 'mobile' | 'email';
}

export interface ChatResponse {
  message: string;
  action: ChatAction;
  filter?: 'all' | 'web' | 'mobile' | 'React' | 'Flutter' | 'Supabase' | 'Python';
  cards: ChatCard[];
  quickActions?: ChatActionButton[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  action?: ChatAction;
  filter?: 'all' | 'web' | 'mobile' | 'React' | 'Flutter' | 'Supabase' | 'Python';
  cards?: ChatCard[];
  quickActions?: ChatActionButton[];
}

