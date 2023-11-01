import dayjs from "dayjs";

const isoToTime = (isoString: string): string =>
  dayjs(isoString).format("hh:mm A");

export default isoToTime;
