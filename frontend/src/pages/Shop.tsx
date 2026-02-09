import SilverPack from "../assets/silverPack.svg";
import starterPack from "../assets/starterPack.svg";
import goldPack from "../assets/goldPack.svg";
import { TokenProduct, SubscriptionProduct } from "../components/Store/Items";

const TOKEN_PRICE_ID = "prod_TkUR1PuQrq859v";
const TEST_PRICE_ID = "prod_TkrDQKaRFitv4t";
const PRO_PRICE_ID = "prod_TkUQo9b9e5yYrG";
const ULTRA_PRICE_ID = "prod_TkUR6nGmhV7nts";

export const BuyCredits = () => {
  return (
    <div className="flex flex-col w-full p-4!">
      <h1>Credit Store</h1>
      <div className="flex flex-col items-center gap-10">
        <div className="flex justify-center items-center">
          <SubscriptionProduct
            productID={TEST_PRICE_ID}
            quantity={1}
            name="Starter Pack"
            image={starterPack}
            price={9.99}
            extraTokens={100}
            description="Get 100 tokens for $9.99"
          />
          <SubscriptionProduct
            productID={PRO_PRICE_ID}
            quantity={1}
            name="Starter Pack"
            image={starterPack}
            price={9.99}
            extraTokens={100}
            description="Get 100 tokens for $9.99"
          />
          <SubscriptionProduct
            productID={ULTRA_PRICE_ID}
            quantity={1}
            name="Starter Pack"
            image={starterPack}
            price={9.99}
            extraTokens={100}
            description="Get 100 tokens for $9.99"
          />
        </div>
        <div className="flex justify-center items-center">
          <TokenProduct
            productID={TOKEN_PRICE_ID}
            quantity={1}
            name="Silver Pack"
            image={SilverPack}
            price={8.99}
            extraTokens={1000}
          />
          <TokenProduct
            productID={TOKEN_PRICE_ID}
            quantity={1}
            name="Gold Pack"
            image={goldPack}
            price={19.99}
            extraTokens={5000}
          />
          <TokenProduct
            productID={TOKEN_PRICE_ID}
            quantity={1}
            name="Gold Pack"
            image={goldPack}
            price={19.99}
            extraTokens={5000}
          />
        </div>
      </div>
    </div>
  );
};
