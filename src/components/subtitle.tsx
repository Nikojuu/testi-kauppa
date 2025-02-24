interface SubtitleProps {
  subtitle: string;
  dark?: boolean;
}

const Subtitle = ({ subtitle, dark }: SubtitleProps) => {
  return (
    <div className="flex justify-center items-center gap-8 md:my-12 my-4">
      {/* <div className="h-[1px] w-full bg-primary hidden md:block"></div> */}
      <h2
        className={`text-2xl  font-primary text-primary text-nowrap ${
          dark ? "text-primary" : ""
        }`}
      >
        {subtitle}
      </h2>
      {/* <div className="h-[1px] w-full bg-primary hidden md:block"></div> */}
    </div>
  );
};

export default Subtitle;
