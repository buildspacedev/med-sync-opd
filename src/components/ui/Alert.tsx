import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

interface AlertProps {
  message: string;
  description?: string;
  type?: "success" | "info" | "warning" | "error";
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  message,
  description,
  type = "info",
  className = "",
}) => {
  const styles = {
    success: "bg-success/10 border-success/20 text-success",
    info: "bg-info/10 border-info/20 text-info",
    warning: "bg-warning/10 border-warning/20 text-warning",
    error: "bg-error/10 border-error/20 text-error",
  };

  const Icon = {
    success: CheckCircle2,
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
  }[type];

  return (
    <div className={`flex gap-3 p-4 rounded-2xl border ${styles[type]} ${className}`}>
      <Icon className="shrink-0 mt-0.5" size={20} />
      <div className="flex flex-col gap-1">
        <span className="font-bold text-sm leading-tight text-text-primary">{message}</span>
        {description && <span className="text-sm opacity-90">{description}</span>}
      </div>
    </div>
  );
};
