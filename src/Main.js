import { useEffect, useState } from "react";
import { Mistral } from "@mistralai/mistralai";

function Main() {
  const [history, setHistory] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [whom, setWhom] = useState("");
  const [reality, setReality] = useState("realistic");
  const [form, setForm] = useState("short");
  const client = new Mistral({ apiKey: process.env.REACT_APP_MISTRAL_API_KEY });

  // useEffect(() => {
  //   const getHistory = async () => {
  //     const response = await fetch(
  //       "https://gfsl84i3p6.execute-api.us-east-1.amazonaws.com/stage/history?email=hblee8080@gmail.com"
  //     );
  //     if (response.ok) {
  //       const responseData = await response.json();
  //       setHistory(responseData.data);
  //     }
  //   };
  //   getHistory();
  // }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!prompt) {
      return;
    }

    try {
      const fullPrompt = process.env.REACT_APP_PROMPT?.replace("{whom}", whom)
        .replace("{form}", getFormPrompt(form))
        .replace("{situation}", prompt)
        .replace("{reality}", realityTemplate[reality].instruction)
        .replace("{guideline", realityTemplate[reality].guideline);
      console.log("fullPrompt", fullPrompt);

      const chatResponse = await client.chat.complete({
        model: "pixtral-12b-2409",
        messages: [{ role: "user", content: fullPrompt }],
      });
      const responseData = chatResponse.choices[0].message.content;
      console.log("responseData", responseData);
      setResult(responseData);
    } catch (error) {
      console.error(error);
      setResult("Sorry, I couldn't understand that. Please try again.");
    }
  };

  const handleSpeak = () => {
    if (!result) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(result);
    utterance.lang = "en-US";
    utterance.onend = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const getFormPrompt = (form) => {
    return form === "short"
      ? "A short message that can be sent via text or chat"
      : "A longer email message that can be sent to a professor or boss";
  };
  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="flex flex-col h-full max-w-4xl mx-auto p-6">
        <h1 className="flex justify-center font-bold">
          What's your problem today?
        </h1>
        <div className="mb-6 min-h-4xl">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
              {result}
            </p>
            <div className="flex gap-4 justify-end m-1">
              <button onClick={handleSpeak}>
                {isPlaying ? "Stop" : "Speak"}
              </button>
              <button>Copy</button>
              <button>mail</button>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 mb-2">
          <div className="flex flex-1 items-center">
            <p className="mr-2 font-medium">To: </p>
            <input
              placeholder=""
              className="w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              onChange={(e) => setWhom(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => setReality("realistic")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all ${
              reality === "realistic"
                ? "bg-purple-500 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            plausible
          </button>

          <button
            type="button"
            onClick={() => setReality("unrealistic")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all ${
              reality === "unrealistic"
                ? "bg-purple-500 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            imaginary
          </button>

          <button
            type="button"
            onClick={() => setForm("short")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all ${
              form === "short"
                ? "bg-orange-500 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            short message
          </button>

          <button
            type="button"
            onClick={() => setForm("email")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all ${
              form === "email"
                ? "bg-orange-500 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            email
          </button>
        </div>

        <div className="w-full">
          <form onSubmit={sendMessage}>
            <textarea
              placeholder="Tell me your situation..."
              rows={4}
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mb-4 resize-y min-h-[100px] max-h-[400px]"
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl text-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>

        {/* History */}
        <details className="mt-4">
          <summary className="flex items-center justify-between w-full px-6 py-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
            <span className="font-medium">
              Previous Excuses ({history && history.length})
            </span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <div className="mt-4 space-y-4 overflow-y-auto min-h-[200px]">
            {history.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                    <span>Excuse #{index}</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                  <div className="border-l-4 border-blue-200 pl-4 mb-3">
                    <p className="text-gray-600 italic">{item.prompt}</p>
                  </div>
                  <p className="text-gray-800">{item.result}</p>
                </div>
              );
            })}
          </div>
        </details>
      </div>
    </div>
  );
}

const template = {
  short: {},
  email: {},
};

const realityTemplate = {
  realistic: {
    instruction:
      "A professional, believable excuse appropriate for academic context",
    guideline:
      "-Base on common real-world situations\n- Include specific, verifiable details\n- Maintain professional tone\n- Focus on solutions and next steps\n",
  },
  unrealistic: {
    instruction: "A creative, humorous excuse that maintains respectful tone",
    guideline:
      " -Craft extraordinary scenarios\n- Include elements of fantasy/sci-fi\n- Keep humor appropriate\n- Maintain underlying respectfulness\n",
  },
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

export default Main;
