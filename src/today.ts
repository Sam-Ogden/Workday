const today = new Date().toLocaleDateString("en-us");
export default today;

// Number of milliseconds from 1970 to start of today.
export const todayMS = new Date(today).getTime();
