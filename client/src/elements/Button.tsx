import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "success" | "danger" | "default" | "outline";
}

const STYLES = {
  baseStyle: "inline-flex transition-all duration-300 items-center justify-center p-2 text-xs font-medium rounded-md",
  primary: "!rounded-full py-1 bg-gold hover:bg-gold/50 focus:outline-none",
  default:
    "text-white/90 border border-transparent shadow-sm",
  enabledStyle:
    "bg-black/10 hover:bg-black/30 focus:outline-none",
  disabledStyle: "bg-gray-300 cursor-not-allowed",
  success: "border border-brilliance !text-brilliance bg-transparent hover:bg-brilliance/10",
  outline: "border border-gold !text-gold bg-transparent hover:bg-gold/10",
  secondary: '',
  danger: ''
}
const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  disabled = false,
  variant = "default",
}) => {

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      className={`${STYLES.baseStyle} ${STYLES[variant]} ${disabled ? STYLES.disabledStyle : STYLES.enabledStyle
        } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
