import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                // Impede login vazio
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Busca usuário no banco pelo email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                // Se não existir, login falha
                if (!user) {
                    return null;
                }

                // Compara senha digitada com hash salvo
                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                // Se não bater, login falha
                if (!passwordMatch) {
                    return null;
                }

                // Retorna os dados mínimos para a sessão
                return {
                    id: user.id,
                    email: user.email,
                    name: user.username,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};
