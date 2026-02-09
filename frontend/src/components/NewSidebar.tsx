// import telegram_icon from "../assets/telegram.svg";
// import x_icon from "../assets/X.svg";
// import discord_icon from "../assets/discord.svg";
// import sidebar_button from "../assets/sidebar_button.svg";
// import logo from "../assets/logo.png";
// import profile_icon from "../assets/profile.png";
// import { useEffect, useState } from "react";
// import { useLogout } from "@privy-io/react-auth";
// import { Link, useNavigate } from "react-router";
// import { FeedbackButton } from "./Feedback";
// import { useTutorial } from "../hooks/useTutorial";
// import { useMobile } from "../hooks/useMobile";
// import Coin from "../assets/coin.svg";
// import { useGameBuilder } from "../contexts/GameBuilderContext";

// interface SidebarLinkProps {
//   to: string;
//   label: string;
//   highlight?: boolean;
//   isTutorialText?: string;
//   variant?: "default" | "minimal";
//   textSize?: number;
//   wrap?: string;
// }

// export const SidebarLink = ({
//   to,
//   label,
//   highlight = false,
//   variant = "default",
//   textSize,
//   wrap = "nowrap",
// }: SidebarLinkProps) => {
//   const hoverStyling =
//     "hover:bg-gradient-to-tr hover:from-blue-800 hover:to-pink-600  hover:border-zinc-500 transition-colors duration-300 hover:cursor-pointer";

//   if (variant === "minimal") {
//     return (
//       <div className={`w-full`}>
//         <Link
//           to={to}
//           className={`block w-full text-center text-white/90 font-semibold text-lg py-2`}
//           style={{
//             fontSize: textSize,
//             whiteSpace:
//               wrap === "nowrap" ? "nowrap" : wrap === "wrap" ? "normal" : wrap,
//           }}
//         >
//           {label}
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <Link to={to}>
//       <div
//         className={`flex rounded-xl! p-2! w-19/20 border-2 border-transparent ${hoverStyling} ${
//           highlight
//             ? "relative ring-2 ring-fuchsia-400/70 shadow-[0_0_28px_rgba(217,70,239,0.55)] animate-pulse bg-white/5"
//             : ""
//         }`}
//         style={{
//           fontSize: textSize,
//           whiteSpace:
//             wrap === "nowrap" ? "nowrap" : wrap === "wrap" ? "normal" : wrap,
//         }}
//       >
//         {label}
//       </div>
//     </Link>
//   );
// };

// interface SocialLinkProps {
//   icon: string;
//   label: string;
//   textSize?: number;
// }

// const SocialLink = ({ icon, label, textSize }: SocialLinkProps) => {
//   return (
//     <div className="flex px-2! hover:cursor-pointer transition-all duration-300 items-center gap-2! hover text-white/90 justify-center">
//       <img src={icon} className="w-5 h-5" />
//       <span
//         className={`text-base`}
//         style={{
//           fontSize: textSize,
//         }}
//       >
//         {label}
//       </span>
//     </div>
//   );
// };

// export default function NewSidebar() {
//   const [sideBarShown, setSideBarShown] = useState(true);
//   const [contentVisible, setContentVisible] = useState(true);
//   const [walletAddress, setWalletAddress] = useState("");
//   const navigate = useNavigate();
//   const { logout } = useLogout({
//     onSuccess: () => {
//       navigate("/");
//     },
//   });

//   const { tokenBalance, userWallet } = useGameBuilder();
//   const { tutorial, step, showIntro } = useTutorial();
//   const isMobile = useMobile();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     setWalletAddress(userWallet.slice(0, 10) + "...");
//   }, [userWallet]);

//   const sidebarToggle = () => {
//     setSideBarShown(!sideBarShown);
//     if (sideBarShown) setContentVisible(false);
//   };

//   const stateStyle = sideBarShown ? "w-20 md:w-50 min-w-30" : "w-14";
//   const stateHiding = sideBarShown ? "block" : "hidden";
//   const stateMargin = sideBarShown ? "mr-2! my-3!" : "my-3!";
//   const fadeIn = "transition-all duration-300";
//   const pop = contentVisible
//     ? "opacity-100 translate-y-0"
//     : "opacity-0 translate-y-1 pointer-events-none";

//   useEffect(() => {
//     if (!isMobile) return;
//     document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [mobileMenuOpen, isMobile]);

//   if (isMobile) {
//     return (
//       <>
//         {/* Mobile Header */}
//         <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-zinc-900/80 backdrop-blur border-b border-zinc-700 px-3 py-2">
//           <div className="flex items-center gap-2">
//             <img src={logo} className="h-16 w-auto" />
//           </div>
//           <button
//             aria-label="Toggle menu"
//             aria-expanded={mobileMenuOpen}
//             className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-white/10 active:scale-95 transition"
//             onClick={() => setMobileMenuOpen((v) => !v)}
//           >
//             <span
//               className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${
//                 mobileMenuOpen ? "translate-y-2 rotate-45" : ""
//               }`}
//             />
//             <span
//               className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${
//                 mobileMenuOpen ? "opacity-0" : "opacity-100"
//               }`}
//             />
//             <span
//               className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${
//                 mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
//               }`}
//             />
//           </button>
//         </div>

//         {/* Overlay + Right Panel */}
//         <aside role="dialog" aria-modal="true" aria-hidden={!mobileMenuOpen}>
//           {/* Backdrop */}
//           <div
//             className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
//               mobileMenuOpen
//                 ? "opacity-100 pointer-events-auto"
//                 : "opacity-0 pointer-events-none"
//             }`}
//             onClick={() => setMobileMenuOpen(false)}
//           />

//           {/* Off-canvas panel */}
//           <div
//             className={`fixed top-0 right-0 h-full w-full z-50 border-l border-zinc-700 bg-[#0C111C]/90 backdrop-blur transform transition-transform duration-300 ${
//               mobileMenuOpen ? "translate-x-0" : "translate-x-full"
//             }`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Panel Header */}
//             <div className="flex items-center justify-between px-4 py-3">
//               <div className="flex items-center gap-2">
//                 <img src={logo} className="h-16 w-auto" />
//               </div>
//               <button
//                 aria-label="Close menu"
//                 className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95 transition"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <span className="text-white text-lg">✕</span>
//               </button>
//             </div>

//             {/* Panel Body */}
//             <div className="px-4 py-5">
//               <nav className="flex flex-col items-center text-center gap-4">
//                 <div className="w-[90%] border-b border-white/10 !pb-4">
//                   <div
//                     onClick={() => setMobileMenuOpen(false)}
//                     className="py-1"
//                   >
//                     <SidebarLink
//                       to="/dashboard"
//                       label="Dashboard"
//                       variant="minimal"
//                       textSize={28}
//                     />
//                   </div>
//                   <div
//                     onClick={() => setMobileMenuOpen(false)}
//                     className="py-1"
//                   >
//                     <SidebarLink
//                       to="/dashboard/games"
//                       label="My Games"
//                       highlight={!tutorial && step === 1}
//                       isTutorialText={"Натисніть "}
//                       variant="minimal"
//                     />
//                   </div>
//                   <div
//                     onClick={() => setMobileMenuOpen(false)}
//                     className="py-1"
//                   >
//                     <SidebarLink
//                       to="/dashboard/Store"
//                       label="Store"
//                       highlight={!tutorial && step === 1}
//                       isTutorialText={"Натисніть "}
//                       variant="minimal"
//                     />
//                   </div>
//                 </div>

//                 <div className="w-full pb-3">
//                   <div className="flex flex-col gap-3 mt-2">
//                     <SocialLink
//                       icon={telegram_icon}
//                       label="Telegram"
//                       textSize={22}
//                     />
//                     <SocialLink icon={x_icon} label="Twitter" textSize={22} />
//                     <SocialLink
//                       icon={discord_icon}
//                       label="Discord"
//                       textSize={22}
//                     />
//                   </div>
//                 </div>

//                 <div className="w-full mt-1">
//                   <div className="w-full flex items-center justify-center">
//                     <FeedbackButton />
//                   </div>
//                 </div>
//               </nav>
//             </div>

//             {/* Panel Footer */}
//             <div className="bg-black/60 px-4 py-3 w-full absolute bottom-0 flex gap-3">
//               <img src={profile_icon} className="w-8 h-8 rounded-full" />
//               <div className="flex flex-col">
//                 <span className="text-white/80 text-2xl leading-tight truncate w-full">
//                   {walletAddress}
//                 </span>
//                 <a
//                   href="#"
//                   className="logout-link hover:underline text-white text-xl"
//                   onClick={logout}
//                 >
//                   Log Out
//                 </a>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Spacer removed; page container applies margin-top on mobile */}
//         <div className="h-0" />
//       </>
//     );
//   }

//   return (
//     <div
//       id="sidebar"
//       className={`flex flex-col h-full bg-white/15 border-r border-zinc-600! ${stateStyle} transition-all duration-600 z-50`}
//       onTransitionEnd={(e) => {
//         if (e.propertyName === "width" && sideBarShown) setContentVisible(true);
//       }}
//     >
//       {!tutorial && step > 1 && step < 10 && (
//         <>
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-auto w-50" />
//         </>
//       )}

//       {showIntro && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-auto w-50" />
//       )}

//       <div
//         id="topbar"
//         className="flex items-center! justify-around mb-6! mx-1.5! px-1 border-b-2 border-zinc-700! hover:cursor-pointer"
//         onClick={() => sidebarToggle()}
//       >
//         <div className={`${stateHiding}`}>
//           <img src={logo} className={`w-99/100 hidden ${stateHiding} ${pop}`} />
//         </div>

//         <img
//           src={sidebar_button}
//           className={`w-7 h-7 ${stateMargin} hover:cursor-pointer`}
//         />
//       </div>
//       {!sideBarShown ? null : (
//         <div className="flex flex-col justify-between h-full md:text-xl">
//           <div className="flex flex-col gap-5">
//             <div
//               id="siteLinks"
//               className={`flex flex-col gap-1 mx-2! border-b-2 border-zinc-700 pb-8! ${fadeIn} delay-50 ${pop}`}
//             >
//               <SidebarLink to="/dashboard" label="Dashboard" />
//               <SidebarLink
//                 to="/dashboard/games"
//                 label="My Games"
//                 highlight={!tutorial && step === 1}
//                 isTutorialText={"Натисніть "}
//               />
//               <SidebarLink to="/dashboard/store" label="Store" />
//             </div>
//             <div
//               id="socials"
//               className={`flex flex-col items-start gap-3 mx-2! border-b-2 border-zinc-700 pb-8! ${fadeIn} delay-200 ${pop}`}
//             >
//               <SocialLink icon={telegram_icon} label="Telegram" />
//               <SocialLink icon={x_icon} label="X" />
//               <SocialLink icon={discord_icon} label="Discord" />
//             </div>
//             <div className={`flex justify-start !px-2`}>
//               <div className="relative w-full">
//                 <span className="w-full absolute inset-0 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#EC4899] to-[#F59E0B] opacity-70 blur-[1px] transition-opacity duration-300 group-hover:opacity-100 p-3" />
//                 <button
//                   type="button"
//                   className="w-full relative flex items-center rounded-full border border-white/10 bg-[#151B28]/90 px-5 py-2 text-lg font-semibold text-white/90 transition-colors duration-300 hover:bg-[#1C2333]"
//                   onClick={() => navigate("/dashboard/store")}
//                 >
//                   <img src={Coin} alt="" className="h-12" />
//                   <span className="text-2xl tracking-wide">
//                     {tokenBalance || 0}
//                   </span>
//                 </button>
//               </div>
//             </div>
//             <div
//               className={`flex justify-start ml-4! ${fadeIn} delay-400 ${pop}`}
//             >
//               <FeedbackButton />
//             </div>
//           </div>

//           <div
//             id="profile"
//             className="flex border-t border-zinc-700 p-2! mt-4! items-center !gap-2 text-sm sticky bottom-0 bg-zinc-900/60 backdrop-blur"
//           >
//             <img src={profile_icon} className="w-8 h-8 rounded-full" />
//             <div>
//               <div>{walletAddress}</div>
//               <a
//                 href="#"
//                 className="logout-link hover:underline"
//                 onClick={logout}
//               >
//                 Log Out
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
