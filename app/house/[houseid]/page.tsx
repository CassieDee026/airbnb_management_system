import { getHouseById } from "@/actions/getHouseByid";
import AddHouseForm from "@/components/house/AddHouseForm";
import { auth } from "@clerk/nextjs/server";


interface HousePageProps {
  params: {
    houseid: string;
  };
}

const House = async ({ params }: HousePageProps) => {
  const house = await getHouseById(params.houseid);
  const { userId } = await auth();

  if (!userId) return<div> Not authourized.......</div>

  if (house && house.userId !== userId) return <div>Access Denied......</div>

  return(<div>
    <AddHouseForm house={house}/>
  </div>);
}
export default House;