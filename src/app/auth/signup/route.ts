import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Username ou email já em uso' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Erro interno ao criar conta' },
            { status: 500 }
        );
    }
}
