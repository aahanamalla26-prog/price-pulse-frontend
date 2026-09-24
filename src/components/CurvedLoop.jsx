import React, { useState } from "react";
import SplitText from "./SplitText";
import ShinyText from "./ShinyText";

const CurvedLoop = ({
  marqueeText = "Welcome to React Bits ✦",
  speed = 2,
  curveAmount = 400,
  direction = "right",
  interactive = true,
  className = ""
}) => {
  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', textAlign: 'center' }}>
      <div 
        className={className}
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: `marquee-${direction} ${10 / speed}s linear infinite`,
          cursor: interactive ? 'pointer' : 'default',
        }}
      >
        {marqueeText}
      </div>
      <style>{`
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default CurvedLoop;