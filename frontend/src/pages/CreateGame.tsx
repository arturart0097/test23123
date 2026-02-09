import "../sass/CreateGame.scss";
import addIcon from "../assets/add_icon.png";
import remixIcon from "../assets/remix_icon.png";
import { useNavigate } from "react-router";
import { useGameBuilder } from "../contexts/GameBuilderContext";
import { useLogin } from "@privy-io/react-auth";
import toast from "react-hot-toast";
import { Button } from "../components/Button";

function ActionCard({ icon, title, description, color }) {
  return (
    <div className={`action-card-${color}`}>
      <div className="action-card-img-wrapper">
        <img src={icon} className="action-card-img" />
      </div>
      <div className="action-card-body">
        <h2 className="action-card-title">{title}</h2>
        <div className="action-card-description">{description}</div>
      </div>
    </div>
  );
}

function GameNameForm() {
  const gameBuilder = useGameBuilder();

  return (
    <>
      {/* <h2>GAME DETAILS</h2> */}
      <h3>Game Name</h3>
      <form>
        <input
          type="text"
          placeholder="ENTER YOUR GAME NAME"
          onChange={(e) => gameBuilder.setGameName(e.target.value)}
          className="w-[450px]"
        />
      </form>
    </>
  );
}

function CreateModeForm() {
  return (
    <>
      <h2>GAME TEMPLATES</h2>
      <h3>Would you like to start from scratch or use one of our templates?</h3>
      <div className="action-cards">
        <ActionCard
          icon={addIcon}
          title="NO TEMPLATE"
          description="START FROM SCRATCH"
          color={"blue"}
        />
        <ActionCard
          icon={remixIcon}
          title="REMIX TEMPLATE"
          description="EDIT A PREMADE TEMPLATE"
          color={"red"}
        />
      </div>
    </>
  );
}

function CreateGame() {
  const navigate = useNavigate();

  const gameBuilder = useGameBuilder();
  const { login } = useLogin({
    onComplete: () => {
      navigate("/dashboard/create");
    },
  });

  const onLogin = () => {
    if (gameBuilder.gameName.trim().length == 0) {
      toast.error("Must enter a game name");
      return;
    }

    login();
  };

  return (
    <>
      <h1>CREATE GAME</h1>
      <h3>LET'S GET YOU STARTED</h3>
      <div className="flex flex-col items-start gap-5 p-[15px]! rounded-[20px] bg-[#1A1B1F]">
        <GameNameForm />
        <div className="flex gap-5 mt-5! w-full">
            <a
              href="#"
              className="flex justify-center items-center pt-[18.409px]! pb-[17.591px]! pl-[51px]! pr-[52px]! shrink-0 rounded-[10px] border-[0.599px] border-white/10 bg-white/5 text-white/60!"
              onClick={() => navigate("/build")}
            >
              Back
            </a>
          <Button className="flex-2" onClick={onLogin}>
            Login with Privy
          </Button>
        </div>
      </div>
    </>
  );
}

export default CreateGame;
