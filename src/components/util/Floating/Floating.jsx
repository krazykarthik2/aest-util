import React, { useEffect, useRef, useState } from 'react';

const FloatingComponent = ({ children }) => {
  const parentRef = useRef(null);
  const [positions, setPositions] = useState(
    Array(children.length).fill(null)
  );
  const [velocities, setVelocities] = useState(
    Array(children.length).fill(null)
  );

  useEffect(() => {
    const getRandomVelocity = () => {
      const randomSpeed = () => (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1);
      return { dx: randomSpeed(), dy: randomSpeed() };
    };

    const getRandomPositionEfficient = (parentWidth, parentHeight, size, threshold, numChildren) => {
      const positions = [];
      for (let i = 0; i < numChildren; i++) {
        let attempts = 0;
        let position;
        do {
          position = {
            top: Math.random() * (parentHeight - size),
            left: Math.random() * (parentWidth - size),
          };
          attempts++;
        } while (
          positions.some((pos) =>
            Math.abs(pos.top - position.top) < threshold &&
            Math.abs(pos.left - position.left) < threshold
          ) && attempts < 10
        );
        positions.push(position);
      }
      return positions;
    };

    if (!parentRef.current) return;
    const parent = parentRef.current;
    const parentRect = parent.getBoundingClientRect();
    const elementSize = 50; // Assuming all elements are 50x50
    const threshold = 100; // Minimum distance between elements

    const initialPositions = getRandomPositionEfficient(
      parentRect.width,
      parentRect.height,
      elementSize,
      threshold,
      children.length
    );

    const initialVelocities = Array(children.length).fill(null).map(getRandomVelocity);
    
    setPositions(initialPositions);
    setVelocities(initialVelocities);
  }, [children.length, parentRef]);

  useEffect(() => {
    const moveElements = () => {
      if (!parentRef.current) return;

      const parent = parentRef.current;
      const parentRect = parent.getBoundingClientRect();
      const elementSize = 50; // Assuming all elements are 50x50

      setPositions((prevPositions) => {
        return prevPositions.map((pos, index) => {
          if (!pos) return null;

          const velocity = velocities[index];
          let newTop = pos.top + velocity.dy;
          let newLeft = pos.left + velocity.dx;

          if (newTop <= 0 || newTop + elementSize >= parentRect.height) {
            velocities[index].dy *= -1;
          }
          if (newLeft <= 0 || newLeft + elementSize >= parentRect.width) {
            velocities[index].dx *= -1;
          }

          return {
            top: Math.min(
              Math.max(0, newTop),
              parentRect.height - elementSize
            ),
            left: Math.min(
              Math.max(0, newLeft),
              parentRect.width - elementSize
            ),
          };
        });
      });
    };

    const interval = setInterval(moveElements, 16); // ~60fps

    return () => clearInterval(interval);
  }, [velocities, children.length]);

  return (
    <div ref={parentRef} className="parent-container w-full" style={{height:"500px"}}>
      {children.map((child, index) => (
        <div
          key={index}
          className="floating-element"
          style={{
            top: positions[index]?.top,
            left: positions[index]?.left,
            position: 'absolute',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default FloatingComponent;
