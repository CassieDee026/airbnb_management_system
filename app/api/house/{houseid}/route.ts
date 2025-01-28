import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function PATCH(req: Request, { params }: { params: { houseid: string } }) {
    try {
        const body = await req.json();
        const updatedHouse = await prismadb.house.update({
            where: { id: params.houseid },
            data: body,
        });
        return NextResponse.json(updatedHouse);
    } catch (error) {
        console.error("Error updating house:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}