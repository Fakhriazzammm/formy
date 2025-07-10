import React from 'react';

type ConditionalFieldProps = {
  condition: boolean;
  children: React.ReactNode;
};

export default function ConditionalField({ condition, children }: ConditionalFieldProps) {
  if (!condition) return null;
  return <>{children}</>;
} 