import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const adminEmails = (process.env.AUTH_ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    ...(process.env.AUTH_KAKAO_ID ? [Kakao({
      clientId: process.env.AUTH_KAKAO_ID,
      clientSecret: process.env.AUTH_KAKAO_SECRET ?? "",
    })] : []),
    ...(process.env.AUTH_NAVER_ID ? [Naver({
      clientId: process.env.AUTH_NAVER_ID,
      clientSecret: process.env.AUTH_NAVER_SECRET ?? "",
    })] : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user?.passwordHash) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!valid) return null;
        return user;
      },
    }),
  ],
  events: {
    // 소셜 로그인으로 신규 가입 시 관리자 이메일이면 ADMIN으로 승격
    async createUser({ user }) {
      if (user.email && adminEmails.includes(user.email)) {
        await prisma.user.update({
          where: { email: user.email },
          data: { role: "ADMIN" },
        });
      }
    },
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
      }
      // 로그인 직후 또는 세션 갱신 시 DB에서 최신 role 조회
      if (user || trigger === "update") {
        const email = token.email ?? user?.email;
        if (email) {
          const dbUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, role: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            // 관리자 이메일이면 항상 ADMIN 보장
            if (adminEmails.includes(email) && dbUser.role !== "ADMIN") {
              await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
              token.role = "ADMIN";
            } else {
              token.role = dbUser.role;
            }
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        (session.user as typeof session.user & { role: string }).role = token.role as string;
      }
      return session;
    },
  },
});
