import { handlers } from 'app/lib/auth';
// import NextAuth from 'next-auth';

// import { YandexProfile } from 'next-auth/providers/yandex';
// import type { NextAuthOptions } from 'next-auth';
// import { OAuthConfig } from 'next-auth/providers';

// const YandexProvider: OAuthConfig<YandexProfile> = {
//   id: 'yandex',
//   name: 'Yandex',
//   type: 'oauth',
//   authorization: {
//     url: 'https://oauth.yandex.ru/authorize',
//     params: {
//       scope: 'login:email login:info',
//       response_type: 'code',
//     },
//   },
//   token: 'https://oauth.yandex.ru/token',
//   userinfo: 'https://login.yandex.ru/info',
//   clientId: process.env.YANDEX_CLIENT_ID,
//   clientSecret: process.env.YANDEX_CLIENT_SECRET,
//   profile(profile) {
//     return {
//       id: profile.id,
//       name: profile.display_name ?? profile.real_name ?? profile.first_name,
//       email: profile.default_email,
//       provider: 'yandex',
//       external_id: profile.id,
//     };
//   },
// };

// export const authOptions: NextAuthOptions = {
//   providers: [YandexProvider],
//   callbacks: {
//     async signIn({ user }) {
//       // Отправка данных пользователя на backend для логирования
//       try {
//         const response = await fetch(
//           process.env.NEXT_PUBLIC_BACKEND_URL + '/api/auth/log',
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               external_id: user.id,
//               provider: 'yandex',
//               email: user.email,
//               name: user.name,
//               action: 'login',
//               success: true,
//             }),
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();

//           // Добавляем роль пользователя из backend
//           if (data.user?.role) {
//             user.role = data.user.role;
//           }
//         }
//       } catch (e) {
//         console.error('Error logging to backend:', e);
//       }
//       return true;
//     },
//     async session({ session, token }) {
//       // Добавляем роль в сессию
//       if (token.role) {
//         session.user.role = token.role as string;
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       // Сохраняем роль в JWT токене
//       if (user?.role) {
//         token.role = user.role;
//       }
//       return token;
//     },
//   },
//   debug: true, // Включаем отладку для диагностики
// }; 
// export const handlers = NextAuth(authOptions);

export {  handlers as GET, handlers as POST };