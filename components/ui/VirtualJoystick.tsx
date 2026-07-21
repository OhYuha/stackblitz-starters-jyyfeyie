'use client';

import { useState, useRef, TouchEvent } from 'react';
import { useGameStore } from '@/lib/store';

export default function VirtualJoystick() {
  const setJoystickInput = useGameStore((state) => state.setJoystickInput);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handlePosition, setHandlePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const radius = 40; // 조이스틱 최대 이동 반경

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0]);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    updatePosition(e.touches[0]);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setHandlePosition({ x: 0, y: 0 });
    setJoystickInput({ x: 0, y: 0 });
  };

  const updatePosition = (touch: React.Touch) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = touch.clientX - centerX;
    let deltaY = touch.clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > radius) {
      deltaX = (deltaX / distance) * radius;
      deltaY = (deltaY / distance) * radius;
    }

    setHandlePosition({ x: deltaX, y: deltaY });
    // Normalize to -1 ~ 1
    setJoystickInput({
      x: deltaX / radius,
      y: deltaY / radius,
    });
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="absolute bottom-10 left-10 z-20 w-28 h-28 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 flex items-center justify-center touch-none md:hidden"
    >
      {/* 조이스틱 손잡이 */}
      <div
        className="w-12 h-12 bg-white/80 rounded-full shadow-lg transition-transform duration-75"
        style={{
          transform: `translate(${handlePosition.x}px, ${handlePosition.y}px)`,
        }}
      />
    </div>
  );
}
