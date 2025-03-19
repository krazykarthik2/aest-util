/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/
import cn from "./cn";
// import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
      
export default function FloatingDock({
  items,
  desktopClassName,
  mobileClassName,
  comeOutOnLeft,
}) {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        comeOutOnLeft={comeOutOnLeft}
      />
      <FloatingDockMobile
        items={items}
        className={mobileClassName}
        comeOutOnLeft={comeOutOnLeft}
      />
    </>
  );
}
/**
 * A navigation menu that comes out from the bottom of the screen when
 * the user presses the button on mobile devices.
 *
 * @param {React.ReactNode[]} items - An array of items to display in the dock.
 * @param {string} [className] - The class name to apply to the dock.
 *
 * @example
 * <FloatingDockMobile
 *   items={[
 *     
 *   ]}
 * />
 */
const FloatingDockMobile = ({ items, className }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                {item.href && (
                  <Link
                    href={item.href}
                    key={idx}
                    className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center"
                  >
                    <div className="h-4 w-4">{item.icon}</div>
                  </Link>
                )}
                {item.onClick && (
                  <button
                    type="button"
                    key={idx}
                    onClick={item.onClick}
                    className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center"
                  >
                    <div className="h-4 w-4">{item.icon}</div>
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center"
      >
        {/* <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> */}
      </button>
    </div>
  );
};

/**
 * FloatingDockDesktop is a React component that renders a floating dock UI element.
 * It displays a vertical list of icons on the left or right side of the screen,
 * based on the `comeOutOnLeft` prop. The dock is positioned at the center of the viewport
 * and allows interaction with the icons, which can be links or buttons.
 *
 * @param {Object[]} items - An array of objects representing the items to be displayed in the dock.
 * Each item should contain properties like `icon`, `href`, and `onClick`.
 * @param {string} className - Additional CSS classes to be applied to the dock container.
 * @param {boolean} [comeOutOnLeft=false] - A boolean to determine if the dock should be displayed on the left side.
 */

const FloatingDockDesktop = ({ items, className, comeOutOnLeft = false }) => {
  let mouseY = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseY.set(e.clientY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className={cn(
        "fixed flex flex-col top-1/2 transform -translate-y-1/2 left-0 w-14 gap-4 items-center bg-white/80 dark:bg-black/80 shadow-lg backdrop-blur-md rounded-xl p-4",
        className,
        comeOutOnLeft ? "left-4" : "right-4"
      )}
    >
      {items.map((item, idx) => (
        <IconContainer
          mouseY={mouseY}
          key={idx}
          {...item}
          comeOutOnLeft={comeOutOnLeft}
        />
      ))}
    </motion.div>
  );
};

/*************  ✨ Codeium Command ⭐  *************/
/**
 * IconContainer is a component that renders an interactive icon with animation
 * effects based on the user's mouse position. The icon can either act as a link
 * or a button, and displays a tooltip when hovered.
 *
 * @param {object} props - Props object for the component.
 * @param {MotionValue} props.mouseY - A Framer Motion value representing the Y
 *   position of the user's mouse, used to calculate the distance for animation.
 * @param {string} props.title - The title or tooltip text to display on hover.
 * @param {JSX.Element} props.icon - The icon to render inside the container,
 *   which can be either a link or a button.
 * @param {string} [props.href] - The URL to navigate to if the icon is a link.
 * @param {function} [props.onClick] - The callback function to execute when the
 *   icon is clicked if it acts as a button.
 * @param {boolean} [props.comeOutOnLeft=false] - Determines the direction from
 *   which the tooltip appears; true for left, false for right.
 * @param {string} [props.accessKey] - The access key to activate the link or
 *   button.
 */

/******  095bcf66-5f09-4548-b0a8-da204d829ec9  *******/
function IconContainer({ mouseY, title, icon, href,onClick, comeOutOnLeft ,accessKey}) {
  let ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  let distance = useTransform(mouseY, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  let sizeTransform = useTransform(distance, [-100, 0, 100], [36, 64, 36]);
  let sizeIconTransform = useTransform(distance, [-100, 0, 100], [18, 32, 18]);
  let xOffsetTransform = useTransform(distance, [-100, 0, 100], [0, 6, 0]);

  let size = useSpring(sizeTransform, {
    mass: 0.2,
    stiffness: 250,
    damping: 15,
  });
  let sizeIcon = useSpring(sizeIconTransform, {
    mass: 0.2,
    stiffness: 250,
    damping: 15,
  });
  let xOffset = useSpring(xOffsetTransform, {
    mass: 0.2,
    stiffness: 250,
    damping: 15,
  });

  return (
    <Link to={href}>
      <motion.div
        onMouseOver={(e) => setHovered(true)}
        onMouseLeave={(e) => setHovered(false)}
        ref={ref}
        style={{ width: size, height: size, x: xOffset }}
        className="relative flex items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 shadow-md hover:shadow-xl"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: comeOutOnLeft ? 8 : -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: comeOutOnLeft ? 8 : -8 }}
              className={`absolute ${
                comeOutOnLeft ? "right-full mr-3" : "left-full ml-3"
              } px-3 py-1 rounded-md bg-black/80 text-white text-xs shadow-md backdrop-blur-md`}
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: sizeIcon, height: sizeIcon }}
          className="flex items-center justify-center"
        >
          {href && (
            <Link
              href={href}
              className="d-center"
              accessKey={accessKey}
            >
              {icon}
            </Link>
          )}
          {onClick && (
            <button
              type="button"
              onClick={onClick}
              className="d-center"
              accessKey={accessKey}
            >
              {icon}
            </button>
          )}
        </motion.div>
      </motion.div>
    </Link>
  );
}
