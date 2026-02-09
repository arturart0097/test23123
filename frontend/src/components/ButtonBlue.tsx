import { type ReactNode, type ButtonHTMLAttributes } from "react";

type ButtonBlueProps = {
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonBlue = ({ children, className = "", onClick }: ButtonBlueProps) => {
    return (
        <button
            onClick={onClick}
            className={`flex justify-center items-center self-stretch rounded-[14px] px-[24px]! py-[12px]! bg-[#057DFF] ${className}`}
        >
            {children}
        </button>
    );
};
