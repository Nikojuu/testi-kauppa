import Image from "next/image";

type AboutBlockType = {
  imgSrc: string;
  title: string;
  text: string;
  reverse?: boolean;
};

const AboutBlock = ({ blockInfo }: { blockInfo: AboutBlockType }) => {
  return (
    <section
      className={`margin-large mx-auto mb-32 flex w-full max-w-screen-2xl flex-col px-4  lg:flex-row ${
        blockInfo.reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      <div className="relative aspect-square rounded-sm lg:w-1/2">
        <Image
          fill
          alt={blockInfo.title}
          src={blockInfo.imgSrc}
          className="object-cover"
        />
      </div>
      <div
        className={`z-10  ${
          blockInfo.reverse ? "lg:-mr-24" : "lg:-ml-24"
        } z-10  mx-1 -mt-32 flex-1 whitespace-pre-line rounded-sm bg-primary  p-8   text-black sm:mx-8 sm:p-8  lg:mb-24 lg:mt-24 `}
      >
        <h3 className="mb-8 font-primary text-2xl ">{blockInfo.title}</h3>
        <p>{blockInfo.text}</p>
      </div>
    </section>
  );
};

export default AboutBlock;
