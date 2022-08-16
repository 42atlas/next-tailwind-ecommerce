import NextAuth from 'next-auth/next'
import User from '../../../models/Users'
import db from '../../../utils/db'
import bcryptjs from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ user, token }) {
      if (user?._id) token._id = user._id
      if (user?.isAdmin) token.isAdmin = user.isAdmin
      return token
    },
    async session({ session, token }) {
      if (token._id) session.userId = token._id
      if (token.isAdmin) session.isAdmin = token.isAdmin
      return session
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect()
        const user = await User.findOne({ email: credentials.email })
        await db.disconnect()
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
          }
        }
        throw new Error('Invalid credentials')
      },
    }),
  ],
})
