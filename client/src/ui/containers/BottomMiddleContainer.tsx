const BottomMiddleContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="absolute -translate-x-1/2 left-1/2 bottom-0 ">{children}</div>;
};

export default BottomMiddleContainer;
