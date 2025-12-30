import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SilhouetteToVideoProps {
  onComplete?: () => void;
  autoPlay?: boolean;
  delay?: number;
}

/**
 * Component that slides in a silhouette image from the side,
 * then morphs/fades into a video
 */
export function SilhouetteToVideo({ 
  onComplete, 
  autoPlay = true,
  delay = 0 
}: SilhouetteToVideoProps) {
  const [showImage, setShowImage] = useState(autoPlay ? false : true);
  const [showVideo, setShowVideo] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;

    const startTimer = setTimeout(() => {
      setHasStarted(true);
      setShowImage(true); // Start showing image when animation begins
    }, delay);

    return () => clearTimeout(startTimer);
  }, [autoPlay, delay]);

  useEffect(() => {
    if (!hasStarted) return;

    // After image slides in (1.2s animation + 2s pause), transition to video
    const morphTimer = setTimeout(() => {
      setShowImage(false);
      setShowVideo(true);
    }, 3200); // 1.2s slide-in + 2s pause = 3.2s total

    return () => clearTimeout(morphTimer);
  }, [hasStarted]);

  useEffect(() => {
    if (showVideo && onComplete) {
      // Call onComplete when video starts playing
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(completeTimer);
    }
  }, [showVideo, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {showImage && (
          <motion.div
            key="silhouette"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{
              x: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
              opacity: { duration: 0.8 },
              exit: { duration: 0.6 }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src="/images/silhouette.png"
              alt="Silhouette"
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}

        {showVideo && (
          <motion.video
            key="video"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              mixBlendMode: "multiply",
            }}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/charcoal-animation.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>
        )}
      </AnimatePresence>
    </div>
  );
}

