import { useEffect } from "react";
import "../sass/Dashboard.scss";
import Preview from "../components/Dashboard/Preview";
import { Routes, Route, useNavigate, useLocation } from "react-router";
import { usePrivy } from "@privy-io/react-auth";
import "../sass/IntroVideoCard.scss";
import GameListing from "./GameListing";
import CreateGame from "../components/Dashboard/CreateGame";
import StorePage from "./Shop/index";
import StoreSuccessPage from "./Shop/Success";
import { CreditsPage } from "./CreditsPage";
import { BuyCredits } from "./BuyCredits";

function Dashboard() {
  const { ready, authenticated } = usePrivy();
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) {
      navigate("/");
      return;
    }
  }, [ready, authenticated, navigate]);

  return (
    <div className="dashboard relative">
      <div className="main mt-[80px] md:mt-0 px-3 md:px-0">
        <Routes>
          <Route path="/" element={<Preview onProfile={undefined} />} />
          <Route path="/games" element={<GameListing />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/buy-credits" element={<BuyCredits />} />
          <Route path="/create" element={<CreateGame />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/store/success" element={<StoreSuccessPage />} />
          
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
