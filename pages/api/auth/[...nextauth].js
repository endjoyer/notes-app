import NextAuth from 'next-auth';
import { Providers } from 'next-auth/react';
import User from '../../../models/User';
import dbConnect from '../../../utils/dbConnect';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        await dbConnect();

        const user = await User.findOne({
          username: credentials.username,
        }).select('+password');

        if (!user) {
          throw new Error('No user found with this username');
        }

        const isPasswordMatch = await user.matchPassword(credentials.password);

        if (!isPasswordMatch) {
          throw new Error('Invalid password');
        }

        return { id: user.id, username: user.username };
      },
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session(session, token) {
      session.user.id = token.id;
      return session;
    },
  },
});
