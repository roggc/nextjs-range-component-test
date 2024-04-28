import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import Range from "./index.tsx";
import { expect } from "chai";
import { getElementClientCenter, sleep, moveBullet } from "../../helpers.js";

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
      const maxBulletXBefore = maxBullet.getBoundingClientRect().x;

      const { x: maxBulletCenterX } = getElementClientCenter(maxBullet);

      await moveBullet({ bullet: minBullet, longitude: maxBulletCenterX });

      const minBulletXAfter = minBullet.getBoundingClientRect().x;
      const maxBulletXAfter = maxBullet.getBoundingClientRect().x;

      expect(minLabel).to.have.text("99€");
      expect(minBulletXAfter).to.be.greaterThan(minBulletXBefore);
      expect(maxBulletXAfter).to.be.equal(maxBulletXBefore);
    }).timeout(10000);

    it("move maxBullet to minBullet position", async () => {
      render(<Range min={1} max={100} />);
      await new Promise((r) => setTimeout(r, 10));

      const minLabel = screen.getByTestId("minLabel");
      expect(minLabel).to.have.text("1€");
      const maxLabel = screen.getByTestId("maxLabel");
      expect(maxLabel).to.have.text("100€");

      const minBullet = screen.getByTestId("minBullet");
      const maxBullet = screen.getByTestId("maxBullet");
      const maxBulletXBefore = maxBullet.getBoundingClientRect().x;
      const minBulletXBefore = minBullet.getBoundingClientRect().x;

      const { x: startX } = getElementClientCenter(maxBullet);
      await moveBullet({
        bullet: maxBullet,
        longitude: startX,
        isMaxBullet: true,
      });

      const maxBulletXAfter = maxBullet.getBoundingClientRect().x;
      const minBulletXAfter = minBullet.getBoundingClientRect().x;

      expect(maxLabel).to.have.text("2€");
      expect(maxBulletXAfter).to.be.lessThan(maxBulletXBefore);
      expect(minBulletXAfter).to.be.equal(minBulletXBefore);
    }).timeout(10000);

    afterEach(cleanup);
  });
