
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Database, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";

const ImportManager = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-transparent p-4 rounded-lg">
        <Upload className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading">
          <SimpleCyberText text="Data Import" />
        </h2>
      </div>
      
      <motion.div variants={itemVariants}>
        <Card className="cyber-card border-primary/20">
          <CardHeader className="border-b border-primary/10 bg-primary/5">
            <CardTitle className="text-gradient flex items-center gap-2">
              <Database className="h-5 w-5" /> Import Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="p-8 border-2 border-dashed border-primary/20 rounded-lg text-center hover:border-primary/40 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-primary/60 mb-4" />
                <p className="mb-4 text-muted-foreground">
                  Drag and drop files here or click to browse
                </p>
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                  <FileText className="h-4 w-4 mr-2" /> Select Files
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-medium mb-1">User Data</h3>
                  <p className="text-sm text-muted-foreground">Import user profiles and accounts</p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-medium mb-1">Product Catalog</h3>
                  <p className="text-sm text-muted-foreground">Import products and categories</p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-medium mb-1">Configuration</h3>
                  <p className="text-sm text-muted-foreground">Import system settings</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ImportManager;
