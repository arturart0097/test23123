import React from "react";
import "../sass/JoinDiscord.scss";
import logo from "../assets/ds.svg";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { ButtonBlue } from "../components/ButtonBlue";
function JoinDiscord() {
  const navigate = useNavigate();

  return (
    <>
      <h1>JOIN THE COMMUNITY</h1>
      <ul className="subtitle w-full text-center">
        <li>Report bugs and help improve the platform</li>
        <li>Share feedback directly with our team</li>
        <li>Chat with fellow developers</li>
      </ul>
      <div className="w-[400px] flex flex-col gap-5!">
        <ButtonBlue className="bg-[#6760FF]! text-white gap-3!">
          <img src={logo} className="discord-logo" />
          <div>JOIN THE SERVER</div>
        </ButtonBlue>
        <Button className="text-white" onClick={() => navigate("/build")}>
          CONTINUE WITHOUT JOINING
        </Button>
      </div>
    </>
  );
}

export default JoinDiscord;
