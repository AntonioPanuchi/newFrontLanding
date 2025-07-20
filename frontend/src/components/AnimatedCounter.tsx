import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useReducedMotion,
} from "framer-motion";

interface AnimatedCounterProps {
  to: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  to,
  duration = 1.2,
  format = (n) => Math.round(n).toString(),
  className = "",
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : 0);

  useEffect(() => {
    if (inView && !reduceMotion) {
      controls.start({ count: to, transition: { duration, ease: "easeOut" } });
    } else if (inView && reduceMotion) {
      setValue(to);
    }
  }, [inView, to, controls, duration, reduceMotion]);

  useEffect(() => {
    if (!reduceMotion) {
      controls.set({ count: 0 });
      controls.stop();
      controls.start({
        count: to,
        transition: { duration, ease: "easeOut" },
      });
    }
  }, [to, controls, duration, reduceMotion]);

  return (
    <motion.span
      ref={ref}
      className={className}
      animate={controls}
      initial={{ count: 0 }}
      onUpdate={(latest) => {
        if (typeof latest.count === "number") setValue(latest.count);
      }}
    >
      {format(value)}
    </motion.span>
  );
};

export default AnimatedCounter;
