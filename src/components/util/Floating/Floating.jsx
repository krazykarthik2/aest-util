import React, { useEffect, useRef, useState } from "react";
const getRandomVelocity = () => {
  const randomSpeed = () =>
    (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1);
  return { dx: randomSpeed(), dy: randomSpeed() };
};
const getRandomPositionEfficient = (
  parentWidth,
  parentHeight,
  size,
  threshold,
  numChildren,
  positions=[]
) => {
  for (let i = positions.length; i < numChildren; i++) {
    let attempts = 0;
    let position;
    do {
      position = {
        top: Math.random() * (parentHeight - size),
        left: Math.random() * (parentWidth - size),
      };
      attempts++;
    } while (
      positions.some(
        (pos) =>
          Math.abs(pos.top - position.top) < threshold &&
          Math.abs(pos.left - position.left) < threshold
      ) &&
      attempts < 10
    );
    positions.push(position);
  }
  return positions;
};
const Floating = ({ children }) => {
  const [domChildren, setDomChildren] = useState([]);

  const parentRef = useRef(null);
  const [positions, setPositions] = useState(
    Array(domChildren.length).fill(null)
  );
  const [velocities, setVelocities] = useState(
    Array(domChildren.length).fill(null)
  );
  useEffect(() => {
    let __domChildren = [];
    let __velocities = [];
    let __positions = [];
    const childrenKeys = children.map(e=>e.key)
    for (let i = 0; i < domChildren.length; i++) {
      if (childrenKeys.includes(domChildren[i].key)) {
        __domChildren.push(domChildren[i]);
        __velocities.push(velocities[i]);
        __positions.push(positions[i]);
      }else{
        console.log('removing-',domChildren[i].key);
      }
    }
    const __domChildrenKeys = __domChildren.map(e=>e.key)
    for(let i = 0; i < children.length; i++){
      if(__domChildrenKeys.includes(children[i].key)){}
      else{
        __domChildren.push(children[i]);
        __velocities.push(getRandomVelocity());
        __positions=getRandomPositionEfficient(parentRef.current.offsetWidth, parentRef.current.offsetHeight, 50, 50, __domChildren.length,__positions)
      }
    }
    setDomChildren(__domChildren)
    setPositions(__positions)
    setVelocities(__velocities)
  }, [
    domChildren.length,
    velocities.length,
    positions.length,
    children.length,
  ]);


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
            top: Math.min(Math.max(0, newTop), parentRect.height - elementSize),
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
  }, [velocities, domChildren.length]);

  return (
    <div
      ref={parentRef}
      className="parent-container w-full"
      style={{ height: "500px" }}
    >
      {domChildren.length}
      {domChildren
        .map((e) => e.el)
        .map((child, index) => (
          <div
            key={index}
            className="floating-element"
            style={{
              top: positions[index]?.top,
              left: positions[index]?.left,
              position: "absolute",
            }}
          >
            {child}
          </div>
        ))}
    </div>
  );
};

export default Floating;
