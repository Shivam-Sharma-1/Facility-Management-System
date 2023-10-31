// --------INTERFACES--------

interface FacilityCardProps {
  name: string;
  icon: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface EventContentProps {
  backgroundColor: string;
  event: {
    title: string;
  };
}

interface BookingDataProps {
  title: string;
  purpose: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  color: string;
  requested_by: {
    name: string;
    employeeId: string;
  };
  createdAt: string;
  facilityId: number;
  id: string;
  slug: string;
  status: string;
  userId: number;
}

interface AddEventDataProps {
  title: string;
  purpose: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  color: string;
  employeeId: string;
  slug: string;
}

interface User {
  name: string;
  employeeId: string;
  image: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (newUser: User) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
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
  onClick: () => void;
};

type LoginData = {
  employeeId: string;
  password: string;
};
