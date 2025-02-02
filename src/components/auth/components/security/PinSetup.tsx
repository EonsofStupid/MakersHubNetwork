import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { PinSetupForm } from "./pin/PinSetupForm";

export const PinSetup = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#41f0db] via-[#ff0abe] to-[#8000ff] text-transparent bg-clip-text animate-gradient">
            MakersImpulse
          </h1>
          <h2 className="text-xl font-semibold text-primary">
            ULTRASECURE LOCKNKEY
          </h2>
          <CardDescription>
            Set up your 4-digit PIN for quick access
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <PinSetupForm />
      </CardContent>
    </Card>
  );
};