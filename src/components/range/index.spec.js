import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Range from "./index.tsx";
import { expect } from "chai";
import { getElementClientCenter, sleep } from "../../helpers.js";

export default () =>
  describe("range", () => {
    it("move minBullet to maxBullet position", async () => {
      render(<Range min={1} max={100} />);
      await sleep(10);

      const minLabel = screen.getByTestId("minLabel");
      expect(minLabel).to.have.text("1€");
      const maxLabel = screen.getByTestId("maxLabel");
      expect(maxLabel).to.have.text("100€");

      const minBullet = screen.getByTestId("minBullet");
      const minBulletXBefore = minBullet.getBoundingClientRect().x;

      const maxBullet = screen.getByTestId("maxBullet");
      // const maxBulletX = maxBullet.getBoundingClientRect().x;

      // console.log("max...", maxBulletX);
      const { x: maxBulletCenterX } = getElementClientCenter(maxBullet);

      // await waitFor(
      //   () => {
      //     expect(maxBulletX).to.be.greaterThan(100);
      //   },
      //   {
      //     timeout: 1000,
      //   }
      // );

      // console.log("maxBulletX", maxBulletX);

      const portal = screen.getByTestId("portal");

      const from = getElementClientCenter(minBullet);
      const current = {
        clientX: from.x,
        clientY: from.y,
      };
      // fireEvent.mouseEnter(minBullet, current);
      // fireEvent.mouseOver(minBullet, current);
      fireEvent.mouseMove(minBullet, current);
      fireEvent.mouseDown(minBullet, current);
      // current.clientX += 100;
      // current.clientY += 0;
      // // await sleep(500);
      // fireEvent.mouseMove(portal, current);
      // // await sleep(500);
      // fireEvent.mouseUp(minBullet, current);

      // fireEvent.mouseDown(minBullet);
      // fireEvent.mouseMove(minBullet, {
      //   clientX: maxBullet.getBoundingClientRect().x,
      // });
      // fireEvent.mouseUp(minBullet);

      // await user.pointer([
      //   { target: minBullet },
      //   "MouseLeft>",
      //   { target: maxBullet },
      //   "/MouseLeft",
      // ]);

      const { x: startX, y: startY } = getElementClientCenter(minBullet);
      // const { x: endX, y: endY } = getElementClientCenter(maxBullet);
      // console.log("endX", endX);

      // await user.pointer([
      //   {
      //     target: minBullet,
      //     keys: "MouseLeft>",
      //     coords: { clientX: startX, clientY: startY },
      //   },
      //   { target: portal, coords: { clientX: startX + 10, clientY: startY } },
      //   { target: portal, coords: { clientX: startX + 20, clientY: startY } },
      //   { target: portal, coords: { clientX: startX + 30, clientY: startY } },
      //   { target: portal, coords: { clientX: startX + 40, clientY: startY } },
      //   { target: portal, coords: { clientX: startX + 50, clientY: startY } },
      //   { target: portal, coords: { clientX: startX + 60, clientY: startY } },
      //   { target: portal, coords: { clientX: startX + 70, clientY: startY } },
      //   { target: portal, coords: { clientX: startX + 80, clientY: startY } },
      //   { target: portal, coords: { clientX: startX + 90, clientY: startY } },
      //   { target: portal, coords: { clientX: startX + 100, clientY: startY } },
      //   { target: portal, coords: { clientX: startX + 110, clientY: startY } },
      //   {
      //     target: minBullet,
      //     keys: "/MouseLeft",
      //     coords: { clientX: endX, clientY: startY },
      //   },
      // ]);

      const longitude = maxBulletCenterX;
      const numOfSteps = 60;
      const steps = [...Array(numOfSteps).keys()];
      let x;
      for (const step of steps) {
        x = startX + (step * longitude) / numOfSteps;
        fireEvent.mouseMove(portal, { clientX: x, clientY: startY });
        await new Promise((r) => setTimeout(r, 20));
      }
      const { x: finalX, y: finalY } = getElementClientCenter(minBullet);
      fireEvent.mouseUp(minBullet, {
        clientX: finalX,
        clientY: finalY,
      });
      // fireEvent.mouseMove(portal, {
      //   clientX: finalX - 1000,
      //   clientY: finalY + 100,
      // });
      // await new Promise((r) => setTimeout(r, 10));

      // await drag(minBullet, {
      //   to: maxBullet,
      //   // delta: { x: 999, y: 0 },
      //   steps: 20,
      //   duration: 1000,
      // });

      const minBulletXAfter = minBullet.getBoundingClientRect().x;
      // console.log("minBulletXAfter", minBulletXAfter);

      expect(minLabel).to.have.text("99€");

      // const updatedLabel = await screen.findByText("99€");
      // expect(updatedLabel).toBeInTheDocument();

      // await waitFor(
      //   () => {
      //     expect(minLabel).to.have.text("99€");
      //   },
      //   {
      //     timeout: 1000,
      //   }
      // );

      expect(minBulletXAfter).to.be.greaterThan(minBulletXBefore);
      // done();
    }).timeout(10000);

    it("move maxBullet to minBullet position", async () => {
      render(<Range min={1} max={100} />);
      await new Promise((r) => setTimeout(r, 10));
      const minLabel = screen.getByTestId("minLabel");
      expect(minLabel).to.have.text("1€");
      const maxLabel = screen.getByTestId("maxLabel");
      expect(maxLabel).to.have.text("100€");
      const minBullet = screen.getByTestId("minBullet");
      // const { x: minBulletX } = getElementClientCenter(minBullet);
      const maxBullet = screen.getByTestId("maxBullet");
      const maxBulletXBefore = maxBullet.getBoundingClientRect().x;
      const portal = screen.getByTestId("portal");
      const from = getElementClientCenter(maxBullet);
      const current = {
        clientX: from.x,
        clientY: from.y,
      };
      fireEvent.mouseMove(maxBullet, current);
      fireEvent.mouseDown(maxBullet, current);
      const { x: startX, y: startY } = getElementClientCenter(maxBullet);
      const longitude = startX;
      const numOfSteps = 60;
      const steps = [...Array(numOfSteps).keys()];
      for (const step of steps) {
        const x = startX - (step * longitude) / numOfSteps;
        fireEvent.mouseMove(portal, { clientX: x, clientY: startY });
        await new Promise((r) => setTimeout(r, 10));
      }
      const { x: finalX, y: finalY } = getElementClientCenter(maxBullet);
      fireEvent.mouseUp(maxBullet, {
        clientX: finalX,
        clientY: finalY,
      });
      const maxBulletXAfter = maxBullet.getBoundingClientRect().x;
      expect(maxLabel).to.have.text("2€");
      expect(maxBulletXAfter).to.be.lessThan(maxBulletXBefore);
    }).timeout(10000);

    afterEach(cleanup);
  });
