import styled from "styled-components";
import React, {
  FC,
  PropsWithChildren,
  forwardRef,
  useState,
  MouseEvent,
  useEffect,
  useRef,
  useReducer,
  Reducer,
  HTMLAttributes,
} from "react";
import Bullet from "./bullet.tsx";
import Label from "./label.tsx";
import { createPortal } from "react-dom";
import { useMeasure } from "@uidotdev/usehooks";

const BULLET_DIMENSION = 20;

type BulletSizePropsActionPayload = [boolean];

type BulletSizeProps = {
  isBig: boolean;
  dimension: number;
};

type BulletSizePropsAction = {
  type: "SET_IS_BIG";
  payload: BulletSizePropsActionPayload[0];
};

const bulletSizePropsReducer = (
  state: BulletSizeProps,
  action: BulletSizePropsAction
): BulletSizeProps => {
  switch (action.type) {
    case "SET_IS_BIG":
      if (action.payload) {
        return { ...state, isBig: true, dimension: state.dimension * 1.5 };
      }
      return { ...state, isBig: false, dimension: BULLET_DIMENSION };
    default:
      return state;
  }
};

interface RangeProps extends HTMLAttributes<HTMLDivElement> {
  thickness?: number;
  color?: string;
  min?: number;
  max?: number;
  stepSize?: number;
}

const Range: FC<RangeProps> = ({
  thickness = 5,
  color = "black",
  min = 1,
  max = 10,
  stepSize = 1,
  ...props
}) => {
  const [innerMin, setInnerMin] = useState(min);
  const [innerMax, setInnerMax] = useState(max);
  const numberOfSteps = (max - min) / stepSize;
  const [width, setWidth] = useState(0);
  const stepSizeInPX = (width ?? 0) / numberOfSteps;
  const [minStep, setMinStep] = useState(0);
  const [maxStep, setMaxStep] = useState(numberOfSteps);
  const [isMouseDown1, setIsMouseDown1] = useState(false);
  const [isMouseDown2, setIsMouseDown2] = useState(false);
  const [minMovementX1, setMinMovementX1] = useState(0);
  const [minMovementX2, setMinMovementX2] = useState(0);
  const bulletRef1 = useRef<HTMLDivElement>(null);
  const bulletRef2 = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [hover1, setHover1] = useState(false);
  const [hover2, setHover2] = useState(false);
  const isHover1DirtyRef = useRef(false);
  const isHover2DirtyRef = useRef(false);
  const [bulletSizeProps1, dispatchBulletSizeProps1] = useReducer<
    Reducer<BulletSizeProps, BulletSizePropsAction>
  >(bulletSizePropsReducer, { isBig: false, dimension: BULLET_DIMENSION });
  const [bulletSizeProps2, dispatchBulletSizeProps2] = useReducer<
    Reducer<BulletSizeProps, BulletSizePropsAction>
  >(bulletSizePropsReducer, { isBig: false, dimension: BULLET_DIMENSION });
  const [isLeftBullet, setIsLeftBullet] = useState(true);
  // const maxLabelRef = useRef<HTMLDivElement>(null);
  const [maxLabelRef, { width: maxLabelWidth, height: maxLabelHeight }] =
    useMeasure();

  const handleMouseEnter1 = () => {
    setHover1(true);
    isHover1DirtyRef.current = true;
  };

  const handleMouseEnter2 = () => {
    setHover2(true);
    isHover2DirtyRef.current = true;
  };

  const handleMouseLeave1 = () => {
    setHover1(false);
  };

  const handleMouseLeave2 = () => {
    setHover2(false);
  };

  const handleMouseDown1 = () => {
    setIsMouseDown1(true);
    setIsLeftBullet(true);
  };

  const handleMouseDown2 = () => {
    setIsMouseDown2(true);
    setIsLeftBullet(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown1(false);
    setIsMouseDown2(false);
  };

  const handleMouseMove =
    (isLeftBullet: boolean) => (event: MouseEvent<HTMLDivElement>) => {
      // console.log("mouse move in action");
      const isMouseDown = isLeftBullet ? isMouseDown1 : isMouseDown2;
      const setMinMovementX = isLeftBullet
        ? setMinMovementX1
        : setMinMovementX2;
      if (isMouseDown && barRef.current) {
        const barOffsetX =
          event.clientX - barRef.current.getBoundingClientRect().left;
        setMinMovementX(barOffsetX);
      }
    };

  useEffect(() => {
    if (minMovementX1) {
      const newMinStep = Math.round(minMovementX1 / stepSizeInPX);
      if (newMinStep >= 0 && newMinStep < maxStep) {
        setMinStep(newMinStep);
        setInnerMin(min + newMinStep * stepSize);
      }
    }
  }, [minMovementX1]);

  useEffect(() => {
    if (minMovementX2) {
      const newMaxStep = Math.round(minMovementX2 / stepSizeInPX);
      if (newMaxStep <= numberOfSteps && newMaxStep > minStep) {
        setMaxStep(newMaxStep);
        setInnerMax(min + newMaxStep * stepSize);
      }
    }
  }, [minMovementX2]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        setWidth(cr.width);
      }
    });

    if (barRef.current) {
      resizeObserver.observe(barRef.current);
    }

    return () => {
      if (barRef.current) {
        resizeObserver.unobserve(barRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (hover1 && !bulletSizeProps1.isBig) {
      dispatchBulletSizeProps1({ type: "SET_IS_BIG", payload: true });
    } else if (isHover1DirtyRef.current && !isMouseDown1 && !hover1) {
      dispatchBulletSizeProps1({ type: "SET_IS_BIG", payload: false });
    }
  }, [hover1, isMouseDown1]);

  useEffect(() => {
    if (hover2 && !bulletSizeProps2.isBig) {
      dispatchBulletSizeProps2({ type: "SET_IS_BIG", payload: true });
    } else if (isHover2DirtyRef.current && !isMouseDown2 && !hover2) {
      dispatchBulletSizeProps2({ type: "SET_IS_BIG", payload: false });
    }
  }, [hover2, isMouseDown2]);

  return (
    <>
      <SupraContainer {...props}>
        <Label
          dataTestId="minLabel"
          value={innerMin}
          setValue={setInnerMin}
          setStep={setMinStep}
          min={min}
          max={innerMax - stepSize}
          absoluteMin={min}
          minWidth={maxLabelWidth ?? undefined}
          maxWidth={maxLabelWidth ?? undefined}
          maxHeight={maxLabelHeight ?? undefined}
          isAlignRight
        />
        <Container
          thickness={thickness}
          color={color}
          ref={barRef}
          onMouseUp={handleMouseUp}
          isMouseDown={isMouseDown1 || isMouseDown2}
        >
          <Bullet
            dataTestId="minBullet"
            position={minStep * stepSizeInPX}
            onMouseDown={handleMouseDown1}
            isMouseDown={isMouseDown1}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter1}
            onMouseLeave={handleMouseLeave1}
            dimension={bulletSizeProps1.dimension}
            isBig={bulletSizeProps1.isBig}
            ref={bulletRef1}
          />
          <Bullet
            dataTestId="maxBullet"
            position={maxStep * stepSizeInPX}
            onMouseDown={handleMouseDown2}
            isMouseDown={isMouseDown2}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter2}
            onMouseLeave={handleMouseLeave2}
            dimension={bulletSizeProps2.dimension}
            isBig={bulletSizeProps2.isBig}
            ref={bulletRef2}
          />
        </Container>
        <Label
          dataTestId="maxLabel"
          value={innerMax}
          setValue={setInnerMax}
          setStep={setMaxStep}
          min={innerMin + stepSize}
          max={max}
          absoluteMin={min}
          ref={maxLabelRef}
          minWidth={maxLabelWidth ?? undefined}
          maxWidth={maxLabelWidth ?? undefined}
          maxHeight={maxLabelHeight ?? undefined}
        />
      </SupraContainer>
      {/* {createPortal( */}
      <Portal
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove(isLeftBullet)}
        isMouseDown={isMouseDown1 || isMouseDown2}
        dataTestId="portal"
      />
      {/* document.body
      )} */}
    </>
  );
};

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  thickness: number;
  color: string;
  isMouseDown: boolean;
}

const Container = styled(
  forwardRef<HTMLDivElement, PropsWithChildren<ContainerProps>>(
    ({ thickness, color, isMouseDown, ...props }, ref) => (
      <div ref={ref} {...props} />
    )
  )
)`
  height: ${({ thickness }) => thickness}px;
  background-color: ${({ color }) => color};
  border-radius: ${({ thickness }) => thickness}px;
  position: relative;
  ${({ isMouseDown }) => (isMouseDown ? "cursor:grabbing;" : "")}
  flex:1;
`;

interface PortalProps extends HTMLAttributes<HTMLDivElement> {
  isMouseDown: boolean;
  dataTestId?: string;
}

const Portal = styled(({ isMouseDown, dataTestId, ...props }: PortalProps) => (
  <div data-testid={dataTestId} {...props} />
))`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  ${({ isMouseDown }) => (isMouseDown ? "cursor:grabbing;" : "")}
`;

const SupraContainer = styled.div`
  padding: 10px;
  display: flex;
  gap: 20px;
  align-items: center;
`;

export default Range;
