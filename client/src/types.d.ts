// --------INTERFACES--------

interface FacilityCardProps {
  name: string;
  icon: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  bookingsData: BookingDataProps;
}

interface EventModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  eventInfo: EventInfoProps;
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
  start: string | null;
  end: string | null;
  color: string;
  requestedBy: {
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

interface EventInfoProps {
  title: string;
  purpose: string;
  start: string;
  end: string;
  date: string;
  requestBy: string;
}

// ----------TYPES-----------

type FacilityData = {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
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
