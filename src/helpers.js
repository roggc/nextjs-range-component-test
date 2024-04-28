import { fireEvent, screen } from "@testing-library/react";

export function getElementClientCenter(element) {
  const { left, top, width, height } = element.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
}
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const moveBullet = async ({
  bullet,
  longitude,
  isMaxBullet = false,
  numOfSteps = 60,
}) => {
  const portal = screen.getByTestId("portal");
  const from = getElementClientCenter(bullet);
  const current = {
    clientX: from.x,
    clientY: from.y,
  };
  fireEvent.mouseMove(bullet, current);
  fireEvent.mouseDown(bullet, current);
  const steps = [...Array(numOfSteps).keys()];
  for (const step of steps) {
    const x = isMaxBullet
      ? from.x - (step * longitude) / numOfSteps
      : from.x + (step * longitude) / numOfSteps;
    fireEvent.mouseMove(portal, { clientX: x, clientY: from.y });
    await sleep(20);
  }
  const { x: finalX, y: finalY } = getElementClientCenter(bullet);
  fireEvent.mouseUp(bullet, {
    clientX: finalX,
    clientY: finalY,
  });
};

// function isElement(obj) {
//   if (typeof obj !== "object") {
//     return false;
//   }
//   let prototypeStr, prototype;
//   do {
//     prototype = Object.getPrototypeOf(obj);
//     // to work in iframe
//     prototypeStr = Object.prototype.toString.call(prototype);
//     // '[object Document]' is used to detect document
//     if (
//       prototypeStr === "[object Element]" ||
//       prototypeStr === "[object Document]"
//     ) {
//       return true;
//     }
//     obj = prototype;
//     // null is the terminal of object
//   } while (prototype !== null);
//   return false;
// }

// const getCoords = (charlie) =>
//   isElement(charlie) ? getElementClientCenter(charlie) : charlie;

// async function drag(element, { to: inTo, delta, steps = 20, duration = 500 }) {
//   const from = getElementClientCenter(element);
//   const to = delta
//     ? {
//         x: from.x + delta.x,
//         y: from.y + delta.y,
//       }
//     : getCoords(inTo);

//   const step = {
//     x: (to.x - from.x) / steps,
//     y: (to.y - from.y) / steps,
//   };

//   const current = {
//     clientX: from.x,
//     clientY: from.y,
//   };

//   fireEvent.mouseEnter(element, current);
//   fireEvent.mouseOver(element, current);
//   fireEvent.mouseMove(element, current);
//   fireEvent.mouseDown(element, current);
//   for (let i = 0; i < steps; i++) {
//     current.clientX += step.x;
//     current.clientY += step.y;
//     await sleep(duration / steps);
//     fireEvent.mouseMove(element, current);
//   }
//   fireEvent.mouseUp(element, current);
// }
