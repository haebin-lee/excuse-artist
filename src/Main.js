import { Copy, History, Mail, MessageCircle, Volume2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PacmanLoader } from "react-spinners";
import GoogleLoginComponent from "./GoogleLogin";
import { useAuth } from "./context/AuthContext";
import useAI from "./hooks/useAI";
import useSaveHistory from "./hooks/useSaveHistory";
import useGetHistory from "./hooks/useGetHistory";
import useAIImage from "./hooks/useAIImage";

function Main() {
  const { user, logout, isAuthenticate } = useAuth();
  const [showHistory, setShowHistory] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [whom, setWhom] = useState("");
  const [reality, setReality] = useState("realistic");
  const [form, setForm] = useState("short");
  const { saveHistory } = useSaveHistory();
  const { sendPrompt, isLoading } = useAI();
  const { sendPromptImage, isLoading: isLoadingImage } = useAIImage();
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleShowImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const [history, getHistory] = useGetHistory(user, isAuthenticate);
  useEffect(() => {
    getHistory();
  }, [isAuthenticate, user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const response = await sendPrompt(prompt, whom, form, reality, history);
    setResult(response);

    const imageResponse = await sendPromptImage(prompt, reality);
    setResultImage(imageResponse.url);
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

  const handleSaveHistory = async (event) => {
    event.preventDefault();
    await saveHistory(user, prompt, result, resultImage);
    getHistory();
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    handleClear(e);
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

  const handleClear = async (e) => {
    e.preventDefault();

    setPrompt("");
    setWhom("");
    setResult("");
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #ffffff, #B3C9CF)",
      }}
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-col max-w-4xl w-full p-6">
          <div className="relative">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Excuse Smith
              </h1>
              <p className="text-gray-600">
                Professional Excuse Craftsman for all your needs
              </p>
            </div>

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
              result && (
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
              )
            )}
          </div>
          <div className="mb-6 min-h-4xl">
            {isLoadingImage ? (
              <div className="flex justify-center items-center h-48">
                <PacmanLoader color="#3B82F6" size={25} margin={2} />
              </div>
            ) : (
              resultImage && (
                <div className="max-w-3xl mx-auto">
                  <img
                    src={resultImage}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              )
            )}
          </div>
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
                    onClick={handleSaveHistory}
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
          {/* Previous Excuses */}
          {isAuthenticate && (
            <div className="mt-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center justify-between w-full px-6 py-3 bg-white rounded-lg shadow-sm hover:bg-gray-50"
              >
                <span className="font-medium">
                  Previous Excuses ({history && history.length})
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    showHistory ? "rotate-180" : ""
                  }`}
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
              </button>

              {showHistory && (
                <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                  {history.map((item, index) => (
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
                      {item.s3url && (
                        <button
                          onClick={() => handleShowImage(item.s3url)}
                          className="mt-3 flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <svg
                            className="w-5 h-5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          View Image
                        </button>
                      )}
                      {/* 이미지 모달 컴포넌트 추가 */}
                      {showModal && selectedImage && (
                        <ImageModal
                          imageUrl={selectedImage}
                          onClose={() => setShowModal(false)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

// 이미지 모달 컴포넌트
const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-2xl w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="p-4">
          <img
            src={imageUrl}
            alt="Excuse visualization"
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
