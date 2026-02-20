'use client'

import React from 'react'
import { 
  YogaIcon3D, 
  BrainIcon3D, 
  LeafIcon3D, 
  HeartIcon3D, 
  LotusIcon3D, 
  SparkleIcon3D, 
  FlowerIcon3D, 
  SeedlingIcon3D 
} from './Icons3D'

interface FloatingIcon {
  Icon: React.FC<{ size?: number; className?: string }>
  top: string
  left: string
  delay: number
  duration: number
}

const icons: FloatingIcon[] = [
  { Icon: YogaIcon3D, top: '10%', left: '15%', delay: 0, duration: 6 },
  { Icon: BrainIcon3D, top: '25%', left: '80%', delay: 1, duration: 7 },
  { Icon: LeafIcon3D, top: '60%', left: '10%', delay: 2, duration: 8 },
  { Icon: HeartIcon3D, top: '75%', left: '75%', delay: 0.5, duration: 6.5 },
  { Icon: LotusIcon3D, top: '45%', left: '5%', delay: 1.5, duration: 7.5 },
  { Icon: SparkleIcon3D, top: '20%', left: '50%', delay: 0.8, duration: 6.8 },
  { Icon: FlowerIcon3D, top: '70%', left: '50%', delay: 1.2, duration: 7.2 },
  { Icon: SeedlingIcon3D, top: '35%', left: '90%', delay: 0.3, duration: 6.3 },
]

export const FloatingIcons: React.FC = () => {
  return (
    <>
      {icons.map((icon, i) => (
        <div
          key={i}
          className="floating-icon floating-3d"
          style={{
            position: 'absolute',
            top: icon.top,
            left: icon.left,
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            animation: `float3D ${icon.duration}s ease-in-out infinite`,
            animationDelay: `${icon.delay}s`,
            transform: 'translateZ(0)',
          }}
        >
          <icon.Icon size={32} />
        </div>
      ))}
      <style>{`
        @keyframes float3D {
          0%, 100% {
            transform: translateY(0px) translateZ(0) rotate(0deg) scale(1);
            opacity: 0.85;
          }
          25% {
            transform: translateY(-18px) translateZ(10px) rotate(3deg) scale(1.02);
            opacity: 0.95;
          }
          50% {
            transform: translateY(-28px) translateZ(20px) rotate(-2deg) scale(1.04);
            opacity: 1;
          }
          75% {
            transform: translateY(-12px) translateZ(8px) rotate(2deg) scale(1.01);
            opacity: 0.9;
          }
        }
        
        .floating-icon {
          transform-style: preserve-3d;
          perspective: 500px;
        }
        
        @media (max-width: 768px) {
          .floating-icon {
            width: 44px !important;
            height: 44px !important;
          }
        }
      `}</style>
    </>
  )
}
