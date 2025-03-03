import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await fetch(`http://localhost:3001/api/users/email/${user.email}`);
      const responseData = await response.json();

      if (response.ok && responseData.exists) {
        if (responseData.data.role === "student") {
          navigate("/student-profile");
        } else if (responseData.data.role === "Super Admin" || responseData.data.role === "Support Staff") {
          navigate("/admin-profile");
        } else {
          console.error("Unknown role:", responseData.data.role);
        }
      } else {
        await fetch("http://localhost:3001/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            fullName: user.displayName,
            photoURL: user.photoURL,
          }),
        });

        navigate("/student-setup", {
          state: { uid: user.uid, email: user.email, fullName: user.displayName, photoURL: user.photoURL },
        });
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative px-6 py-12" style={{ backgroundImage: "url(https://i.imgur.com/ELy2bR1.jpeg)" }}>
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative z-10 bg-white/90 shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-amber-500 mb-2">WELCOME!</h1>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">UST-SHS LOST AND FOUND</h2>
        <p className="text-gray-600 text-sm mb-6">To access the UST-SHS Lost and Found, please use your UST Google Workspace Account.</p>
        
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          <img src="https://i.imgur.com/5YjiD4v.png" alt="Google Logo" className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Home;