import { useState } from "react";

const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendPrompt = async (prompt, whom, form, reality, history) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://gfsl84i3p6.execute-api.us-east-1.amazonaws.com/stage/ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            whom,
            form,
            reality,
            history,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.message || "An error occurred while processing your request"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    sendPrompt,
    isLoading,
    error,
    resetError,
  };
};

export default useAI;
