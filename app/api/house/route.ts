import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';


export async function POST(req: Request) {
    try{
        const body = await req.json();
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }
        const House = await prismadb.house.create({
            data: {
                 ...body,
                userId,
            },
        });
        return NextResponse.json(House);
    } catch (error) {
        console.log("Errror at /api/house POST", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}