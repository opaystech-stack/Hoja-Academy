export type FeatureCard2Data = {
  title: string;
  description: string;
};
/** A feature card. */
export default function FeatureCard2({ d }: { d: FeatureCard2Data }) {
  return (
    <div className="w-[24%] min-h-37.5 border border-solid border-color-011 flex relative min-w-0 p-6.5 flex-col justify-start gap-5 max-lg:w-full max-md:flex-wrap 2xl:min-h-102 2xl:p-[3.4375rem] 2xl:justify-center">
      <div className="block relative min-w-0 max-w-full self-start gap-5">
        <div className="block">
          <h3 className="block text-color-001 font-bold leading-[2.1875rem] 2xl:text-[1.75rem]" data-component="heading">
            {d.title}
          </h3>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
      <div className="block relative min-w-0 max-w-full gap-5 text-color-001 text-[1rem] leading-5 2xl:[font-size:inherit] 2xl:leading-[inherit]">
        <div className="block">
          <p className="block mb-[0.9rem]">
            {d.description}
          </p>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
    </div>
  );
}
