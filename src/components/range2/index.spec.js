import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import Range from "./index.tsx";
import { expect } from "chai";
import { getElementClientCenter, sleep, moveBullet } from "../../helpers.js";

export default () =>
  describe("range2", () => {
    it("move minBullet to maxBullet position", async () => {
      render(<Range values={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]} />);
      await sleep(100);

      const minLabel = screen.getByTestId("minLabel");
      expect(minLabel).to.have.text("1.99€");
      const maxLabel = screen.getByTestId("maxLabel");
      expect(maxLabel).to.have.text("70.99€");

      const minBullet = screen.getByTestId("minBullet");
      const minBulletXBefore = minBullet.getBoundingClientRect().x;
      const maxBullet = screen.getByTestId("maxBullet");
      const maxBulletXBefore = maxBullet.getBoundingClientRect().x;

      const { x: maxBulletCenterX } = getElementClientCenter(maxBullet);
      await moveBullet({ bullet: minBullet, longitude: maxBulletCenterX });
      await sleep(100);

      const minBulletXAfter = minBullet.getBoundingClientRect().x;
      const maxBulletXAfter = maxBullet.getBoundingClientRect().x;

      expect(minLabel).to.have.text("50.99€");
      expect(minBulletXAfter).to.be.greaterThan(minBulletXBefore);
      expect(maxBulletXAfter).to.be.equal(maxBulletXBefore);
    }).timeout(10000);

    it("move maxBullet to minBullet position", async () => {
      render(<Range values={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]} />);
      await new Promise((r) => setTimeout(r, 10));

      const minLabel = screen.getByTestId("minLabel");
      expect(minLabel).to.have.text("1.99€");
      const maxLabel = screen.getByTestId("maxLabel");
      expect(maxLabel).to.have.text("70.99€");

      const minBullet = screen.getByTestId("minBullet");
      const maxBullet = screen.getByTestId("maxBullet");
      const maxBulletXBefore = maxBullet.getBoundingClientRect().x;
      const minBulletXBefore = minBullet.getBoundingClientRect().x;

      const { x: startX } = getElementClientCenter(maxBullet);
      await moveBullet({
        bullet: maxBullet,
        longitude: -startX,
      });

      const maxBulletXAfter = maxBullet.getBoundingClientRect().x;
      const minBulletXAfter = minBullet.getBoundingClientRect().x;

      expect(maxLabel).to.have.text("5.99€");
      expect(maxBulletXAfter).to.be.lessThan(maxBulletXBefore);
      expect(minBulletXAfter).to.be.equal(minBulletXBefore);
    }).timeout(10000);

    afterEach(cleanup);
  });
