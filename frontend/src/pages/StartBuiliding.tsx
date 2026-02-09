import React from "react";
import { Zap, DollarSign, BarChart3, Cloud } from "lucide-react";
import { useNavigate } from "react-router";
import "../sass/StartBuilding.scss";
import { Button } from "../components/Button";

function FeatureCard({ icon: Icon, iconColor, title, description }) {
  return (
    <div className="feature-card">
      <div className={`feature-icon ${iconColor}`}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <div className="feature-content">
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
      </div>
    </div>
  );
}

function StartBuilding() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      iconColor: "icon-blue",
      title: "AI-POWERED CREATION",
      description: "Build 100% functional games in just a few prompts along the way",
    },
    {
      icon: DollarSign,
      iconColor: "icon-purple",
      title: "EARN REWARDS",
      description: "The sky is the limit with our game. The sky is rewards sky sky sky!",
    },
    {
      icon: BarChart3,
      iconColor: "icon-pink",
      title: "ANALYTICS & SUPPORT",
      description: "Track player engagement & get insights with our AI analytic support",
    },
    {
      icon: Cloud,
      iconColor: "icon-blue",
      title: "ONE-CLICK DEPLOY",
      description: "Deploy games to the web and share them instantly",
    },
  ];

  return (
    <div className="start-building-section">
      <div className="hero-content">
        <h1 className="hero-title">
          BUILD GREAT GAMES,
          <br />
          EARN REWARDS
        </h1>
        <p className="hero-subtitle">
          Build your dream games in minutes using AI prompts along the way
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      <Button className="text-white gap-3!" onClick={() => navigate("/create")}>
        <Zap size={20} />
        START BUILDING
      </Button>
    </div>
  );
}

export default StartBuilding;