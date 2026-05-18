import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const formatTime = (utcDate: Date | string, format = "hh:mm A") => {
  if (!utcDate) return "";
  return dayjs.utc(utcDate).local().format(format);
};


