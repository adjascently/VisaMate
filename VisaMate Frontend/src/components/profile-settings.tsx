// Nov 21, 2025
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Card } from "./ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// import { Alert, AlertDescription } from "./ui/alert";
// import { User, Palette, Trash2 } from "lucide-react";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";

// interface ProfileSettingsProps {
//   theme: "light" | "dark";
//   onThemeChange: (theme: "light" | "dark" | "auto") => void;
// }

// const API_BASE = "http://localhost:8000";

// export function ProfileSettings({ theme, onThemeChange }: ProfileSettingsProps) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [visaStage, setVisaStage] = useState("UNKNOWN");
//   const [loading, setLoading] = useState(true);
//   const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "auto">(theme === "dark" ? "dark" : "light");
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   // Fetch user profile on mount
//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
      
//       // Debug logging
//       console.log("Fetching profile...");
//       console.log("Token exists:", !!token);
//       console.log("Token length:", token?.length);
      
//       if (!token) {
//         console.error("No token found in localStorage");
//         toast.error("Please login to view profile");
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`${API_BASE}/users/profile`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       console.log("Profile response status:", response.status);

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Profile data:", data);
//         setName(data.name || "");
//         setEmail(data.email || "");
//         setVisaStage(data.visa_stage || "UNKNOWN");
//       } else {
//         const errorText = await response.text();
//         console.error("Profile fetch error:", response.status, errorText);
        
//         if (response.status === 401) {
//           toast.error("Session expired. Please login again.");
//           localStorage.removeItem("token");
//         } else {
//           toast.error("Failed to load profile");
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       toast.error("Failed to load profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("token");
      
//       if (!token) {
//         toast.error("Please login first");
//         return;
//       }

//       const response = await fetch(`${API_BASE}/users/profile`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           name,
//           visa_stage: visaStage
//         })
//       });

//       if (response.ok) {
//         toast.success("Profile updated successfully");
//       } else {
//         const error = await response.json();
//         toast.error(error.detail || "Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("Failed to update profile");
//     }
//   };

//   const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
//     setSelectedTheme(newTheme);
//     if (newTheme === "auto") {
//       onThemeChange("light");
//     } else {
//       onThemeChange(newTheme);
//     }
//     toast.success(`Theme switched to ${newTheme === "light" ? "Light" : newTheme === "dark" ? "Dark" : "Auto"}`);
//   };

//   const handleDeleteAccount = async () => {
//     try {
//       const token = localStorage.getItem("token");
      
//       if (!token) {
//         toast.error("Please login first");
//         return;
//       }

//       const response = await fetch(`${API_BASE}/users/account`, {
//         method: "DELETE",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         toast.success("Account deleted successfully");
//         localStorage.removeItem("token");
//         localStorage.removeItem("userEmail");
//         // Redirect to landing or login
//         window.location.href = "/";
//       } else {
//         toast.error("Failed to delete account");
//       }
//     } catch (error) {
//       console.error("Error deleting account:", error);
//       toast.error("Failed to delete account");
//     }
//     setShowDeleteConfirm(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] flex items-center justify-center">
//         <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors">
//       <div className="max-w-4xl mx-auto p-6">
//         {/* Header */}
//         <div className="mb-8">
//           <h2 className="mb-2 text-slate-900 dark:text-gray-100 text-3xl font-bold">Profile & Settings</h2>
//           <p className="text-slate-600 dark:text-gray-400">
//             Manage your account, preferences, and notifications.
//           </p>
//         </div>

//         <div className="space-y-6">
//           {/* Personal Information */}
//           <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
//                 <User className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="text-slate-900 dark:text-gray-100 text-lg font-semibold">Personal Information</h3>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="name" className="text-slate-700 dark:text-gray-300">Full Name</Label>
//                 <Input
//                   id="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="mt-2 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-100"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="email" className="text-slate-700 dark:text-gray-300">Email Address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   disabled
//                   className="mt-2 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-gray-500 cursor-not-allowed"
//                 />
//                 <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">Email cannot be changed</p>
//               </div>

//               <div>
//                 <Label htmlFor="visa-stage" className="text-slate-700 dark:text-gray-300">Visa Stage</Label>
//                 <Select value={visaStage} onValueChange={setVisaStage}>
//                   <SelectTrigger className="mt-2 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-100">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
//                     <SelectItem value="F1" className="text-slate-900 dark:text-gray-100">F1</SelectItem>
//                     <SelectItem value="CPT" className="text-slate-900 dark:text-gray-100">CPT</SelectItem>
//                     <SelectItem value="OPT" className="text-slate-900 dark:text-gray-100">OPT</SelectItem>
//                     <SelectItem value="STEM-OPT" className="text-slate-900 dark:text-gray-100">STEM-OPT</SelectItem>
//                     <SelectItem value="H1B" className="text-slate-900 dark:text-gray-100">H1B</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </Card>

//           {/* Theme */}
//           <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
//                 <Palette className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="text-slate-900 dark:text-gray-100 text-lg font-semibold">Theme</h3>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => handleThemeChange("light")}
//                 className={`
//                   flex-1 p-4 rounded-xl border-2 transition-all
//                   ${selectedTheme === "light"
//                     ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
//                     : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
//                   }
//                 `}
//               >
//                 <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mx-auto mb-2"></div>
//                 <p className="text-slate-900 dark:text-gray-100 font-medium">Light</p>
//               </button>

//               <button
//                 onClick={() => handleThemeChange("dark")}
//                 className={`
//                   flex-1 p-4 rounded-xl border-2 transition-all
//                   ${selectedTheme === "dark"
//                     ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
//                     : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
//                   }
//                 `}
//               >
//                 <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg mx-auto mb-2"></div>
//                 <p className="text-slate-900 dark:text-gray-100 font-medium">Dark</p>
//               </button>

//               <button
//                 onClick={() => handleThemeChange("auto")}
//                 className={`
//                   flex-1 p-4 rounded-xl border-2 transition-all
//                   ${selectedTheme === "auto"
//                     ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
//                     : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
//                   }
//                 `}
//               >
//                 <div className="w-12 h-12 bg-gradient-to-r from-slate-100 via-slate-500 to-slate-900 rounded-lg mx-auto mb-2"></div>
//                 <p className="text-slate-900 dark:text-gray-100 font-medium">Auto</p>
//               </button>
//             </div>
//           </Card>

//           {/* Save Button */}
//           <Button
//             onClick={handleSave}
//             className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white py-6"
//           >
//             Save Changes
//           </Button>

//           {/* Danger Zone */}
//           <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
//                 <Trash2 className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="text-red-900 dark:text-red-400 text-lg font-semibold">Danger Zone</h3>
//             </div>

//             <p className="text-red-700 dark:text-red-400 mb-4">
//               Once you delete your account, there is no going back. All your posts and comments will be permanently deleted.
//             </p>

//             {!showDeleteConfirm ? (
//               <Button
//                 onClick={() => setShowDeleteConfirm(true)}
//                 variant="outline"
//                 className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-xl"
//               >
//                 Delete Account
//               </Button>
//             ) : (
//               <div className="space-y-3">
//                 <Alert className="bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-800">
//                   <AlertDescription className="text-red-800 dark:text-red-400">
//                     Are you sure you want to delete this account? This action is permanent and cannot be undone. All your posts and comments will be deleted.
//                   </AlertDescription>
//                 </Alert>
//                 <div className="flex gap-3">
//                   <Button
//                     onClick={handleDeleteAccount}
//                     className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
//                   >
//                     Yes, Delete My Account
//                   </Button>
//                   <Button
//                     onClick={() => setShowDeleteConfirm(false)}
//                     variant="outline"
//                     className="flex-1 rounded-xl"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }


// Nov 22, 2025
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { User, Palette, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ProfileSettingsProps {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark" | "auto") => void;
}

const API_BASE = "http://localhost:8000";

export function ProfileSettings({ theme, onThemeChange }: ProfileSettingsProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [visaStage, setVisaStage] = useState("UNKNOWN");
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "auto">(theme === "dark" ? "dark" : "light");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Debug logging
      console.log("Fetching profile...");
      console.log("Token exists:", !!token);
      console.log("Token length:", token?.length);
      
      if (!token) {
        console.error("No token found in localStorage");
        toast.error("Please login to view profile");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/users/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Profile response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Profile data:", data);
        setName(data.name || "");
        setEmail(data.email || "");
        setVisaStage(data.visa_stage || "UNKNOWN");
      } else {
        const errorText = await response.text();
        console.error("Profile fetch error:", response.status, errorText);
        
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
        } else {
          toast.error("Failed to load profile");
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          visa_stage: visaStage
        })
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setSelectedTheme(newTheme);
    if (newTheme === "auto") {
      onThemeChange("light");
    } else {
      onThemeChange(newTheme);
    }
    toast.success(`Theme switched to ${newTheme === "light" ? "Light" : newTheme === "dark" ? "Dark" : "Auto"}`);
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await fetch(`${API_BASE}/users/account`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success("Account deleted successfully");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        // Redirect to landing or login
        window.location.href = "/";
      } else {
        toast.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">⚙️</span>
            <h2
              className="bg-gradient-to-r from-[#6366F1] to-[#A855F7] dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent"
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                filter:
                  theme === "dark"
                    ? "drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))"
                    : "none",
              }}
            >
              Profile & Settings
            </h2>
          </div>
          <p className="text-slate-600 dark:text-gray-400">
            Manage your account, preferences, and notifications.
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-slate-900 dark:text-gray-100 text-lg font-semibold">Personal Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-700 dark:text-gray-300 mb-2 block">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-700 dark:text-gray-300 mb-2 block">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="rounded-xl bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="visa-stage" className="text-slate-700 dark:text-gray-300 mb-2 block">Visa Stage</Label>
                <Select value={visaStage} onValueChange={setVisaStage}>
                  <SelectTrigger className="rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
                    <SelectItem value="F1" className="text-slate-900 dark:text-gray-100">F1</SelectItem>
                    <SelectItem value="CPT" className="text-slate-900 dark:text-gray-100">CPT</SelectItem>
                    <SelectItem value="OPT" className="text-slate-900 dark:text-gray-100">OPT</SelectItem>
                    <SelectItem value="STEM-OPT" className="text-slate-900 dark:text-gray-100">STEM-OPT</SelectItem>
                    <SelectItem value="H1B" className="text-slate-900 dark:text-gray-100">H1B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Theme */}
          <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-slate-900 dark:text-gray-100 text-lg font-semibold">Theme</h3>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={`
                  flex-1 p-4 rounded-xl border-2 transition-all
                  ${selectedTheme === "light"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-lg shadow-indigo-500/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-800"
                  }
                `}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mx-auto mb-2"></div>
                <p className="text-slate-900 dark:text-gray-100 font-medium text-sm">Light</p>
              </button>

              <button
                onClick={() => handleThemeChange("dark")}
                className={`
                  flex-1 p-4 rounded-xl border-2 transition-all
                  ${selectedTheme === "dark"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-lg shadow-indigo-500/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-800"
                  }
                `}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg mx-auto mb-2"></div>
                <p className="text-slate-900 dark:text-gray-100 font-medium text-sm">Dark</p>
              </button>

              <button
                onClick={() => handleThemeChange("auto")}
                className={`
                  flex-1 p-4 rounded-xl border-2 transition-all
                  ${selectedTheme === "auto"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-lg shadow-indigo-500/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-800"
                  }
                `}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-slate-100 via-slate-500 to-slate-900 rounded-lg mx-auto mb-2"></div>
                <p className="text-slate-900 dark:text-gray-100 font-medium text-sm">Auto</p>
              </button>
            </div>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white py-6 shadow-lg shadow-indigo-500/30"
          >
            Save Changes
          </Button>

          {/* Danger Zone */}
          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-red-900 dark:text-red-400 text-lg font-semibold">Danger Zone</h3>
            </div>

            <p className="text-red-700 dark:text-red-400 mb-4 text-slate-600 dark:text-gray-400">
              Once you delete your account, there is no going back. All your posts and comments will be permanently deleted.
            </p>

            {!showDeleteConfirm ? (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="outline"
                className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-xl"
              >
                Delete Account
              </Button>
            ) : (
              <div className="space-y-3">
                <Alert className="bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-800 rounded-xl">
                  <AlertDescription className="text-red-800 dark:text-red-400">
                    Are you sure you want to delete this account? This action is permanent and cannot be undone. All your posts and comments will be deleted.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-3">
                  <Button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-500/30"
                  >
                    Yes, Delete My Account
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    className="flex-1 rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}