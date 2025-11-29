export const ChartIcon = ({fill, size, height, width, ...props}: any) => {
  return (
    <svg
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path d="M3 3V21H21" stroke="currentColor" strokeWidth={2} strokeLinecap="round"/>
      <path d="M7 14L11 10L15 14L19 8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};