// import React, { useState, useContext } from "react";
// import api from "../services/api";
// import { AuthContext } from "../auth/AuthProvider";
// import { useNavigate } from "react-router-dom";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function Login() {
//   const { login } = useContext(AuthContext);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errMsg, setErrMsg] = useState("");

//   const navigate = useNavigate();

//   async function handleLogin(e) {
//     e.preventDefault();
//     setLoading(true);
//     setErrMsg("");

//     try {
//       const res = await api.post("/auth/signin-admin", {
//         email,
//         password,
//       });

//       const token = res.data?.data?.token || res.data?.token;
//       if (!token) throw new Error("Token missing");

//       login(token);
//       navigate("/admin");
//     } catch (err) {
//       setErrMsg("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
  
//       <Card className="w-full max-w-md border border-slate-200 shadow-sm">
//         <CardHeader>
//           <CardTitle className="text-center text-2xl">
//             Admin Login
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           {errMsg && (
//             <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
//               {errMsg}
//             </div>
//           )}

//           <form onSubmit={handleLogin} className="space-y-4">
//             {/* Email */}
//             <div>
//               <Label>Email</Label>
//               <Input
//                 type="email"
//                 placeholder="admin@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <Label>Password</Label>
//               <Input
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Submit */}
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-indigo-600 hover:bg-indigo-700"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


import React, { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import bgImage from "../assets/silhouette-young-fitness-man-running-sunrise.jpg";


export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    try {
      const res = await api.post("/auth/signin-admin", {
        email,
        password,
      });

      const token = res.data?.data?.token || res.data?.token;
      if (!token) throw new Error("Token missing");

      login(token);
      navigate("/admin");
    } catch (err) {
      setErrMsg("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 relative track-field-bg"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="border border-slate-700 shadow-xl bg-slate-800 rounded-xl">
          <CardHeader className="bg-slate-700 border-b border-slate-600 rounded-t-xl">
            <CardTitle className="text-center text-2xl font-bold text-white flex items-center justify-center gap-2">
              <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                <span className="text-3xl">🔐</span>
              </div>
              <span>🔐</span>
              Admin Login
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {errMsg && (
              <div className="mb-4 rounded-lg bg-red-900/30 border border-red-700 px-4 py-3 text-sm text-red-300 flex items-center gap-2">
                <span>⚠️</span>
                {errMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2">
                  <span>📧</span>
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Password */}
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2">
                  <span>🔒</span>
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 rounded-lg shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span>⏳</span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Login
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
