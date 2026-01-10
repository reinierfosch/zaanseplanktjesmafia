import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SilhouetteToVideoProps {
  onComplete?: () => void;
  onZoomToButton?: () => void; // Callback when zoom animation should start
  autoPlay?: boolean;
  delay?: number;
  stopAfterSeconds?: number; // Stop video after this many seconds (default: 5 seconds)
}

/**
 * Component that slides in a silhouette image from the side,
 * then morphs/fades into a video that stops after a set duration,
 * then zooms to the HOME button
 */
export function SilhouetteToVideo({ 
  onComplete, 
  onZoomToButton,
  autoPlay = true,
  delay = 0,
  stopAfterSeconds = 5
}: SilhouetteToVideoProps) {
  const [showImage, setShowImage] = useState(autoPlay ? false : true);
  const [showVideo, setShowVideo] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [zoomToButton, setZoomToButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (showVideo && videoRef.current) {
      const video = videoRef.current;
      
      // Start playing the video
      video.play().catch(console.error);

      // Stop the video after stopAfterSeconds, then zoom to button
      const stopTimer = setTimeout(() => {
        video.pause();
        video.currentTime = video.duration; // Seek to end
        
        // Start zoom animation to HOME button
        setShowVideo(false);
        setZoomToButton(true);
        if (onZoomToButton) {
          onZoomToButton();
        }
      }, stopAfterSeconds * 1000);

      return () => clearTimeout(stopTimer);
    }
  }, [showVideo, stopAfterSeconds, onZoomToButton]);

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
    <>
      <div ref={containerRef} className="relative w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {showImage && !zoomToButton && (
            <motion.div
              key="silhouette"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 1.1,
                transition: { duration: 0.6 }
              }}
              transition={{
                x: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { duration: 0.8 }
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

          {showVideo && !zoomToButton && (
            <motion.video
              ref={videoRef}
              key="video"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                mixBlendMode: "multiply",
              }}
              muted
              playsInline
            >
              <source src="/videos/charcoal-animation.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </motion.video>
          )}
        </AnimatePresence>
      </div>

      {/* Zooming silhouette to HOME button */}
      {zoomToButton && (
        <motion.div
          initial={{ 
            position: "fixed",
            top: "50%",
            right: "20%",
            width: "40vw",
            height: "40vw",
            zIndex: 1000,
            x: 0,
            y: 0
          }}
          animate={{
            position: "fixed",
            top: "var(--nav-top, 60px)",
            left: "8px",
            width: "32px",
            height: "32px",
            zIndex: 1000,
            x: 0,
            y: 0
          }}
          transition={{
            duration: 1.5,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="pointer-events-none"
          onAnimationComplete={() => {
            // Animation complete, icon will stay in button
            if (onComplete) {
              onComplete();
            }
          }}
        >
          <img
            src="/images/silhouette.png"
            alt="Silhouette"
            className="w-full h-full object-contain"
          />
        </motion.div>
      )}
    </>
  );
}

