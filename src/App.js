import { useEffect, useState } from "react";
import { Mistral } from "@mistralai/mistralai";
import MainPage from "./Main";

function App() {
  // const [history, setHistory] = useState([]);
  // const [prompt, setPrompt] = useState("");
  // const [result, setResult] = useState("");

  // const client = new Mistral({ apiKey: process.env.REACT_APP_MISTRAL_API_KEY });
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const prompt = event.target[0].value;
  //   const result = event.target[1].value;
  //   console.log("prompt", prompt, "result", result);
  //   const response = await fetch(
  //     "https://gfsl84i3p6.execute-api.us-east-1.amazonaws.com/stage/history",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: "hblee8080@gmail.com",
  //         prompt: prompt,
  //         result: result,
  //         created_at: new Date().toISOString(),
  //       }),
  //     }
  //   );
  //   if (response.ok) {
  //     console.log("success");
  //   }
  // };

  // const sendMessage = async (e) => {
  //   e.preventDefault();

  //   if (!prompt) {
  //     return;
  //   }

  //   const chatResponse = await client.chat.complete({
  //     model: "pixtral-12b-2409",
  //     messages: [{ role: "user", content: prompt }],
  //   });
  //   console.log(chatResponse);
  //   setResult(chatResponse.choices[0].message.content);
  // };

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

  return (
    <MainPage />
    // <div>
    //   <h1>History</h1>
    //   <form onSubmit={handleSubmit}>
    //     <input type="text" placeholder="Enter a prompt" />
    //     <input type="text" placeholder="Enter a result" />
    //     <button type="submit">Submit</button>
    //   </form>
    //   <ul>
    //     {history.map((item) => (
    //       <li key={item.id}>
    //         {item.id} - {item.prompt} - {item.result} - {item.created_at}
    //       </li>
    //     ))}
    //   </ul>

    //   <div>
    //     <form onSubmit={sendMessage} className="flex gap-2">
    //       <input
    //         type="textArea"
    //         placeholder="Enter your Request"
    //         onChange={(e) => setPrompt(e.target.value)}
    //       ></input>
    //       <button>Submit</button>
    //     </form>
    //     <p>{prompt}</p>
    //     <p>Result</p>
    //     <p>{result}</p>
    //   </div>
    // </div>
  );
}

export default App;
