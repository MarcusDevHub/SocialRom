// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
        return NextResponse.json({ error: 'roomId necessário' }, { status: 400 });
    }

    try {
        // Busca mensagens das últimas 6 horas
        const sixHoursAgo = new Date(Date.now() - SIX_HOURS_MS);

        const messages = await prisma.chatMessage.findMany({
            where: {
                roomId,
                createdAt: { gte: sixHoursAgo },
            },
            orderBy: { createdAt: 'asc' },
        });

        // Limpa mensagens antigas (mais de 6h)
        await prisma.chatMessage.deleteMany({
            where: {
                roomId,
                createdAt: { lt: sixHoursAgo },
            },
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Erro ao buscar chat:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { roomId, username, content } = body;

        if (!roomId || !username || !content) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
        }

        const message = await prisma.chatMessage.create({
            data: { roomId, username, content },
        });

        return NextResponse.json({ message });
    } catch (error) {
        console.error('Erro ao salvar mensagem:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}