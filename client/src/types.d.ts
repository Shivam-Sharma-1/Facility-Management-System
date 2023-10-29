// --------INTERFACES--------

interface FacilityCardProps {
  name: string;
  icon: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
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
