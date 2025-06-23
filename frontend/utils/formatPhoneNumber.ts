//convert phone number to use +254
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  // If already starts with +254, return as is
  if (phone.startsWith("+254")) return phone;
  // If starts with 0 and is 10 digits, replace 0 with +254
  if (phone.startsWith("0") && phone.length === 10) {
    return "+254" + phone.slice(1);
  }
  // Otherwise, return as is
  return phone;
};