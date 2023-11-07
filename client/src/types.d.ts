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
  bookingsData: BookingNewDataProps[];
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
  id: string;
  title: string;
  slug: string;
  purpose: string;
  status: string;
  createdAt: string;
  facilityManager: string | null;
  statusUpdateAtGD: string | null;
  statusUpdateAtFM: string | null;
  statusUpdateAtAdmin: string | null;
  statusUpdateByGD: {
    user: {
      name: string;
      employeeId: number;
    };
  } | null;
  statusUpdateByFM: {
    user: {
      name: string;
      employeeId: number;
    };
  } | null;
  time: {
    start: string;
    end: string;
    date: string;
  };
  requestedBy: {
    name: string;
    employeeId: number;
  };
  facility: {
    name: string;
    slug: string;
  };
}

interface BookingNewDataProps {
  id: string;
  title: string;
  slug: string;
  purpose: string;
  status: string;
  createdAt: string;
  facilityManager: string | null;
  statusUpdateAtGD: string | null;
  statusUpdateAtFM: string | null;
  statusUpdateAtAdmin: string | null;
  statusUpdateByGD: {
    user: {
      name: string;
      employeeId: number;
    };
  } | null;
  statusUpdateByFM: {
    user: {
      name: string;
      employeeId: number;
    };
  } | null;
  start: string;
  end: string;
  date: string;
  requestedBy: {
    name: string;
    employeeId: number;
  };
  facility: {
    name: string;
    slug: string;
  };
}

interface AddEventDataProps {
  title: string;
  purpose: string;
  date: Dayjs | null;
  start: string | null;
  end: string | null;
  employeeId: number | null;
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
  Admin?: boolean;
}

interface EventInfoProps {
  title: string;
  purpose: string;
  status: string;
  start: string;
  end: string;
  date: string;
  requestBy: string;
  statusUpdateByGD: string | null;
  statusUpdateByFM: string | null;
}

interface ApprovalProps {
  title: string;
  purpose: string;
  slug: string;
  date: string;
  start: string;
  end: string;
  facility: string;
  requestedBy: string | null;
  approvedByGD: string | null;
}

interface MyBookingCardProps {
  title: string;
  purpose: string;
  status: string;
  remark: string;
  date: string;
  start: string;
  end: string;
  facility: string;
  requestedBy: string | null;
  approvedByGD: string | null;
  approvedByFM: string | null;
}

interface ApprovalStatusProps {
  GD: boolean;
  FM: boolean;
}

interface FilterOptionProps {
  label: string;
}

interface AdminBookingsColumnData {
  id:
    | "title"
    | "purpose"
    | "date"
    | "time"
    | "createdAt"
    | "status"
    | "reqBy"
    | "actions"
    | "gd"
    | "fm";
  label: string;
  minWidth?: number;
}

interface AdminBookingsTableProps {
  bookingsData: ApprovalData[];
}

interface AdminFacilitiesTableProps {
  facilitiesData: FacilityData[];
}

interface AdminBookingsRowData {
  title: JSX.Element;
  purpose: string;
  date: string;
  time: string;
  createdAt: JSX.Element;
  reqBy: string;
  status: string;
  actions: string | JSX.Element;
  gd: JSX.Element | null;
  fm: JSX.Element | null;
}

interface AdminFacilitiesColumnData {
  id:
    | "name"
    | "description"
    | "status"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
    | "actions"
    | "fm";
  label: string;
  minWidth?: number;
}

interface AdminFacilitiesRowData {
  name: string;
  description: string;
  status: string;
  createdAt: JSX.Element;
  updatedAt: JSX.Element;
  deletedAt: JSX.Element;
  actions: string | JSX.Element;
  fm: JSX.Element | null;
}

interface AddFacilityDataProps {
  name: string;
  description: string;
  icon: string;
  FMId: string | number | null;
}

interface AddFacilityModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface EditFacilityModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setOpenSnackbar: (isOpen: boolean) => void;
  facilityData: FacilityData;
}

// ----------TYPES-----------

type FacilityData = {
  id: string;
  name: string;
  description: string;
  status?: string;
  icon: string;
  slug: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  facilityManager: FacilityManager;
};

type FacilityManager = {
  user: {
    name: string;
    employeeId: number | null;
  };
};

type DashboardData = {
  count: number;
  facilities: FacilityData[];
};

type LoginData = {
  employeeId: number | null;
  password: string;
};

type ApprovalData = {
  id: number;
  title: string;
  slug: string;
  purpose: string;
  remark: string;
  userId: number;
  status: string;
  createdAt: string;
  time: {
    date: string;
    start: string;
    end: string;
  };
  facility: {
    name: string;
  };
  facilityId: number;
  statusUpdateAtGD: string | null;
  statusUpdateAtFM: string | null;
  statusUpdateAtAdmin: string | null;
  statusUpdateByGD: null | {
    user: {
      name: string;
    };
  };
  statusUpdateByFM: null | {
    user: {
      name: string;
    };
  };
  requestedBy: {
    name: string;
  };
};

type ApprovalType = {
  slug: string;
  approved: boolean;
  remark?: string;
};

type BookingCardData = {
  facility: {
    bookings: ApprovalData[];
  };
};

type AdminBookingsData = {
  facilities: FacilityData[];
  bookings: ApprovalData[];
};

type AdminFacilitiesSubmitData = {
  name: string;
  description: string;
  icon: string;
  slug: string;
  facilityManagerId: number | null;
};

type AdminFacilitiesEditData = {
  name: string;
  description: string;
  icon: string;
  slug: string;
  prevFacilityManagerId: number | null;
  newFacilityManagerId: number | null;
};
