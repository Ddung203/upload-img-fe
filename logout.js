function checkAndClearLocalStorage(inactivityTime, dataKey) {
  let lastActivityTime = new Date().getTime();
  let intervalID;

  function resetTime() {
    lastActivityTime = new Date().getTime();
  }

  // Call resetTime function on user activity
  document.addEventListener("mousemove", resetTime);
  document.addEventListener("keypress", resetTime);
  document.addEventListener("scroll", resetTime);
  document.addEventListener("click", resetTime);

  // Set interval to check inactivity time
  intervalID = setInterval(function () {
    const currentTime = new Date().getTime();
    const inactiveTime = currentTime - lastActivityTime;

    if (inactiveTime > inactivityTime) {
      localStorage.removeItem(dataKey);

      // Display a message or perform other actions if needed
      console.log(
        `Data for key ${dataKey} has been cleared due to inactivity after ${
          inactivityTime / 1000
        } seconds.`
      );

      // Stop checking inactivity time by clearing the interval
      clearInterval(intervalID);
    }
  }, 3000);
}
// checkAndClearLocalStorage(3600000, "your_data_key");
checkAndClearLocalStorage(3600000, "username");
checkAndClearLocalStorage(3600000, "status");
checkAndClearLocalStorage(3600000, "token");
