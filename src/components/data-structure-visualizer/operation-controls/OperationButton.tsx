
import React from 'react';
import { Button } from '../../ui/button';

interface OperationButtonProps {
  operation: string;
  handleOperation: (operation: string) => void;
  icon: React.ReactNode;
  label: string;
}

export const OperationButton: React.FC<OperationButtonProps> = ({
  operation,
  handleOperation,
  icon,
  label
}) => {
  return (
    <Button
      onClick={() => handleOperation(operation)}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {icon}
      {label}
    </Button>
  );
};
