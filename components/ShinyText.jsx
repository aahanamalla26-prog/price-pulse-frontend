const ShinyText = ({ text, disabled = false, speed = 3, className = '' }) => {
    return (
      <div
        className={`inline-block ${className}`}
        style={{
          backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: disabled ? 'none' : `shine ${speed}s linear infinite`,
        }}
      >
        {text}
        <style>{`
          @keyframes shine {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
        `}</style>
      </div>
    );
  };
  
  export default ShinyText;