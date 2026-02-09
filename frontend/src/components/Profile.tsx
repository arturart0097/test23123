import { useEffect, useMemo, useState } from "react";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { X, LogOut, Check, Copy } from "lucide-react";
import telegram_icon from "../assets/telegram.svg";
import x_icon from "../assets/X.svg";
import discord_icon from "../assets/discord.svg";
import profile_icon from "../assets/profile.png";
import { Button } from "./Button";

const BASE_VITE_API_URL2 = import.meta.env.VITE_API_URL2;
const BIO_MAX = 200;

const getWalletAddressShort = (user?: any) => {
  if (!user?.linkedAccounts) return "";
  const acct = user.linkedAccounts.find((a: any) => a.type === "wallet");
  if (!acct?.address) return "";
  const addr = acct.address as string;
  return addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
};

const getWalletAddressFull = (user?: any) => {
  if (!user?.linkedAccounts) return "";
  const acct = user.linkedAccounts.find((a: any) => a.type === "wallet");
  return (acct?.address as string) || "";
};

export type ProfileModalProps = {
  open: boolean;
  onClose: () => void;
};

export const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
  const { user, logout } = usePrivy();
  const walletShort = useMemo(() => getWalletAddressShort(user), [user]);
  const walletFull = useMemo(() => getWalletAddressFull(user), [user]);
  const token = getAccessToken();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [copied, setCopied] = useState(false);

  const [initialValues, setInitialValues] = useState({
    username: "",
    bio: "",
    telegram: "",
    twitter: "",
    discord: "",
  });

  useEffect(() => {
    if (!user?.id || !open) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${BASE_VITE_API_URL2}/api/user?privyId=${user.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const userData = data.user || {};
        const initial = {
          username: userData.username || "",
          bio: userData.bio || "",
          telegram: userData.telegram || "",
          twitter: userData.twitter || "",
          discord: userData.discord || "",
        };
        setInitialValues(initial);
        setDisplayName(initial.username);
        setBio(initial.bio);
        setTelegram(initial.telegram);
        setTwitter(initial.twitter);
        setDiscord(initial.discord);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [user?.id, open]);

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const updateUserField = async (field: string, value: string) => {
    if (!user?.id) return;
    const response = await fetch(
      `${BASE_VITE_API_URL2}/api/update?privyId=${user.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ field, value }),
      }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  };

  const handleSave = async () => {
    if (!user?.id) return;

    const updates: Array<{ field: string; value: string }> = [];
    if (displayName !== initialValues.username) updates.push({ field: "username", value: displayName });
    if (bio !== initialValues.bio) updates.push({ field: "bio", value: bio });
    if (telegram !== initialValues.telegram) updates.push({ field: "telegram", value: telegram });
    if (twitter !== initialValues.twitter) updates.push({ field: "twitter", value: twitter });
    if (discord !== initialValues.discord) updates.push({ field: "discord", value: discord });

    if (updates.length > 0) {
      try {
        await Promise.all(updates.map(({ field, value }) => updateUserField(field, value)));
        setInitialValues((prev) => {
          const next = { ...prev };
          updates.forEach(({ field, value }) => {
            if (field === "username") next.username = value;
            else if (field === "bio") next.bio = value;
            else if (field === "telegram") next.telegram = value;
            else if (field === "twitter") next.twitter = value;
            else if (field === "discord") next.discord = value;
          });
          return next;
        });
      } catch (error) {
        console.error("Failed to update profile:", error);
        return;
      }
    }

    onClose();
  };

  const handleCopyWallet = () => {
    if (!walletFull) return;
    navigator.clipboard.writeText(walletFull);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogOut = () => {
    onClose();
    logout();
  };

  const bioLength = bio.length;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]" aria-hidden onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4 pointer-events-none">
        <div
          className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-b from-[#1A1B2E] via-[#16172A] to-[#1A1B2E] shadow-2xl text-white pointer-events-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-fuchsia-500/15 via-purple-500/10 to-indigo-500/15 blur-2xl" />

          {/* Header */}
          <div className="relative flex items-start justify-between gap-4 !pt-8 !px-8 !pb-2">
            <div className="flex flex-col gap-1 w-full items-center">
              <h2 className="text-2xl font-semibold text-white" style={{ fontFamily: '"Tachyon W00 Light"' }}>
                Profile
              </h2>
              <p className="text-sm text-white/75" style={{ fontFamily: '"Bicyclette"' }}>
                Customize your public identity. Update avatar, bio, and social links.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 !p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative !px-8 !pb-8 flex flex-col sm:flex-row gap-8">
            {/* Left: Avatar + Wallet */}
            <div className="flex flex-col items-center sm:items-start gap-5 w-full sm:w-45 shrink-0">
              <div className="relative w-24 h-24 rounded-full border border-white/20 bg-black/50 overflow-hidden flex items-center justify-center ring-2 ring-white/5">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <img src={profile_icon} alt="Avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <label className="cursor-pointer font-medium text-white/90 !px-3 !py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 transition-colors uppercase tracking-wider">
                <span className="text-[10px]!">Upload avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAvatarFile(file);
                  }}
                />
              </label>

              <div className="w-full rounded-xl border border-white/10 bg-white/5 !p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/50 !mb-2">Connected Wallet</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-white/90 truncate flex-1">{walletShort || "—"}</span>
                  {walletFull && (
                    <button
                      type="button"
                      onClick={handleCopyWallet}
                      className="shrink-0 !p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                      aria-label="Copy address"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                {walletFull && (
                  <div className="flex items-center gap-2 !mt-2 text-xs text-white/70">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.2)]" />
                    <span>Verified & Active</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 !mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/15 bg-black/40 !px-4 !py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-fuchsia-500/30 transition-all"
                  style={{ fontFamily: '"Bicyclette"' }}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 !mb-1.5">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
                  placeholder="Tell the world about yourself..."
                  maxLength={BIO_MAX}
                  rows={3}
                  className="w-full rounded-xl border border-white/15 bg-black/40 !px-4 !py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-fuchsia-500/30 resize-none transition-all"
                  style={{ fontFamily: '"Bicyclette"' }}
                />
                <p className="text-[10px] text-white/45 !mt-1">{bioLength}/{BIO_MAX} characters</p>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 !mb-2">Social Links</label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#229ED9] flex items-center justify-center shrink-0">
                      <img src={telegram_icon} className="w-4 h-4 brightness-0 invert" alt="" />
                    </div>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="@username or t.me/username"
                      className="flex-1 rounded-xl border border-white/15 bg-black/40 !px-4 !py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-fuchsia-500/30 text-sm"
                      style={{ fontFamily: '"Bicyclette"' }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <img src={x_icon} className="w-4 h-4 brightness-0 invert" alt="" />
                    </div>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="@username or x.com/username"
                      className="flex-1 rounded-xl border border-white/15 bg-black/40 !px-4 !py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-fuchsia-500/30 text-sm"
                      style={{ fontFamily: '"Bicyclette"' }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0">
                      <img src={discord_icon} className="w-4 h-4 brightness-0 invert" alt="" />
                    </div>
                    <input
                      type="text"
                      value={discord}
                      onChange={(e) => setDiscord(e.target.value)}
                      placeholder="username#1234"
                      className="flex-1 rounded-xl border border-white/15 bg-black/40 !px-4 !py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-fuchsia-500/30 text-sm"
                      style={{ fontFamily: '"Bicyclette"' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="relative flex flex-wrap items-center justify-between gap-3 !px-8 !pb-8 !pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={handleLogOut}
              className="inline-flex items-center gap-2 !px-4 !py-4.5 rounded-xl bg-red-900/80 hover:bg-red-900 text-white text-xs font-medium uppercase tracking-wider transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-7! py-4.5! rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={handleSave}
                className="items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
