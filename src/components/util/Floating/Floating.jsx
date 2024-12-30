import React, { useCallback, useEffect, useRef, useState } from "react";
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
  positions = []
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
  const childRefs = useRef([]);
  const [positions, setPositions] = useState(
    Array(domChildren.length).fill(null)
  );
  const [velocities, setVelocities] = useState(
    Array(domChildren.length).fill(null)
  );
  const [cursorObjPosition, setCursorObjPosition] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });
  const cursorObjRef = useRef(null);
  useEffect(() => {
    let __domChildren = [];
    let __velocities = [];
    let __positions = [];
    const childrenKeys = children.map((e) => e.key);
    for (let i = 0; i < domChildren.length; i++) {
      if (childrenKeys.includes(domChildren[i].key)) {
        __domChildren.push(domChildren[i]);
        __velocities.push(velocities[i]);
        __positions.push(positions[i]);
      } else {
        console.log("removing-", domChildren[i].key);
      }
    }
    const __domChildrenKeys = __domChildren.map((e) => e.key);
    for (let i = 0; i < children.length; i++) {
      if (__domChildrenKeys.includes(children[i].key)) {
      } else {
        __domChildren.push(children[i]);
        __velocities.push(getRandomVelocity());
        __positions = getRandomPositionEfficient(
          parentRef.current.offsetWidth,
          parentRef.current.offsetHeight,
          50,
          50,
          __domChildren.length,
          __positions
        );
      }
    }
    setDomChildren(__domChildren);
    setPositions(__positions);
    setVelocities(__velocities);
  }, [
    domChildren.length,
    velocities.length,
    positions.length,
    children.length,
  ]);

  const collisionWithCursor = useCallback(
    (newLeftmost, newRightmost, newTopmost, newBottommost, parentRect) => {
      if (
        newLeftmost <
          parentRect.left + cursorObjPosition.x + cursorObjPosition.w &&
        newRightmost > parentRect.left + cursorObjPosition.x &&
        newTopmost <
          parentRect.top + cursorObjPosition.y + cursorObjPosition.h &&
        newBottommost > parentRect.top + cursorObjPosition.y
      ) {
        return true;
      }
      return false;
    },
    [cursorObjPosition]
  );
  useEffect(() => {
    const moveElements = () => {
      if (!parentRef.current) return;
      if (!cursorObjRef.current) return;
      const parent = parentRef.current;
      const parentRect = parent.getBoundingClientRect();

      const collisionWithPrev = (
        index,
        newLeftmost,
        newRightmost,
        newTopmost,
        newBottommost
      ) => {
        for (let i = 0; i < index; i++) {
          const prevRect = childRefs.current[i].getBoundingClientRect();
          if (
            newLeftmost < prevRect.right &&
            newRightmost > prevRect.left &&
            newTopmost < prevRect.bottom &&
            newBottommost > prevRect.top
          ) {
            return index;
          }
        }
        return -1;
      };

      for (let i = 0; i < domChildren.length; i++) {
        const child = childRefs.current[i];
        if (!child) continue;

        const childRect = child.getBoundingClientRect();

        const dx = velocities[i].dx;
        const dy = velocities[i].dy;

        const newLeftmost = childRect.left + dx;
        const newRightmost = childRect.right + dx;
        const newTopmost = childRect.top + dy;
        const newBottommost = childRect.bottom + dy;

        if (
          newLeftmost < parentRect.left ||
          newRightmost > parentRect.width + parentRect.left
        ) {
          velocities[i].dx = -dx;
        }
        if (
          newTopmost < parentRect.top ||
          newBottommost > parentRect.height + parentRect.top
        ) {
          velocities[i].dy = -dy;
        }

        let indexColliding = collisionWithPrev(
          i,
          newLeftmost,
          newRightmost,
          newTopmost,
          newBottommost
        );

        if (indexColliding != -1) {
          velocities[i].dx = -dx;
          velocities[i].dy = -dy;
        }

        if (
          collisionWithCursor(
            newLeftmost,
            newRightmost,
            newTopmost,
            newBottommost,
            parentRect
          )
        ) {
          velocities[i].dx = -dx;
          velocities[i].dy = -dy;
        }
      }

      setPositions((prevPositions) => {
        return prevPositions.map((pos, i) => {
          const dx = velocities[i].dx;
          const dy = velocities[i].dy;
          return {
            top: Math.min(
              parentRect.height + parentRect.top,
              Math.max(0, pos.top + dy)
            ),
            left: Math.min(
              parentRect.width + parentRect.left,
              Math.max(0, pos.left + dx)
            ),
          };
        });
      });
      setVelocities(velocities);
    };

    const interval = setInterval(moveElements, 16); // ~60fps

    return () => clearInterval(interval);
  }, [domChildren.length]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!parentRef.current) return;
      if (!cursorObjRef.current) return;
      setCursorObjPosition({
        x:
          e.clientX -
          parentRef.current.getBoundingClientRect().left -
          cursorObjRef.current.offsetWidth / 2,
        y:
          e.clientY -
          parentRef.current.getBoundingClientRect().top -
          cursorObjRef.current.offsetHeight / 2,
        w: cursorObjRef.current.offsetWidth,
        h: cursorObjRef.current.offsetHeight,
      });
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);
  return (
    <div
      ref={parentRef}
      className="parent-container w-full border border-white relative  overflow-hidden"
      style={{ height: "500px" }}
    >
      <div
        ref={cursorObjRef}
        className="cursor-obj border border-white absolute w-10 h-10"
        style={{
          top: cursorObjPosition.y,
          left: cursorObjPosition.x,
          transform: "translate3d(0,0,0)",
        }}
      ></div>
      {domChildren.length}
      {domChildren.map((child, index) => (
        <div
          key={child?.render + index}
          ref={(el) => (childRefs.current[index] = el)}
          className="floating-element border border-white "
          style={{
            top: positions[index]?.top,
            left: positions[index]?.left,
            position: "absolute",
            transform: "translate3d(0,0,0)",
          }}
        >
          {children?.[index]?.el}
        </div>
      ))}
    </div>
  );
};

export default Floating;
