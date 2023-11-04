// --------INTERFACES--------

interface FacilityCardProps {
  name: string;
  icon: string;
  manager: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setOpenSnackbar: (isOpen: boolean) => void;
  setDefaultDate: (message: string | null) => void;
  bookingsData: BookingDataProps[];
  defaultDate: string | null;
}

interface EventModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  eventInfo: EventInfoProps;
}

interface EventContentProps {
  event: {
    extendedProps: {
      slug: string;
    };
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
  date: Dayjs | null;
  start: string | null;
  end: string | null;
  employeeId: string;
  slug: string;
}

interface User {
  name: string;
  employeeId: number;
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

interface RequireAuthProps {
  children: ReactNode;
  GD: boolean;
  FM: boolean;
}

interface EventInfoProps {
  title: string;
  purpose: string;
  start: string;
  end: string;
  date: string;
  requestBy: string;
}

interface ApprovalProps {
  title: string;
  purpose: string;
  slug: string;
  date: string;
  start: string;
  end: string;
  facility: string;
  requestedBy: string;
  approvedAtGD: string | null;
  approvedAtFM: string | null;
  approvedAtAdmin: string | null;
}

interface ApprovalStatusProps {
  GD: boolean;
  FM: boolean;
}

// ----------TYPES-----------

type FacilityData = {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  facilityManager: FacilityManager[];
};

type FacilityManager = {
  user: {
    name: string;
    employeeId: number;
  };
};

type DashboardData = {
  count: number;
  facilities: FacilityData[];
};

type LoginData = {
  employeeId: string;
  password: string;
};

type ApprovalData = {
  id: number;
  title: string;
  slug: string;
  purpose: string;
  color: string;
  userId: number;
  status: string;
  createdAt: string;
  date: string;
  start: string;
  end: string;
  facility: {
    name: string;
  };
  facilityId: number;
  approvedAtGD: string | null;
  approvedAtFM: string | null;
  approvedAtAdmin: string | null;
  requestedBy: {
    name: string;
  };
};

type ApprovalType = {
  slug: string;
  approved: boolean;
};
