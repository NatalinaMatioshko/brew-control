import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

function createInviteOnlyAdapter(): Adapter {
  const base = PrismaAdapter(prisma as never);

  return {
    ...base,
    getUserByEmail: async (email) => {
      if (!base.getUserByEmail) {
        return null;
      }

      return base.getUserByEmail(email.trim().toLowerCase());
    },
    createUser: async () => {
      throw new Error("Invite-only: user creation is disabled");
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: createInviteOnlyAdapter(),
  session: { strategy: "jwt" },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.trim().toLowerCase();
      if (!email) {
        return false;
      }

      const existing = await prisma.user.findUnique({
        where: { email },
        select: { isActive: true },
      });

      return existing?.isActive === true;
    },
    async jwt({ token, user }) {
      const email = (user?.email ?? token.email)?.trim().toLowerCase();

      if (user && email) {
        const dbUser = await prisma.user.findUnique({
          where: { email },
          select: { id: true, role: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id && token.role) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
});
