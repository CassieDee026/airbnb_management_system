import prismadb from "@/lib/prismadb"

 
export const getHouseById = async (houseId: string) => {
  try {
    const House = await prismadb.house.findUnique({
      where: {id: houseId},
        include: { rooms: true}
    });
    if (!House) return null;
    return House;
  } catch (error) {
    console.error("Error fetching House by id:",error);
    throw new Error('Failed to fetch House');
  }
};