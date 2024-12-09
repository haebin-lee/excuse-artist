import { useState } from "react";

const useAIImage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendPromptImage = async (prompt, reality) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://gfsl84i3p6.execute-api.us-east-1.amazonaws.com/stage/ai-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            excuse: prompt,
            vibe: reality,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data", data);
      return data.body;
      // const body = {
      //   url: "https://excuse-artist-bucket.s3.us-east-1.amazonaws.com/excuse-image-1733040286774.png",
      // };
      // return body;
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
    sendPromptImage,
    isLoading,
    error,
    resetError,
  };
};

export default useAIImage;
