import React, { HTMLAttributes, forwardRef } from "react";
import styled from "styled-components";

interface BulletProps extends HTMLAttributes<HTMLDivElement> {
  color?: string;
  dimension?: number;
  position: number;
  isMouseDown: boolean;
  isBig?: boolean;
  dataTestId?: string;
}

const Bullet = forwardRef<HTMLDivElement, BulletProps>(
  (
    {
      color = "black",
      dimension = 20,
      position,
      isMouseDown,
      isBig = false,
      dataTestId = "",
      ...props
    },
    ref
  ) => {
    return (
      <Container
        color={color}
        dimension={dimension}
        position={position}
        isMouseDown={isMouseDown}
        isBig={isBig}
        dataTestId={dataTestId}
        ref={ref}
        {...props}
      />
    );
  }
);

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  color: string;
  dimension: number;
  position: number;
  isMouseDown: boolean;
  isBig: boolean;
  dataTestId: string;
}

const Container = styled(
  forwardRef<HTMLDivElement, ContainerProps>(
    (
      { color, dimension, position, isMouseDown, isBig, dataTestId, ...props },
      ref
    ) => <div data-testid={dataTestId} ref={ref} {...props} />
  )
)`
  border-radius: 50%;
  width: ${({ dimension }) => dimension}px;
  height: ${({ dimension }) => dimension}px;
  background-color: ${({ color }) => color};
  position: absolute;
  top: 0;
  left: ${({ position }) => position}px;
  ${({ isBig }) => `transform: translate(-47%, -${isBig ? 39 : 36}%);`}
  cursor: ${({ isMouseDown }) => (isMouseDown ? "grabbing" : "grab")};
  z-index: 1;
`;

export default Bullet;
