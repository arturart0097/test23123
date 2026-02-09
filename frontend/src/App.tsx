import { BrowserRouter, Route, Routes } from "react-router";

import Dashboard from "./pages/Dashboard";
import { GameBuilderContextProvider } from "./contexts/GameBuilderContext";
import GameTest from "./pages/GameTest";
import Lander from "./pages/Lander";
import { Layout } from "./layout";
import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "react-hot-toast";
import { base } from "viem/chains";
import emailjs from "@emailjs/browser";
import logo from "./assets/logo-icon.png";

function App() {
  emailjs.init({
    publicKey: import.meta.env.VITE_EMAIL_PUBLIC_KEY,
    blockHeadless: true,
    limitRate: {
      id: "app",
      throttle: 10000, // Allow 1 request per 10s
    },
  });

  return (
    <>
      <ThemeProvider>
          <GameBuilderContextProvider>
            <Toaster
              toastOptions={{
                style: {
                  fontFamily: "Bicyclette",
                },
              }}
            />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/dashboard/*" element={<Dashboard />} />
                  <Route path="/gametest/*" element={<GameTest />} />
                </Route>
                <Route path="*" element={<Lander />} />
              </Routes>
            </BrowserRouter>
          </GameBuilderContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
