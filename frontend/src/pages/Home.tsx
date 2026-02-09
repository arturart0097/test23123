import React from "react";
import "../sass/Home.scss";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { Zap } from "lucide-react";
function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* <img src={logo} className="logo" /> */}
      <h1>
        AI Game Studio
      </h1>
      <span>A new way to create and play games</span>
      <Button className="text-white gap-3" onClick={() => navigate("/discord")}>
        <Zap width={15} /> Start Building
      </Button>
    </>
  );
}

export default Home;
