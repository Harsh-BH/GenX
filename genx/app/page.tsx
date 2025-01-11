"use client"
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Features } from "@/components/sections/features";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Loader from "@/components/Loader";
import { Canvas } from "@react-three/fiber";

import dynamic from "next/dynamic";

const Ship = dynamic(() => import("@/model/Ship"), {
  ssr: false,
});

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);

  // ---- Background Random Shapes State ----
  const [randomShapes, setRandomShapes] = useState<
    { left: number; top: number; id: number }[]
  >([]);

  useEffect(() => {
    // Hide the loader after 2.5 seconds
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Generate random positions for background SVG shapes
  useEffect(() => {
    const shapesCount = 8;
    const shapesArray = [];
    for (let i = 0; i < shapesCount; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      shapesArray.push({ left, top, id: i });
    }
    setRandomShapes(shapesArray);
  }, []);

  // Sparkle effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const sparkle = document.createElement("div");
      sparkle.className = `
        pointer-events-none
        absolute
        rounded-full
        opacity-800
        animate-pulse
        transition-all
        duration-500
        ease-out
      `;

      const colors = [
        "bg-pink-500",
        "bg-yellow-400",
        "bg-blue-400",
        "bg-purple-500",
        "bg-red-400",
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      sparkle.classList.add(randomColor);

      const size = Math.floor(Math.random() * 10) + 10;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.left = `${e.pageX}px`;
      sparkle.style.top = `${e.pageY}px`;
      sparkle.style.zIndex = "9999";
      sparkle.style.transform = "translate(-50%, -50%)";

      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.style.opacity = "0";
        setTimeout(() => sparkle.remove(), 500);
      }, 300);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Example NFT data
  const featuredNFTs = [
    {
      imageUrl:
        "https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30633.jpg",
      title: "Cosmic Dreams #001",
      price: "0.85",
    },
    {
      imageUrl:
        "https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30633.jpg",
      title: "Cosmic Dreams #002",
      price: "0.85",
    },
    {
      imageUrl:
        "https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30633.jpg",
      title: "Cosmic Dreams #003",
      price: "0.85",
    },
    {
      imageUrl:
        "https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30633.jpg",
      title: "Cosmic Dreams #004",
      price: "0.85",
    },
    {
      imageUrl:
        "https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30633.jpg",
      title: "Cosmic Dreams #005",
      price: "0.85",
    },
    {
      imageUrl:
        "https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30633.jpg",
      title: "Cosmic Dreams #006",
      price: "0.85",
    },
  ];

  const animations = ["Animation"];

  return (
    <>
      <style jsx global>{`
        /* Fade-in-up keyframe */
        @keyframes fadeInUp {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .fadeInUp {
          animation: fadeInUp 1s ease-in-out forwards;
        }

        /* Text Glow keyframe */
        @keyframes textGlow {
          0% {
            text-shadow: 0 0 8px #ff00ff;
          }
          50% {
            text-shadow: 0 0 16px #ff00ff;
          }
          100% {
            text-shadow: 0 0 8px #ff00ff;
          }
        }
        .textGlow {
          animation: textGlow 2s ease-in-out infinite alternate;
        }

        /* Example spin (optional for your SVG shapes) */
        @keyframes spin {
          0% {
            transform: rotate(0deg) translate(-50%, -50%);
          }
          100% {
            transform: rotate(360deg) translate(-50%, -50%);
          }
        }
      `}</style>

      {showLoader ? (
        <Loader />
      ) : (
        <>
          {/* Random SVG background shapes */}
          <div
            className="pointer-events-none fixed top-0 left-0 w-full h-full overflow-hidden"
            aria-hidden="true"
          >
            {randomShapes.map((shape) => (
              <svg
                key={shape.id}
                style={{
                  position: "absolute",
                  left: `${shape.left}%`,
                  top: `${shape.top}%`,
                  animation: "spin 50s linear infinite",
                }}
                width="120"
                height="120"
                viewBox="0 0 200 200"
                fill="none"
                className="opacity-30 animate-pulse"
              >
                <path
                  fill="#723BDC"
                  d="M48.3,-60.1C58.3,-48.6,61.6,-30.1,67.6,-11.7C73.6,6.8,82.2,25.1,77.8,37.1C73.4,49.1,55.8,54.7,40.4,62.2C25,69.8,12.5,79.3,-4.3,85.4C-21.2,91.5,-42.4,94.1,-57.1,86.9C-71.8,79.7,-80.1,62.5,-85.3,45.2C-90.6,28,-92.9,10.6,-84,-0.8C-75.1,-12.3,-55,-17.8,-41,-31.3C-27.1,-44.8,-19.4,-66.3,-5.2,-74.8C8.9,-83.2,17.8,-78.6,30.1,-71.4C42.3,-64.2,57.8,-54.3,48.3,-60.1Z"
                  transform="translate(100 100)"
                />
              </svg>
            ))}
          </div>

          {/* Main container with gradient background */}
          <div className="relative min-h-screen bg-gradient-to-b from-background to-secondary/20">
            <Navbar />

            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                {/* FLEX CONTAINER for left (text/carousel) & right (model) columns */}
                <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-8">

                  {/* LEFT SIDE: Text, Headings, and Carousel */}
                  <div className="md:w-[55%] w-full">
                    <div className="text-center mb-16 relative">
                      <div className="fadeInUp">
                        <h1
                          className="
                            text-5xl
                            font-bold
                            mb-6
                            bg-gradient-to-r
                            from-purple-600
                            to-pink-600
                            bg-clip-text
                            text-transparent
                            textGlow
                            hover:scale-105
                            transition-transform
                            duration-300
                          "
                        >
                          AI-Generated NFT Marketplace
                        </h1>

                        <p
                          className="
                            text-xl
                            text-muted-foreground
                            mb-8
                            fadeInUp
                            mt-4
                          "
                          style={{ animationDelay: "0.3s" }}
                        >
                          Create unique, AI-generated artwork and mint it as NFTs
                          instantly
                        </p>

                        <Link
                          href="/generate"
                          className="
                            inline-block
                            bg-gradient-to-r
                            from-purple-600
                            to-pink-600
                            rounded-lg
                            px-4
                            py-3
                            text-xl
                            font-semibold
                            text-white
                            hover:scale-105
                            hover:translate-y-[-3px]
                            transition-all
                            duration-300
                          "
                          style={{ animationDelay: "0.6s" }}
                        >
                          Start Creating
                        </Link>
                      </div>
                    </div>

                    {/* Carousel of featured NFTs */}
                    <div className="w-full flex justify-center items-center">
                      <Carousel
                        opts={{
                          align: "start",
                        }}
                        className="w-full max-w-2xl"
                      >
                        <CarouselContent>
                          {featuredNFTs.map((nft, index) => (
                            <CarouselItem
                              key={index}
                              className="md:basis-1/2 lg:basis-1/3"
                            >
                              <div className="p-2 hover:scale-[1.02] transition-transform">
                                <Card className="shadow-lg hover:shadow-xl">
                                  <CardContent className="flex flex-col items-center justify-center p-4">
                                    <img
                                      className="rounded-lg w-40 h-40"
                                      src={nft.imageUrl}
                                      alt={nft.title}
                                    />
                                    <span className="text-md font-semibold mt-3">
                                      {nft.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {nft.price} ETH
                                    </span>
                                    <Button className="font-semibold w-full mt-3 hover:scale-105 transition-transform">
                                      Check Out
                                    </Button>
                                  </CardContent>
                                </Card>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </div>
                  </div>

                  {/* RIGHT SIDE: 3D Model */}
                  <div className="md:w-[40%] w-full h-[400px] md:h-[700px] mx-auto">
                    <Canvas
                      shadows
                      camera={{ position: [0, 0, 5], fov: 50 }}
                      className="w-full h-full"
                    >
                      <ambientLight intensity={0.5} />
                      <directionalLight
                        position={[5, 10, 5]}
                        intensity={5}
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                        shadow-camera-near={0.5}
                        shadow-camera-far={50}
                        shadow-camera-left={-10}
                        shadow-camera-right={10}
                        shadow-camera-top={10}
                        shadow-camera-bottom={-10}
                      />
                      <pointLight position={[0, 10, 10]} intensity={1} />
                      <pointLight position={[0, -10, -10]} intensity={0.5} />
                      <Suspense fallback={null}>
                        <Ship
                          position={[0, -3, 1.2]}
                          rotation={[0, -1.8, 0]}
                          scale={[0.9,0.9,0.9]}
                          castShadow
                          receiveShadow
                          animation={animations[0]}
                        />
                        <mesh
                          position={[0, -3.5, 0]}
                          rotation={[-Math.PI / 2, 0, 0]}
                          receiveShadow
                        >
                          <planeGeometry args={[50, 50]} />
                            <shadowMaterial opacity={0.5} />

                        </mesh>
                      </Suspense>
                    </Canvas>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
              <Features />
          </div>
        </>
      )}
    </>
  );
}
