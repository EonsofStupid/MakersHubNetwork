import { Star, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const FeaturedContent = () => {
  const featuredItems = [
    {
      title: "Popular Builds",
      description: "Discover trending 3D printer builds from our community",
      icon: Star,
      gradient: "from-primary to-secondary",
    },
    {
      title: "Featured Makers",
      description: "Learn from experienced builders and their successful projects",
      icon: Award,
      gradient: "from-secondary to-primary",
    },
  ];

  return (
    <section className="py-24 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Content</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {featuredItems.map((item, index) => (
            <Card 
              key={item.title}
              className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-background/60 backdrop-blur-sm border-primary/20"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.gradient} p-2 mb-4`}>
                  <item.icon className="w-full h-full text-white" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Content will be dynamically loaded */}
                <div className="h-48 rounded-lg bg-muted/50 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};