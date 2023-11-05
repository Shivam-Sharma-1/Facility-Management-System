import Bookings from "../components/Bookings";
import Navigation from "../components/Navigation";

const BookingsPage = (): JSX.Element => {
  return (
    <div className="w-full h-full flex">
      <Navigation />
      <Bookings />
    </div>
  );
};

export default BookingsPage;
