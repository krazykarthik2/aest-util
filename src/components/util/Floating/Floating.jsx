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
  useEffect(() => {
    try {
    let __domChildren = [];
    let __velocities = [];
    let __positions = [];
    const childrenKeys = children?.map((e) => e.key);
    for (let i = 0; i < domChildren.length; i++) {
      if (childrenKeys.includes(domChildren[i].key)) {
        __domChildren.push(domChildren[i]);
        __velocities.push(velocities[i]);
        __positions.push(positions[i]);
      } else {
        console.log("removing-", domChildren[i].key);
      }
    }
    const __domChildrenKeys = __domChildren?.map((e) => e.key);
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
    } catch (error) {
      alert(error)
    }
  }, [
    domChildren.length,
    velocities.length,
    positions.length,
    children.length,
  ]);

  useEffect(() => {
    const moveElements = () => {
      try {
        if (!parentRef.current) return;
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
              return i;
            }
          }
          return -1;
        };

        for (let i = 0; i < domChildren.length; i++) {
          const child = childRefs.current[i];
          if (!velocities[i] || !child) continue;

          const childRect = child.getBoundingClientRect();

          {
            //if velocity is too low or too high, reset it
            const _predx = velocities[i].dx;
            const _predy = velocities[i].dy;
            if (
              Math.abs(_predx) < 0.2 ||
              Math.abs(_predx) > 2 ||
              Math.abs(_predy) < 0.2 ||
              Math.abs(_predy) > 2
            ) {
              velocities[i] = getRandomVelocity();
            }
          }

          let dx = velocities[i].dx;
          let dy = velocities[i].dy;

          let newLeftmost = childRect.left + dx;
          let newRightmost = childRect.right + dx;
          let newTopmost = childRect.top + dy;
          let newBottommost = childRect.bottom + dy;

          if (
            (newLeftmost < parentRect.left ||
              newRightmost > parentRect.width + parentRect.left) &&
            (newTopmost < parentRect.top ||
              newBottommost > parentRect.height + parentRect.top)
          ) {
            velocities[i] = getRandomVelocity();
            dx = velocities[i].dx;
            dy = velocities[i].dy;
          }
          newLeftmost = childRect.left + dx;
          newRightmost = childRect.right + dx;
          newTopmost = childRect.top + dy;
          newBottommost = childRect.bottom + dy;
          if (
            newLeftmost < parentRect.left ||
            newRightmost > parentRect.width + parentRect.left
          ) {
            velocities[i].dx *= -0.7;
          }

          newLeftmost = childRect.left + dx;
          newRightmost = childRect.right + dx;
          newTopmost = childRect.top + dy;
          newBottommost = childRect.bottom + dy;

          if (
            newTopmost < parentRect.top ||
            newBottommost > parentRect.height + parentRect.top
          ) {
            velocities[i].dy *= -0.7;
          }

          newLeftmost = childRect.left + dx;
          newRightmost = childRect.right + dx;
          newTopmost = childRect.top + dy;
          newBottommost = childRect.bottom + dy;

          let indexColliding = collisionWithPrev(
            i,
            newLeftmost,
            newRightmost,
            newTopmost,
            newBottommost
          );

          if (indexColliding !== -1) {
            console.log(
              i,
              "colliding-",
              indexColliding,
              velocities[indexColliding]
            );
            let dx = velocities[i].dx;
            let dy = velocities[i].dy;
            // Push the colliding children apart
            const overlapX =
              Math.min(
                newRightmost,
                childRefs.current[indexColliding].getBoundingClientRect().right
              ) -
              Math.max(
                newLeftmost,
                childRefs.current[indexColliding].getBoundingClientRect().left
              );
            const overlapY =
              Math.min(
                newBottommost,
                childRefs.current[indexColliding].getBoundingClientRect().bottom
              ) -
              Math.max(
                newTopmost,
                childRefs.current[indexColliding].getBoundingClientRect().top
              );

            // Horizontal collision
            velocities[indexColliding].dx *= -0.9;
            velocities[i].dx *= -0.9;

            // Push children apart horizontally
            if (Math.abs(dx) > 0.2) {
              newLeftmost -= overlapX / 2;
              newRightmost -= overlapX / 2;
            } else {
              newLeftmost += overlapX / 2 + 100;
              newRightmost += overlapX / 2 + 100;
            }
            velocities[indexColliding].dy *= -0.9;
            velocities[i].dy *= -0.9;

            // Push children apart vertically
            if (Math.abs(dy) > 0.2) {
              newTopmost -= overlapY / 2;
              newBottommost -= overlapY / 2;
            } else {
              newTopmost += overlapY / 2;
              newBottommost += overlapY / 2;
            }

            // Ensure children stay within bounds
            newLeftmost = Math.max(
              parentRect.left,
              Math.min(newLeftmost, parentRect.width - childRect.width)
            );
            newTopmost = Math.max(
              parentRect.top,
              Math.min(newTopmost, parentRect.height - childRect.height)
            );
          }
        }

        setPositions((prevPositions) => {
          return prevPositions.map((pos, i) => {
            if (!velocities[i]) return pos;
            const dx = velocities[i].dx;
            const dy = velocities[i].dy;
            return {
              top: Math.min(
                parentRect.height - childRefs.current[i].offsetHeight,
                Math.max(0, pos.top + dy)
              ),
              left: Math.min(
                parentRect.width - childRefs.current[i].offsetWidth,
                Math.max(0, pos.left + dx)
              ),
            };
          });
        });
        setVelocities(velocities);
      } catch (e) {
        console.log(e);
      }
    };

    const interval = setInterval(moveElements, 1000 / 60); // ~60fps

    return () => clearInterval(interval);
  }, [domChildren.length]);

  return (
    <div
      ref={parentRef}
      className="parent-container w-full relative pointer-events-none"
      style={{ height: "500px" }}
    >
      {domChildren.map((child, index) => (
        <div
          key={child?.render + index}
          ref={(el) => (childRefs.current[index] = el)}
          className="floating-element "
          style={{
            top: positions[index]?.top,
            left: positions[index]?.left,
            position: "absolute",
            transform: "translate3d(0,0,0)",
          }}
        >
          {children.find((e) => e.key == domChildren[index]?.key )?.el}
        </div>
      ))}
    </div>
  );
};

export default Floating;
