import FacilityCard from "./FacilityCard";

const facilityData: FacilityData[] = [
  {
    name: "Gym",
    icon: "/vite.svg",
  },
  {
    name: "Food",
    icon: "/vite.svg",
  },
  {
    name: "Money",
    icon: "/vite.svg",
  },
  {
    name: "Trade",
    icon: "/vite.svg",
  },
  {
    name: "Hotel",
    icon: "/vite.svg",
  },
  {
    name: "Bro",
    icon: "/vite.svg",
  },
];

function Facilities(): JSX.Element {
  return (
    <div className="w-[80%] h-full flex flex-col items-center justify-center text-black px-6 pt-12">
      <h1 className="uppercase">FACILITIES</h1>
      <div className="w-full flex justify-center items-center flex-wrap pt-4">
        {facilityData.map((facility) => (
          <FacilityCard key={facility.name} name={facility.name} icon={facility.icon} />
        ))}
      </div>
    </div>
  );
}

export default Facilities;
