interface SubtitleProps {
  subtitle: string;
  dark?: boolean;
}

const Subtitle = ({ subtitle, dark }: SubtitleProps) => {
  return (
    <div className="flex justify-center items-center gap-8 my-12 ">
      <div
        className={`h-[1px] w-full ${
          dark ? "bg-primary-foreground" : "bg-secondary-foreground"
        }`}
      ></div>
      <h2
        className={`text-3xl font-primary text-nowrap ${
          dark ? "text-primary" : ""
        }`}
      >
        {subtitle}
      </h2>
      <div
        className={`h-[1px] w-full ${
          dark ? "bg-primary-foreground" : "bg-secondary-foreground"
        }`}
      ></div>
    </div>
  );
};

export default Subtitle;
