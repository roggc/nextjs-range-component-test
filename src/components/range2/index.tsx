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
// import { createPortal } from "react-dom";
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
  values: number[];
}

const Range: FC<RangeProps> = ({
  thickness = 5,
  color = "black",
  values,
  ...props
}) => {
  const min = values[0];
  const max = values[values.length - 1];
  const [innerMin, setInnerMin] = useState(min);
  const [innerMax, setInnerMax] = useState(max);
  const numberOfSteps = values.length - 1;
  const stepSizes = values.reduce<number[]>((acc, value, index, array) => {
    if (index === 0) {
      return [...acc];
    }
    return [...acc, array[index] - array[index - 1]];
  }, []);
  const [width, setWidth] = useState(0);
  const pxPerUnitStep = (width ?? 0) / (max - min);
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
  const [maxLabelRef, { width: maxLabelWidth, height: maxLabelHeight }] =
    useMeasure();
  const getNumberOfUnitStep = (stepNum: number) => {
    if (stepNum > numberOfSteps) {
      return 0;
    }
    let numberOfUnitStep = 0;
    for (let i = 0; i < stepNum; i++) {
      numberOfUnitStep += stepSizes[i];
    }
    return numberOfUnitStep;
  };
  const getNumOfStep = (numberOfUnitSteps: number) => {
    let accStepSize = 0;
    let numOfStep = 0;
    let minDist;
    for (let i = 0; i < stepSizes.length; i++) {
      const aux = accStepSize;
      const stepSize = stepSizes[i];
      accStepSize += stepSize;
      const dist1 = Math.abs(numberOfUnitSteps - aux);
      const dist2 = Math.abs(numberOfUnitSteps - accStepSize);
      if (dist1 < dist2) {
        if (minDist === undefined || dist1 < minDist) {
          minDist = dist1;
          numOfStep = i;
        }
      } else {
        if (minDist === undefined || dist2 < minDist) {
          minDist = dist2;
          numOfStep = i + 1;
        }
      }
    }
    if (numOfStep > numberOfSteps) {
      numOfStep = numberOfSteps;
    }
    return numOfStep;
  };

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
      const numberOfUnitSteps = minMovementX1 / pxPerUnitStep;
      const numOfStep = getNumOfStep(numberOfUnitSteps);
      if (numOfStep >= 0 && numOfStep < maxStep) {
        setMinStep(numOfStep);
        setInnerMin(min + getNumberOfUnitStep(numOfStep));
      }
    }
  }, [minMovementX1]);

  useEffect(() => {
    if (minMovementX2) {
      const numberOfUnitSteps = minMovementX2 / pxPerUnitStep;
      const numOfStep = getNumOfStep(numberOfUnitSteps);
      if (numOfStep <= numberOfSteps && numOfStep > minStep) {
        setMaxStep(numOfStep);
        setInnerMax(min + getNumberOfUnitStep(numOfStep));
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
          max={innerMax}
          absoluteMin={min}
          minWidth={maxLabelWidth ?? undefined}
          maxWidth={maxLabelWidth ?? undefined}
          maxHeight={maxLabelHeight ?? undefined}
          isAlignRight
          isNoEdit
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
            position={getNumberOfUnitStep(minStep) * pxPerUnitStep}
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
            position={getNumberOfUnitStep(maxStep) * pxPerUnitStep}
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
          min={innerMin}
          max={max}
          absoluteMin={min}
          ref={maxLabelRef}
          minWidth={maxLabelWidth ?? undefined}
          maxWidth={maxLabelWidth ?? undefined}
          maxHeight={maxLabelHeight ?? undefined}
          isNoEdit
        />
      </SupraContainer>
      {/* {createPortal( */}
      <Portal
        dataTestId="portal"
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove(isLeftBullet)}
        isMouseDown={isMouseDown1 || isMouseDown2}
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
