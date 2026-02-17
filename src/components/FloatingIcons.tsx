import React from 'react'

interface FloatingIcon {
  emoji: string
  top: string
  left: string
  delay: number
  duration: number
}

const icons: FloatingIcon[] = [
  { emoji: '🧘', top: '10%', left: '15%', delay: 0, duration: 6 },
  { emoji: '🧠', top: '25%', left: '80%', delay: 1, duration: 7 },
  { emoji: '🌿', top: '60%', left: '10%', delay: 2, duration: 8 },
  { emoji: '❤️', top: '75%', left: '75%', delay: 0.5, duration: 6.5 },
  { emoji: '🪷', top: '45%', left: '5%', delay: 1.5, duration: 7.5 },
  { emoji: '✨', top: '20%', left: '50%', delay: 0.8, duration: 6.8 },
  { emoji: '🌸', top: '70%', left: '50%', delay: 1.2, duration: 7.2 },
  { emoji: '🌱', top: '35%', left: '90%', delay: 0.3, duration: 6.3 },
]

export const FloatingIcons: React.FC = () => {
  return (
    <>
      {icons.map((icon, i) => (
        <div
          key={i}
          className="floating-icon"
          style={{
            position: 'absolute',
            top: icon.top,
            left: icon.left,
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            pointerEvents: 'none',
            animation: `float ${icon.duration}s ease-in-out infinite`,
            animationDelay: `${icon.delay}s`,
            transform: 'rotate(0deg)',
          }}
        >
          {icon.emoji}
        </div>
      ))}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.8;
          }
          25% {
            transform: translateY(-15px) rotate(3deg);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-25px) rotate(-2deg);
            opacity: 1;
          }
          75% {
            transform: translateY(-10px) rotate(2deg);
            opacity: 0.9;
          }
        }
        
        @media (max-width: 768px) {
          .floating-icon {
            width: 40px !important;
            height: 40px !important;
            font-size: 20px !important;
          }
        }
      `}</style>
    </>
  )
}
