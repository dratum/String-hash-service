import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    provider?: string;
    external_id?: string;
    role?: string;
  }
  
  interface Session {
    user: User;
  }
} 