import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const prismadb = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'production') {
    global.prisma = prismadb;
}

export default prismadb;