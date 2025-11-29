export const ClockIcon = ({fill, size, height, width, ...props}: any) => {
  return (
    <svg
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2}/>
      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth={2} strokeLinecap="round"/>
    </svg>
  );
};