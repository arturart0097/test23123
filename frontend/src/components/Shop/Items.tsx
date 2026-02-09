import { PurchaseProduct } from "../../lib/apiClientUser";
import { ThemeButton } from "../Buttons";
import checkedIcon from "../../assets/checked.png";
import { StarsIcon, Zap } from "lucide-react";

interface ProductProps {
  price: number;
  productID: string;
  quantity: number;
  extraTokens: number;
  name: string;
  image: string;
  mode?: string;
  /** Badge above the card, e.g. "MOST POPULAR" */
  badge?: string;
  /** Visually highlight the card (for the middle plan) */
  highlighted?: boolean;
  children?: React.ReactNode;
}

const Product = ({
  productID,
  quantity = 1,
  extraTokens = 0,
  name,
  image,
  mode = "payment",
  badge,
  highlighted,
  children,
}: ProductProps) => {
  return (
    <div className="flex flex-col items-center">
      {badge && (
        <div className="flex h-8 px-4! pt-1.5! rounded-full bg-gradient-to-tr from-[#F094FA] to-[#F5576E] z-10">
          {badge}
        </div>
      )}

      <div
        className={`flex w-[428px] flex-col items-start gap-[23.997px] pt-8! px-8! pb-8! shrink-0 self-stretch rounded-2xl border border-gray-500/30 bg-white/5 ${highlighted ? "scale-[1.04] border-[#6760FF66]! bg-[#151624]" : ""
          }`}
      >
        <div className="flex flex-col gap-6">{children}</div>

        <div className="mt-8! w-full">
          <ThemeButton
            bg={
              highlighted
                ? "rounded-[14px] bg-[linear-gradient(60deg,#F094FA_13.4%,#F5576E_86.6%)] shadow-[0_10px_15px_-3px_rgba(240,148,250,0.2),0_4px_6px_-4px_rgba(240,148,250,0.2)]"
                : "bg-zinc-800"
            }
            hover={
              highlighted
                ? "rounded-[14px] bg-[linear-gradient(60deg,#F094FA_13.4%,#F5576E_86.6%)] shadow-[0_10px_15px_-3px_rgba(240,148,250,0.2),0_4px_6px_-4px_rgba(240,148,250,0.2)] transition-all duration-300"
                : "hover:bg-zinc-700"
            }
            radius="rounded-xl"
            padding="py-3! px-4!"
            onClick={async () => {
              await PurchaseProduct(productID, mode, quantity, extraTokens);
            }}
          >
            Get Started
          </ThemeButton>
        </div>
      </div>
    </div>
  );
};

interface TokenProductProps extends ProductProps {
  extraTokens: number;
}

export const TokenProduct = ({
  productID,
  quantity = 1,
  name,
  mode = "payment",
  image,
  price,
  extraTokens,
}: TokenProductProps) => {
  const isStarterPack = name === "Starter Pack";

  const benefits = [
    `${isStarterPack ? "500" : extraTokens.toLocaleString()} generation credits`,
    "Essential game templates",
    "Standard generation speed",
    "Email support",
  ];

  return (
    <Product
      productID={productID}
      price={price}
      quantity={1}
      extraTokens={extraTokens}
      name={name}
      image={image}
      mode={mode}
      highlighted={isStarterPack}
      badge={isStarterPack ? "Most Popular" : undefined}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Zap />
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">{name}</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-400">
              + {extraTokens.toLocaleString()} extra tokens!
            </span>
          </div>
        </div>

        <div className="text-3xl font-bold">
          ${price.toFixed(2)}
        </div>
        <p className="text-sm text-zinc-400">
          Great starter option to test the platform and create your first games.
        </p>

        <ul className="mt-2! space-y-2! text-sm">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2">
              <img
                src={checkedIcon}
                alt=""
                className="h-4 w-4 shrink-0"
              />
              <span className="text-zinc-200">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </Product>
  );
};

interface SubscriptionProductProps extends ProductProps {
  extraTokens: number;
  description: string;
}

export const SubscriptionProduct = ({
  productID,
  quantity = 1,
  name,
  image,
  mode = "subscription",
  price,
  extraTokens,
  description,
}: SubscriptionProductProps) => {
  const isPro = name === "GameGPT Pro";
  const isUltra = name === "GameGPT Ultra";

  const benefits = [
    `${extraTokens.toLocaleString()} generation credits`,
    isUltra ? "Premium game templates" : "Basic game templates",
    isUltra ? "Priority generation speed" : "Standard generation speed",
    isUltra ? "Priority support" : "Community support",
  ];

  return (
    <Product
      productID={productID}
      price={price}
      quantity={quantity}
      extraTokens={extraTokens}
      name={name}
      image={image}
      mode={mode}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <StarsIcon />
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">{name}</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-400">
              + {extraTokens.toLocaleString()} extra tokens!
            </span>
          </div>
        </div>

        <div className="text-3xl font-bold">
          ${price.toFixed(2)}
        </div>
        <p className="text-sm text-zinc-400">{description}</p>

        <ul className="mt-2 space-y-2 text-sm">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2">
              <img
                src={checkedIcon}
                alt=""
                className="h-4 w-4 shrink-0"
              />
              <span className="text-zinc-200">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </Product>
  );
};
