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

      // Check if the user exists in Firestore by email
      const response = await fetch(`http://localhost:3001/api/users/email/${user.email}`);
      const responseData = await response.json();

      if (response.ok && responseData.exists) {
        console.log("API Response:", responseData); // Debugging line
        console.log("User role:", responseData.data.role); // Debugging line
      
        // Redirect existing users based on role
        if (responseData.data.role === "student") {
          navigate("/student-profile");
        } else if (responseData.data.role === "Super Admin" || responseData.data.role === "Support Staff") {
          navigate("/admin-profile");
        } else {
          console.error("Unknown role:", responseData.data.role);
        }
      } else {
        // New user: Store basic info and redirect to setup profile
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

        // Redirect new users to setup their profile
        navigate("/student-setup", {
          state: { uid: user.uid, email: user.email, fullName: user.displayName, photoURL: user.photoURL },
        });
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(https://i.imgur.com/ELy2bR1.jpeg)" }}
    >
      <div className="absolute inset-0 bg-white/75"></div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-amber-500 mb-4">WELCOME!</h1>
        <h2 className="text-2xl font-bold text-amber-500 mb-4">
          UST-SHS LOST AND FOUND
        </h2>
        <h2 className="text-xl text-stone-900 mb-4">
          To access the UST-SHS Lost and Found, please make sure you have a UST Google Workspace Account.
        </h2>
        <button
          onClick={signInWithGoogle}
          className="bg-blue-600 text-white flex items-center gap-2 py-2 px-4 rounded-4xl shadow-md hover:bg-blue-700 transition duration-300"
        >
          <img src="https://i.imgur.com/5YjiD4v.png" alt="Google Logo" className="w-5" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Home;
