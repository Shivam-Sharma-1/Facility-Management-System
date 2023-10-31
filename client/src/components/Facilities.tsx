import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import FacilityCard from "./FacilityCard";

function Facilities(): JSX.Element {
  const { data, isPending } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await axios.get<FacilityData[]>(
        "http://localhost:3000/dashboard",
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
  });
  console.log(data);

  return (
    <div className="w-[80%] h-full flex flex-col items-center justify-center text-black px-6 pt-12">
      <h1 className="uppercase">FACILITIES</h1>
      <div className="w-full flex justify-center items-center flex-wrap pt-4">
        {!isPending &&
          data?.map((facility: FacilityData) => (
            <FacilityCard
              key={facility.name}
              name={facility.name}
              icon={facility.icon}
            />
          ))}
      </div>
    </div>
  );
}

export default Facilities;
