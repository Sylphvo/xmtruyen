import React from "react";
import "../../styles/Skeleton.css";

interface SkeletonProps {
  type?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({
  type = "text",
  width,
  height,
  borderRadius,
  className = "",
  style,
}: SkeletonProps) {
  const classes = `skeleton skeleton-${type} ${className}`;
  
  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(borderRadius ? { borderRadius } : {}),
  };

  return <div className={classes} style={mergedStyle} />;
}
