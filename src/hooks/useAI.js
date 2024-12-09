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
      // return `Subject: Regarding My Upcoming Assignment Submission

      // Dear Professor Mario,

      // I hope this email finds you well. I am writing to inform you that, unfortunately, I will not be able to submit my assignment for tomorrow's deadline as initially planned.

      // Over the weekend, I encountered an unexpected technical issue with my computer, which has rendered it inoperable. I have been working diligently to resolve the problem, but it has proven to be more complex than initially anticipated. I have scheduled an appointment for professional IT support first thing in the morning and hope to have the issue resolved by the end of the day.

      // In addition to the technical hurdle, I have also faced some personal complications that have required my immediate attention. These unforeseen circumstances have consumed more time than I had anticipated, further delaying my ability to complete and submit the assignment.

      // I fully understand the importance of meeting deadlines and am committed to ensuring that my work is submitted as soon as possible. I will continue working on the assignment tonight and will have it ready for submission by the end of the day tomorrow. I will also make sure to review and follow any guidelines you have provided for late submissions to ensure that I am in compliance.

      // I apologize for any inconvenience this may cause and appreciate your understanding during this challenging period. If there is any additional information you need or if there are any specific requirements for late submissions, please let me know at your earliest convenience.

      // Thank you for your time and consideration.

      // Best regards,

      // Lucy`;
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
