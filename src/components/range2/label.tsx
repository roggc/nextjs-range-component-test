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
  isNoEdit?: boolean;
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
      isNoEdit = false,
      dataTestId = "",
      ...props
    },
    ref
  ) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const innerRef = useClickAway(() =>
      setIsEditMode(false)
    ) as RefObject<HTMLDivElement>;
    const [editValue, setEditValue] = useState(value.toString());

    useEffect(() => {
      if (!isNoEdit) {
        const newEditValue = parseInt(editValue, 10);
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
    }, [editValue, isEditMode, min, max, absoluteMin, isNoEdit]);

    useEffect(() => {
      if (!isNoEdit) {
        setEditValue(value.toString());
      }
    }, [value, isNoEdit]);

    return (
      <SupraContainer
        dataTestId={dataTestId}
        ref={ref}
        isNoEdit={isNoEdit}
        {...props}
      >
        <Container
          ref={innerRef}
          minWidth={minWidth}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          isAlignRight={isAlignRight}
          onClick={() => !isNoEdit && setIsEditMode(true)}
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
            <Text>{value.toFixed(2)}€</Text>
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
  isNoEdit: boolean;
  dataTestId: string;
}

const SupraContainer = styled(
  forwardRef<HTMLDivElement, SupraContainerProps>(
    ({ isNoEdit, dataTestId, ...props }, ref) => (
      <div data-testid={dataTestId} ref={ref} {...props} />
    )
  )
)`
  ${({ isNoEdit }) => (isNoEdit ? "" : "cursor: pointer;z-index: 1;")}
`;

export default Label;
