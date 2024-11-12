import { getHouseById } from "@/actions/getHouseByid"; 
import AddHouseForm from "@/components/house/AddHouseForm"; 
import { auth } from '@clerk/nextjs/server';

interface HousePageProps {
    params: {
        houseid: string;
    };
}

const HouseComponent = async ({ params }: HousePageProps) => {
    const house = await getHouseById(params.houseid); // Fetch the house data
    const { userId } = await auth(); // Await the auth() call to get the userId

    if (!userId) return <div>Not authenticated....</div>;
    if (house && house.userId !== userId) return <div>Access Denied</div>; 

    return (
        <div>
            <AddHouseForm house={house}/>
        </div>
    );
};

export default HouseComponent;