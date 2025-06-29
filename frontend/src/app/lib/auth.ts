import NextAuth from 'next-auth';
import { authOptions } from 'app/lib/authOptions';

export const handlers = NextAuth(authOptions);
export { handlers as GET, handlers as POST };
