import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { GOOGLE_CLIENT_ID } from "./config/oauth";
import { useAuth } from "./context/AuthContext";

const GoogleLoginComponent = () => {
  const { login } = useAuth();

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    login({
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    });
  };

  const handleError = () => {
    console.log("Error");
  };

  return (
    <div className="">
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          type="icon"
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
          useOneTap
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLoginComponent;
