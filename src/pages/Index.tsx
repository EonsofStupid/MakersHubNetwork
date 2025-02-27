
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MainNav } from "@/components/MainNav";

const IndexPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <MainNav />
      
      {/* Cyberpunk background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 50%)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              mixBlendMode: 'screen',
            }}
          />
        </div>
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
          }}
        />
      </div>

      <div className="container mx-auto p-6 space-y-8 pt-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-bold bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent relative group">
            Build.Share.Brag
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm bg-gradient-to-r from-primary via-white to-secondary" />
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your ultimate hub for 3D printer builds, customization, and community
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card className="cyber-card cyber-glow p-6 space-y-4">
            <h2 className="text-2xl font-heading font-bold text-gradient">3D Printer Builder</h2>
            <p className="text-muted-foreground">Design your custom 3D printer with our interactive builder tool.</p>
          </Card>

          <Card className="cyber-card cyber-glow p-6 space-y-4">
            <h2 className="text-2xl font-heading font-bold text-gradient">Parts Catalog</h2>
            <p className="text-muted-foreground">Explore our curated collection of high-quality printer parts.</p>
          </Card>

          <Card className="cyber-card cyber-glow p-6 space-y-4">
            <h2 className="text-2xl font-heading font-bold text-gradient">Community Builds</h2>
            <p className="text-muted-foreground">Get inspired by amazing builds from the community.</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default IndexPage;
