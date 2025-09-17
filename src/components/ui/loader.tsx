import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function Loader({ size = 'md', className, text }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={cn(
          "animate-spin text-primary",
          sizeClasses[size]
        )} />
      </motion.div>
      {text && (
        <span className={cn("text-muted-foreground", textSizes[size])}>
          {text}
        </span>
      )}
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader size="lg" text="Loading..." />
    </div>
  );
}
