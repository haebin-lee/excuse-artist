import { useState } from "react";

const useGetHistory = (user, isAuthenticate) => {
  const [history, setHistory] = useState([]);

  const getHistory = async () => {
    if (isAuthenticate) {
      const response = await fetch(
        `https://gfsl84i3p6.execute-api.us-east-1.amazonaws.com/stage/history?email=${user.email}`
      );
      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        setHistory(responseData.data);
      }
    }
  };

  return [history, getHistory];
};

export default useGetHistory;
