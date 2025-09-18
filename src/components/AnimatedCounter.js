import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ 
  value, 
  duration = 1000, 
  formatFunction = (val) => val.toLocaleString(),
  className = "",
  prefix = "",
  suffix = ""
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  // Use Framer Motion's spring for smooth animation
  const spring = useSpring(value, {
    duration: duration,
    bounce: 0.1
  });

  const animatedValue = useTransform(spring, (latest) => {
    return Math.round(latest);
  });

  useEffect(() => {
    const unsubscribe = animatedValue.onChange((latest) => {
      setDisplayValue(latest);
    });

    return unsubscribe;
  }, [animatedValue]);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span 
      className={className}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.3 }}
      key={value} // This ensures animation triggers on value change
    >
      {prefix}{formatFunction(displayValue)}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;