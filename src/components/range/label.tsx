import React, {
  forwardRef,
  PropsWithChildren,
  useState,
  InputHTMLAttributes,
  HTMLAttributes,
  useEffect,
  RefObject,
} from "react";
import styled from "styled-components";
import { useClickAway } from "@uidotdev/usehooks";

interface LabelProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  setValue: (value: number) => void;
  setStep: (value: number) => void;
  min: number;
  max: number;
  absoluteMin: number;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
  isAlignRight?: boolean;
  dataTestId?: string;
}

const Label = forwardRef<HTMLDivElement, LabelProps>(
  (
    {
      value,
      setValue,
      setStep,
      min,
      max,
      absoluteMin,
      minWidth,
      maxWidth,
      maxHeight,
      isAlignRight = false,
      dataTestId = "",
      ...props
    },
    ref
  ) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isClickedAway, setIsClickedAway] = useState(false);
    const innerRef = useClickAway(() => {
      setIsEditMode(false);
      setIsClickedAway(true);
    }) as RefObject<HTMLDivElement>;
    const [editValue, setEditValue] = useState(value.toString());

    useEffect(() => {
      if (isClickedAway) {
        const newEditValue = parseInt(editValue, 10);
        setIsClickedAway(false);
        if (
          !isEditMode &&
          !isNaN(newEditValue) &&
          newEditValue >= min &&
          newEditValue <= max
        ) {
          setValue(newEditValue);
          setStep(newEditValue - absoluteMin);
        } else if (!isEditMode) {
          setEditValue(value.toString());
        }
      }
    }, [editValue, isEditMode, min, max, absoluteMin, isClickedAway]);

    useEffect(() => {
      setEditValue(value.toString());
    }, [value]);

    return (
      <SupraContainer dataTestId={dataTestId} ref={ref} {...props}>
        <Container
          ref={innerRef}
          minWidth={minWidth}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          isAlignRight={isAlignRight}
          onClick={() => setIsEditMode(true)}
        >
          {isEditMode ? (
            <Input
              maxWidth={maxWidth}
              type="number"
              max={max}
              min={min}
              value={editValue}
              onChange={(event) => setEditValue(event.target.value)}
            />
          ) : (
            <Text>{value}€</Text>
          )}
        </Container>
      </SupraContainer>
    );
  }
);

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
  isAlignRight: boolean;
}

const Container = styled(
  forwardRef<HTMLDivElement, PropsWithChildren<ContainerProps>>(
    ({ minWidth, maxWidth, maxHeight, isAlignRight, ...props }, ref) => (
      <div ref={ref} {...props} />
    )
  )
)`
  ${({ minWidth }) => (minWidth ? `min-width:${minWidth}px;` : "")}
  ${({ maxWidth }) => (maxWidth ? `max-width:${maxWidth}px;` : "")}
  ${({ maxHeight }) => (maxHeight ? `max-height:${maxHeight}px;` : "")}
  display:flex;
  align-items: center;
  ${({ isAlignRight }) => (isAlignRight ? "justify-content:flex-end;" : "")}
  user-select:none;
`;

const Text = styled.div``;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  maxWidth?: number;
}

const Input = styled(({ maxWidth, ...props }: InputProps) => (
  <input {...props} />
))`
  ${({ maxWidth }) => (maxWidth ? `max-width:${maxWidth}px;` : "")}
`;

interface SupraContainerProps extends HTMLAttributes<HTMLDivElement> {
  dataTestId: string;
}

const SupraContainer = styled(
  forwardRef<HTMLDivElement, SupraContainerProps>(
    ({ dataTestId, ...props }, ref) => (
      <div data-testid={dataTestId} ref={ref} {...props} />
    )
  )
)`
  cursor: pointer;
  z-index: 1;
`;

export default Label;
