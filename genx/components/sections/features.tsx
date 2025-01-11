"use client"
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Sparkles, Palette, Coins } from "lucide-react";

const features = [
  {
    title: "AI-Powered Creation",
    description: "Generate unique artwork using state-of-the-art AI models",
    icon: Sparkles,
  },
  {
    title: "Custom Styles",
    description: "Choose from various artistic styles or create your own",
    icon: Palette,
  },
  {
    title: "Instant Minting",
    description: "Mint your AI-generated artwork as NFTs with one click",
    icon: Coins,
  },
];

export function Features() {
  const [isInView, setIsInView] = useState<boolean[]>(new Array(features.length).fill(false));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Observe each card when it enters viewport (at least 50% visible)
  const observeCard = (index: number) => {
    const cardElement = cardRefs.current[index];
    if (!cardElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(cardElement);

    return () => observer.disconnect();
  };

  // Setup intersection observers on mount
  useEffect(() => {
    features.forEach((_, i) => {
      observeCard(i);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-20 px-4 relative">
      {/* Keyframes for fade-in + glowing border */}
      <style jsx global>{`
        @keyframes fadeInUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes glowingBorder {
          0% {
            border-color: #ff007f;
            box-shadow: 0 0 10px #ff007f;
          }
          50% {
            border-color: #ff00ff;
            box-shadow: 0 0 10px #ff00ff;
          }
          100% {
            border-color: #007fff;
            box-shadow: 0 0 10px #007fff;
          }
        }

        /* When .card-animate is applied, we do both fadeInUp once + continuous border glow */
        .card-animate {
          animation: fadeInUp 0.8s ease forwards,
            glowingBorder 2.5s ease-in-out 0.8s infinite alternate;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Create, Mint, Trade</h2>
          <p className="text-muted-foreground">
            Transform your ideas into unique NFT artwork
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const AnimatedIcon = feature.icon;
            return (
              <Card
                key={feature.title}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`
                  bg-transparent border-2 border-white
                  bg-white bg-opacity-5
                  ${isInView[index] ? "card-animate" : ""}
                  /* Hover animations: scale + shadow */
                  transition-transform
                  duration-300
                  hover:scale-[1.03]
                  hover:shadow-[0_0_15px_rgba(255,0,255,0.4)]
                  cursor-pointer
                `}
                style={{
                  // Stagger each card's fade start
                  animationDelay: `${index * 0.5}s`,
                }}
              >
                <CardHeader>
                  <AnimatedIcon className="h-10 w-10 mb-4 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
  