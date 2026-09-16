export type FeatureCardData = {
  title: string;
  description: string;
};
/** A feature card. */
export default function FeatureCard({ d }: { d: FeatureCardData }) {
  return (
    <div className="border border-solid border-surface block p-7 rounded-[20px] bg-surface [backdrop-filter:blur(8px)] max-lg:p-5.5 max-lg:text-left">
      <div className="w-9.5 h-1 block mb-5 rounded-[999px] bg-color-021 max-lg:mb-4" />
      {" "}
      <h3 className="block mb-3 text-[1.3125rem] font-medium leading-[1.75rem] max-lg:text-[1.1875rem] max-lg:leading-[1.625rem]" data-component="heading">
        {d.title}
      </h3>
      {" "}
      <p className="block text-color-025 text-[1.0625rem] leading-7 max-lg:text-base max-lg:leading-[1.625rem]">
        {d.description}
      </p>
      {" "}
    </div>
  );
}
