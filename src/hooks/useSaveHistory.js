import { useState } from "react";

const useSaveHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveHistory = async (user, prompt, result) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://gfsl84i3p6.execute-api.us-east-1.amazonaws.com/stage/history",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            prompt: prompt,
            result: result,
            created_at: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      return false;
    }
  };

  return { saveHistory, isLoading, error };
};

export default useSaveHistory;
