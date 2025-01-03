import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Create, Mint, Trade</h2>
          <p className="text-muted-foreground">Transform your ideas into unique NFT artwork</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2">
              <CardHeader>
                <feature.icon className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}