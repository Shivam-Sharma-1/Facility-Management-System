// --------INTERFACES--------

interface FacilityCardProps {
  name: string;
  icon: string;
}

// ----------TYPES-----------

type FacilityData = {
  name: string;
  icon: string;
};

type NavigationData = {
  label: string;
  icon: ReactNode;
  key: string;
};
