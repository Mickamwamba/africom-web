interface LogoProps {
  variant: "full-color" | "white";
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({ variant, width = 160, height = 48, className = "" }: LogoProps) {
  return (
    <img
      src={variant === "full-color" ? "/logos/africom-full-color.svg" : "/logos/africom-white.svg"}
      alt="Africom International Ltd"
      width={width}
      height={height}
      className={className}
    />
  );
}
