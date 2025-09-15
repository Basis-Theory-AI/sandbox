interface CircleCheckIconProps {
  className?: string;
  fill?: string;
}

export function CircleCheckIcon({
  className = "w-4 h-4",
  fill = "rgba(110, 231, 183, 1)",
}: CircleCheckIconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.49999 10.5001L9.16666 12.1667L12.5 8.83342M18.3333 10.5001C18.3333 15.1025 14.6024 18.8334 9.99999 18.8334C5.39762 18.8334 1.66666 15.1025 1.66666 10.5001C1.66666 5.89771 5.39762 2.16675 9.99999 2.16675C14.6024 2.16675 18.3333 5.89771 18.3333 10.5001Z"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
