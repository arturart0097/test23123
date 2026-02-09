import SilverPack from "../assets/silverPack.svg";
import starterPack from "../assets/starterPack.svg";
import goldPack from "../assets/goldPack.svg";
import "../sass/ByeCredits.scss";

export const BuyCredits = () => {
  return (
    <div className="flex flex-col justify-center w-full p-4!">
      <h1>Credit store</h1>
      <hr />

      <div className="flex justify-center items-center gap-10 !mt-30">
        <div className="flex justify-center items-center">
          <div
            className="credit-wrapper"
            style={{
              boxShadow:
                "0 10px 85px -5px rgba(255, 255, 255, 0.4), 0 4px 6px -2px rgba(84, 84, 84, 0.25)",
              borderRadius: 40,
            }}
          >
            <h2>Silver Pack</h2>
            <p>1000 CREDITS</p>
            <img src={SilverPack} alt="" />
            <button>$8.99</button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div
            className="credit-wrapper !w-[443px] !h-[600px]"
            style={{
              boxShadow:
                "0 10px 85px -5px rgba(59, 130, 246, 0.5), 0 4px 6px -2px rgba(147, 51, 234, 0.3)",
              borderRadius: 40,
              padding: "64.973px 21px 65.586px 21px",
            }}
          >
            <h2>Silver Pack</h2>
            <p>1000 CREDITS</p>
            <img src={starterPack} alt="" />
            <button>$8.99</button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div
            className="credit-wrapper"
            style={{
              boxShadow:
                "0 10px 85px -5px rgba(246, 246, 59, 0.5), 0 4px 6px -2px rgba(210, 234, 51, 0.3)",
              borderRadius: 40,
            }}
          >
            <h2>Silver Pack</h2>
            <p>1000 CREDITS</p>
            <img src={goldPack} alt="" />
            <button>$8.99</button>
          </div>
        </div>
      </div>
    </div>
  );
};
