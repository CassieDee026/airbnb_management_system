import prismadb from "@/lib/prismadb";

export const getHouseById = async (houseid: string) => {
   try {
     const House = await prismadb.house.findUnique({
            where: {id: houseid},
            include: {rooms: true},
     });
     if (!House) return null;

     return House;

   } 
   catch (error) {
      console.error("Error fetching house by ID:", error);
      throw new Error('Failed to get house'); // Correctly throw a new Error
   }
};