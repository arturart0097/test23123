import SilverPack from "../../assets/silverPack.svg";
import starterPack from "../../assets/starterPack.svg";
import goldPack from "../../assets/goldPack.svg";
import { TokenProduct, SubscriptionProduct } from "../../components/Shop/Items";
import { LifeBuoy, Lock, Zap } from "lucide-react";
import { useState } from "react";
import { useGameBuilder } from "../../contexts/GameBuilderContext";
import { ThemeButton } from "../../components/Buttons";
import { CancelModal } from "../../components/Store/CancelModal";

const TENK_PRICE_ID = "price_1SowtYQb3DF1rugSzDBT6IDD";
// const TEST_PRICE_ID = "price_1SnLUiQb3DF1rugSrasJRSfP";
// const TEST_PRO_PRICE_ID = "price_1SmzS9Qb3DF1rugSkVDxR5AQ";
// const TEST_ULTRA_PRICE_ID = "price_1SmzSKQb3DF1rugS6Dl4cGyD";
const PRO_PRICE_ID = "price_1SowtAQb3DF1rugSPU9rmc1B";
const ULTRA_PRICE_ID = "price_1SowsyQb3DF1rugS3AhcNrTm";

const StorePage = () => {
  const [showModal, setShowModal] = useState(false);
  const { userTier } = useGameBuilder();

  return (
    <div className="flex flex-col w-full p-4! justify-center items-center">
      <h1>Credit Store</h1>
      <span>Choose the perfect plan for your game creation journey. All plans include access to our AI-powered game generation tools.</span>
      <div className="flex flex-col items-center p-10! gap-10">
        <div className="flex w-full justify-center items-center gap-8">
          <SubscriptionProduct
            productID={PRO_PRICE_ID}
            quantity={1}
            name="GameGPT Pro"
            image={SilverPack}
            price={9.99}
            extraTokens={10000}
            description="Access to basic models and monthly token topups"
          />
          <TokenProduct
            productID={TENK_PRICE_ID}
            quantity={1}
            name="Starter Pack"
            image={starterPack}
            price={9.99}
            extraTokens={0}
          />
          <SubscriptionProduct
            productID={ULTRA_PRICE_ID}
            quantity={1}
            name="GameGPT Ultra"
            image={goldPack}
            price={29.99}
            extraTokens={33000}
            description="Access to premium models and monthly token topups"
          />
        </div>
        <div className="flex w-full h-[156.572px] items-start pt-[48.594px] border-t-[0.599px] border-white/10 mt-10! pt-7!">
          <div className="flex-1 flex flex-col justify-center items-center gap-3">
            <div className="flex w-[47.995px] h-[47.995px] justify-center items-center pl-0 rounded-[14px] bg-[#057DFF1A]">
              <Lock color="#057DFF" />
            </div>
            <p>Secure Payment</p>
            <span>Industry-standard encryption for all transactions</span>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center gap-3">
            <div className="flex w-[47.995px] h-[47.995px] justify-center items-center pl-0 rounded-[14px] bg-[rgba(5,125,255,0.1)]">
              <Zap color="#6760FF" />
            </div>
            <p>Instant Access</p>
            <span>Industry-standard encryption for all transactions</span>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center gap-3">
            <div className="flex w-[47.995px] h-[47.995px] justify-center items-center pl-0 rounded-[14px] bg-[#F094FA1A]">
              <LifeBuoy color="#F094FA" />
            </div>
            <p>24/7 Support</p>
            <span>Our team is always here to help you</span>
          </div>
        </div>
        <div className="flex w-full justify-center gap-18 items-center"></div>

        {userTier !== "BASIC" && (
          <div className="w-80">
            <ThemeButton
              onClick={() => setShowModal(true)}
              bg="bg-zinc-700"
              hover={`hover:cursor-pointer! hover:bg-red-400 `}
            >
              Cancel Subscription
            </ThemeButton>
          </div>
        )}

        <CancelModal
          isOpen={showModal}
          closeModal={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default StorePage;
