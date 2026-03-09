import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        // Lê os dados enviados pelo formulário
        const { username, email, password } = await req.json();

        // Validação básica
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }

        // Verifica se já existe usuário com mesmo username ou email
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Username ou email já está em uso' },
                { status: 400 }
            );
        }

        // Criptografa a senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o usuário no banco
        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: 'Conta criada com sucesso' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Erro no signup:', error);

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
