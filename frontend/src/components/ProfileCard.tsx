import { NavLink } from "react-router";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import "../sass/ProfileCard.scss";
import profile_icon from "../assets/profile.png";
import qwe_icon from "../assets/qwe.svg";
import { usePrivy } from "@privy-io/react-auth";
import { ProfileModal } from "./Profile";
import { useGameBuilder } from "../contexts/GameBuilderContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/dashboard/games", label: "My Games", icon: "🎮" },
  { to: "/dashboard/credits", label: "My Credits", icon: "💳" },
];

export function ProfileCard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = usePrivy();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { tokenBalance } = useGameBuilder()
  const maxBalance = 800;
  const progress = Math.min((tokenBalance / maxBalance) * 100, 100);

  console.log(tokenBalance, "-111")

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsMenuOpen(false);
    setShowProfileModal(true);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  return (
    <header className="w-full h-20 pt-3! bg-zinc-950/95 border-b border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-4!">
        <img src={logo} alt="logo" className="h-22" />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <nav className="md:w-[110%] h-14 pl-4! bg-white/5 rounded-2xl outline outline-[0.60px] outline-offset-[-0.60px] outline-white/10 inline-flex justify-center items-center gap-11!">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4! py-1! rounded-lg text-lg font-medium
                transition-colors
                ${isActive
                  ? "bg-indigo-500 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }
              `
              }
            >
              <p>{icon}</p>
              <p>{label}</p>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4!">
        <div className="h-14 p-4! bg-white/5 rounded-[10px] outline outline-[0.60px] outline-offset-[-0.60px] outline-fuchsia-300/20 inline-flex flex-col justify-center items-start">
          <div className="self-stretch flex flex-col justify-center items-start gap-0.5! text-white/60 text-sm font-medium leading-5">
            <div className="text-white/60 text-sm font-medium leading-5">
              Your Credits
            </div>

            <div className="text-white text-xs font-medium leading-4">
              {tokenBalance}/800
            </div>

            <div className="w-36 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-b from-fuchsia-300 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((tokenBalance / 800) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>


        {/* Profile Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3! bg-white/5 rounded-[10px] outline outline-[0.60px] outline-offset-[-0.60px] outline-white/10 inline-flex justify-start items-center gap-3! hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 p-0.5 rounded-full outline outline-2 outline-offset-[-1.80px] outline-white/20 inline-flex flex-col justify-start items-start overflow-hidden">
              <img
                className="self-stretch h-full relative"
                src={profile_icon}
                alt="profile"
              />
            </div>
            <div className="w-20 h-5 relative">
              <p className="text-white text-sm font-medium leading-5">
                User1234
              </p>
            </div>
            <div
              className={`w-4 h-4 relative overflow-hidden transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""
                }`}
            >
              <img src={qwe_icon} alt="qwe" />
            </div>
          </button>

          {/* Dropdown Menu with Animation */}
          <div
            className={`absolute right-0 top-full mt-2! w-45 bg-zinc-900/95 backdrop-blur-sm rounded-xl outline outline-[0.60px] outline-offset-[-0.60px] outline-white/10 overflow-hidden shadow-xl z-50 origin-top-right transition-all duration-200 ${isMenuOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
          >
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 px-4! py-3! text-white/80 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-sm font-medium">Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4! py-3! text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {showProfileModal && (
        <ProfileModal
          open={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </header>
  );
}