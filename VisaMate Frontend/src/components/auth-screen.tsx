// import { useState } from "react";
// import { Screen } from "../App";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { toast } from "sonner";
// import { LogIn, UserPlus } from "lucide-react";

// interface AuthScreenProps {
//   onNavigate: (screen: Screen) => void;
//   onLoginSuccess: () => void;
// }

// const API_BASE = "http://localhost:8000";

// export function AuthScreen({ onNavigate, onLoginSuccess }: AuthScreenProps) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email || !password || (!isLogin && !name)) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     setLoading(true);

//     try {
//       const endpoint = isLogin ? "/auth/login" : "/auth/signup";
//       const body = isLogin 
//         ? { email, password }
//         : { email, password, name };

//       const response = await fetch(`${API_BASE}${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         if (isLogin) {
//           localStorage.setItem("token", data.token);
//           localStorage.setItem("userEmail", email);
//           toast.success("Login successful!");
//           onLoginSuccess();
//           onNavigate("landing");
//         } else {
//           toast.success("Signup successful! Please login.");
//           setIsLogin(true);
//           setPassword("");
//         }
//       } else {
//         toast.error(data.detail || "Authentication failed");
//       }
//     } catch (error) {
//       console.error("Auth error:", error);
//       toast.error("Connection failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center py-12 px-4">
//       <Card className="max-w-md w-full p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
//         {/* Logo */}
//         <div className="flex justify-center mb-8">
//           <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
//             <span className="text-white font-bold text-2xl">VM</span>
//           </div>
//         </div>

//         {/* Title */}
//         <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
//           {isLogin ? "Welcome Back" : "Create Account"}
//         </h2>
//         <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
//           {isLogin ? "Sign in to continue to VisaMate" : "Join the VisaMate community"}
//         </p>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {!isLogin && (
//             <div>
//               <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
//                 Full Name
//               </Label>
//               <Input
//                 id="name"
//                 type="text"
//                 placeholder="John Doe"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="mt-1"
//               />
//             </div>
//           )}

//           <div>
//             <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
//               Email
//             </Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-1"
//             />
//           </div>

//           <div>
//             <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
//               Password
//             </Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="mt-1"
//             />
//           </div>

//           <Button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
//           >
//             {loading ? (
//               <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
//             ) : (
//               <>
//                 {isLogin ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
//                 {isLogin ? "Sign In" : "Sign Up"}
//               </>
//             )}
//           </Button>
//         </form>

//         {/* Toggle */}
//         <div className="mt-6 text-center">
//           <button
//             onClick={() => {
//               setIsLogin(!isLogin);
//               setPassword("");
//             }}
//             className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
//           >
//             {isLogin 
//               ? "Don't have an account? Sign up" 
//               : "Already have an account? Sign in"}
//           </button>
//         </div>

//         {/* Skip for now */}
//         <div className="mt-4 text-center">
//           <button
//             onClick={() => onNavigate("landing")}
//             className="text-sm text-slate-500 dark:text-slate-400 hover:underline"
//           >
//             Continue without login
//           </button>
//         </div>
//       </Card>
//     </div>
//   );
// }


// November 10, 2025
import { useState } from "react";
import { Screen } from "../App";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";

interface AuthScreenProps {
  onNavigate: (screen: Screen) => void;
  onLoginSuccess: () => void;
}

const API_BASE = "http://localhost:8000";

export function AuthScreen({ onNavigate, onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && !name)) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const body = isLogin 
        ? { email, password }
        : { email, password, name };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userEmail", email);
          toast.success("Login successful!");
          onLoginSuccess();
          onNavigate("landing");
        } else {
          toast.success("Signup successful! Please login.");
          setIsLogin(true);
          setPassword("");
        }
      } else {
        toast.error(data.detail || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">VM</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-[#6366F1] to-[#A855F7] bg-clip-text text-transparent">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          {isLogin ? "Sign in to continue to VisaMate" : "Join the VisaMate community"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                {isLogin ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                {isLogin ? "Sign In" : "Sign Up"}
              </>
            )}
          </Button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setPassword("");
            }}
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Skip for now */}
        <div className="mt-4 text-center">
          <button
            onClick={() => onNavigate("landing")}
            className="text-sm text-slate-500 dark:text-slate-400 hover:underline"
          >
            Continue without login
          </button>
        </div>
      </Card>
    </div>
  );
}