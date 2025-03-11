/**
 * Utility function to format dates according to specified options.
 */

const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    month: "numeric",
    day: "numeric",
  }
) => {
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export default formatDate;
