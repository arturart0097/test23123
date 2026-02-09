import { PurchaseProduct } from "../../lib/apiClientUser";
import { ThemeButton } from "../Buttons";

interface ProductProps {
  price: number;
  productID: string;
  quantity: number;
  extraTokens: number;
  name: string;
  image: string;
  mode?: string;
  children?: React.ReactNode;
}

const Product = ({
  productID,
  quantity = 1,
  extraTokens = 0,
  name,
  image,
  mode = "payment",
  children,
}: ProductProps) => {
  return (
    <div
      className="flex min-h-90 [font-family:'Tachyon_W00_Light'] flex-col w-full max-w-68 justify-between text-center  items-center pt-12! pb-8! px-4!"
      style={{
        boxShadow:
          "0 10px 85px -5px rgba(59, 130, 246, 0.5), 0 4px 6px -2px rgba(147, 51, 234, 0.3)",
        borderRadius: 40,
      }}
    >
      <div className="flex flex-col justify-center items-center">
        <img src={image} alt={name} width={100} height={100} />
        <div className="mt-3!">{children}</div>
      </div>

      <div className="w-full hover:cursor-pointer">
        <ThemeButton
          bg="bg-zinc-700"
          hover={`hover:cursor-pointer! hover:bg-purple-600 hover:border-2 `}
          radius="rounded-lg!"
          padding="py-2! px-4!"
          onClick={async () => {
            await PurchaseProduct(productID, mode, quantity, extraTokens);
          }}
        >
          Buy
        </ThemeButton>
      </div>
    </div>
  );
};

interface TokenProductProps extends ProductProps {
  extraTokens: number;
  description: string;
}

export const TokenProduct = ({
  productID,
  quantity = 1,
  name,
  mode = "payment",
  image,
  price,
  extraTokens,
  description,
}: TokenProductProps) => {
  return (
    <Product
      productID={productID}
      price={price}
      quantity={1}
      extraTokens={extraTokens}
      name={name}
      image={image}
      mode={mode}
    >
      <div className="flex flex-col text-sm justify-center items-center text-center">
        <div>{name}</div>
        <div className="flex gap-1 ">
          <div>{quantity}</div>
          {extraTokens > 0 && <div>{`+ ${extraTokens}`}</div>}
        </div>
        <div>{`${price} `}</div>
        <div className="text-xs my-4!">{description}</div>
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
      <div className="flex flex-col text-sm justify-center items-center text-center">
        <div className="text-lg">{name}</div>
        <div>{`+ ${extraTokens} extra tokens!`}</div>
        <div>{`${price} `}</div>
        <div className="text-xs my-4!">{description}</div>
      </div>
    </Product>
  );
};
