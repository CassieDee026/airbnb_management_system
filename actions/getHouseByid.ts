import prismadb from "@/lib/prismadb";

export const getHouseById = async (houseid: string | null | undefined) => {
  if (!houseid) {
    throw new Error('The "houseid" argument must be provided and cannot be null or undefined.');
  }

  try {
    const house = await prismadb.house.findUnique({
      where: { id: houseid },
      include: { rooms: true },
    });

    if (!house) {
      throw new Error(`House with id ${houseid} not found.`);
    }

    return house;
  } catch (error) {
    console.error("Error fetching house by ID:", error);
    throw new Error('Failed to get house');
  }
};