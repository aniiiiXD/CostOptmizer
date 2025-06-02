export interface Question {
  id: string;
  question: string;
  placeholder: string;
  inputType?: 'text' | 'textarea' | 'select';
  options?: string[];
}

export interface ApiResponse {
  response: string;
}