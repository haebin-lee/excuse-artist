import { useEffect, useState } from "react";
import { Mistral } from "@mistralai/mistralai";
import GoogleLoginComponent from "./GoogleLogin";
import { useAuth } from "./context/AuthContext";
import { Copy, History, Mail, MessageCircle, Volume2, X } from "lucide-react";
import toast from "react-hot-toast";
import { PacmanLoader } from "react-spinners";

function Main() {
  const { user, logout, isAuthenticate } = useAuth();
  const [history, setHistory] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [whom, setWhom] = useState("");
  const [reality, setReality] = useState("realistic");
  const [form, setForm] = useState("short");
  const client = new Mistral({ apiKey: process.env.REACT_APP_MISTRAL_API_KEY });

  useEffect(() => {
    getHistory();
  }, [isAuthenticate, user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!prompt) {
      return;
    }

    try {
      const fullPrompt = process.env.REACT_APP_PROMPT?.replace("{whom}", whom)
        .replace("{form}", getFormPrompt(form))
        .replace("{situation}", prompt)
        .replace("{reality}", realityTemplate[reality].instruction)
        .replace("{guideline", realityTemplate[reality].guideline)
        .replace("{history}", JSON.stringify(history));
      // console.log("fullPrompt", fullPrompt);

      const chatResponse = await client.chat.complete({
        model: "pixtral-12b-2409",
        messages: [{ role: "user", content: fullPrompt }],
      });
      const responseData = chatResponse.choices[0].message.content;
      // console.log("responseData", responseData);
      setResult(responseData);
      setIsLoading(false);
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
  const saveHistory = async (event) => {
    event.preventDefault();
    // console.log("prompt", prompt, "result", result);

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
    if (response.ok) {
      getHistory();
      handleClear(event);
    }
  };

  const getHistory = async () => {
    if (isAuthenticate) {
      const response = await fetch(
        `https://gfsl84i3p6.execute-api.us-east-1.amazonaws.com/stage/history?email=${user.email}`
      );
      if (response.ok) {
        const responseData = await response.json();
        setHistory(responseData.data);
      }
    }
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
  };

  const handleCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Successfully copied !", {
        duration: 3000,
        position: "top-center",
        icon: "👏",
      });
    } catch (err) {
      console.error("Fail to copy:", err);
    }
  };

  const handleEmailShare = async (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:?&body=${encodeURIComponent(result)}`;
    window.location.href = mailtoLink;
  };

  const getFormPrompt = (form) => {
    return form === "short"
      ? "A short, punchy message that can be sent via text or chat"
      : "A longer, more elaborate email message";
  };

  const handleClear = async (e) => {
    e.preventDefault();

    setPrompt("");
    setWhom("");
    setResult("");
  };
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="flex flex-col h-full max-w-4xl mx-auto p-6">
        <div className="relative">
          {/* Title Section - Centered */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Excuse Smith
            </h1>
            <p className="text-gray-600">
              Professional Excuse Craftsman at Your Service
            </p>
          </div>

          {/* Auth Section - Absolutely positioned to the right top */}
          <div className="absolute top-0 right-0">
            {!isAuthenticate && <GoogleLoginComponent />}
            {isAuthenticate && (
              <div className="flex items-center gap-2 p-1">
                <p className="text-sm text-gray-600">{user.name}</p>
                <button
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all bg-red-50 text-red-600 hover:bg-red-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mb-6 min-h-4xl">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <PacmanLoader color="#3B82F6" size={25} margin={2} />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                  {result}
                </p>
              </div>
              <div className="px-6 py-3 bg-gray-50 flex justify-end items-center gap-2 border-t border-gray-100">
                <button
                  onClick={handleSpeak}
                  className={`p-2 rounded-full transition-all ${
                    isPlaying
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  title={isPlaying ? "Stop Speaking" : "Listen"}
                >
                  <Volume2 size={20} />
                </button>

                <button
                  onClick={handleCopy}
                  className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-all"
                  title="Copy to Clipboard"
                >
                  <Copy size={20} />
                </button>

                <button
                  onClick={handleEmailShare}
                  className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-all"
                  title="Share via Email"
                >
                  <Mail size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
        {/* <div className="mb-6 min-h-4xl">
          <div className="bg-white rounded-xl shadow-sm p-3">
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap p-3">
              {result}
            </p>
            <div className="flex gap-2 justify-end items-end">
              <button onClick={handleSpeak}>
                {isPlaying ? "stop" : "speak"}
              </button>
              <button onClick={handleCopy}>copy</button>
              <button onClick={handleEmailShare}>mail</button>
            </div>
          </div>
        </div> */}

        <div className="flex items-start gap-4 mb-2">
          <div className="flex flex-1 items-center">
            <p className="mr-2 font-medium">To: </p>
            <input
              placeholder=""
              className="w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              onChange={(e) => setWhom(e.target.value)}
              value={whom}
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
            creative
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
            quick message
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
            formal email
          </button>
        </div>

        <div className="w-full">
          <form onSubmit={sendMessage}>
            <textarea
              placeholder="Tell me your situation. I promise to keep your secret safe"
              rows={4}
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mb-4 resize-y min-h-[100px] max-h-[400px]"
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex justify-center items-center gap-1 w-full bg-blue-500 text-white py-2 px-4 rounded-xl text-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <MessageCircle size={20} />
                Craft My Excuse
              </button>
              {isAuthenticate && result && (
                <button
                  type="button"
                  onClick={saveHistory}
                  className="flex justify-center items-center gap-1 w-full bg-emerald-500 text-white py-2 px-4 rounded-xl text-lg font-medium hover:bg-emerald-600 transition-colors"
                >
                  <History size={20} />
                  Save History
                </button>
              )}

              <button
                type="button"
                className="flex-1 flex justify-center items-center gap-1 bg-gray-500 text-white py-2 px-2 rounded-xl text-lg font-medium hover:bg-gray-600 transition-colors"
                onClick={handleClear}
              >
                <X size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* History */}
        {isAuthenticate && (
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
        )}
      </div>
    </div>
  );
}
const realityTemplate = {
  realistic: {
    instruction:
      "A professional, believable excuse appropriate for academic context",
    guideline:
      "-Base on common real-world situations\n- Include specific, verifiable details\n- Maintain professional tone\n- Focus on solutions and next steps\n",
  },
  unrealistic: {
    instruction:
      "An extremely humorous excuse based on unlikely but theoretically possible situations",
    guideline:
      " -Craft scenarios that are highly improbable but not impossible\n- Exaggerate common mishaps or coincidences to absurd levels\n- Use playful, over-the-top humor\n- Include funny, relatable details that push the boundaries of believability\n- Sprinkle emojis throughout for added fun\n- Maintain an underlying tone of respect\n",
  },
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

export default Main;
