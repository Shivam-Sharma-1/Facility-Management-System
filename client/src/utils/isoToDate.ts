const isoToDate = (isoString: string): string =>
  new Date(isoString).toDateString();

export default isoToDate;
