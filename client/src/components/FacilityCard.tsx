function FacilityCard({ name, icon }: FacilityCardProps): JSX.Element {
  return (
    <div className="min-w-[200px] gap-4 m-6 p-10 border-0 border-b-4 border-solid border-primary flex flex-col justify-center items-center shadow-card cursor-pointer rounded-md hover:-translate-y-1 hover:shadow-cardHover">
      <img src={icon} alt={`${name}-icon`} className="w-[50px] h-[50px]" />
      <h3 className="text-primary font-normal">{name}</h3>
    </div>
  );
}

export default FacilityCard;
