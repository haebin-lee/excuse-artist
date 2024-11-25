import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import MainPage from "./Main";

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <MainPage />
    </AuthProvider>
  );
}

export default App;
