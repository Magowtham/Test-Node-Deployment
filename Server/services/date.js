const currentDateTime = () => {
  const now = new Date();
  const currentTime = `${(now.getHours() % 12 || 12)
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} ${
    now.getHours() >= 12 ? "PM" : "AM"
  }`;
  const currentDate = `${now.getDate().toString().padStart(2, "0")}-${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${now.getFullYear()}`;
  return { currentTime, currentDate };
};
module.exports = currentDateTime;
