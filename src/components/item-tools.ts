const getDates = (date: string, time: string) => {
  const slashRemoved = date.replaceAll("/", "");
  const yyyyMMdd = slashRemoved.substring(0, slashRemoved.indexOf("("));

  const hhmm = time.replace(":", "");

  return `${yyyyMMdd}T${hhmm}00/${yyyyMMdd}T${hhmm}00`;
};

export default getDates;
