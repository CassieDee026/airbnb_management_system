import { auth } from "@clerk/nextjs";
import {NextResponse} from "next/server";
import prismadb from "@lib/prismadb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const house = await prismadb.house.create({
            data: {
                ...body,
                userId
            }
        });

        return NextResponse.json(house);
    } catch (error) {
        console.error('Error at /api/house POST', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
