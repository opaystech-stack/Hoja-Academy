import type { FeatureCardStyles } from "../_styles";
import { cn } from "../../../lib/utils";
export type FeatureCardData = {
  title: string;
  description: string;
};
/** A feature card. */
export default function FeatureCard({ d, styles }: { d: FeatureCardData; styles?: FeatureCardStyles }) {
  return (
    <div className={cn("w-full md:w-[20rem] lg:w-[22rem] flex relative min-w-0 p-6 rounded-[28px] flex-col justify-start gap-3 bg-primary shadow-md transition-transform hover:-translate-y-1 duration-200", styles?.className)}>
      <div className="block relative min-w-0 max-w-full text-center">
        <div className="block">
          <div className="block text-color-007 [font-family:Montserrat,_sans-serif] text-xl font-bold leading-snug" data-component="heading">
            <p className="block mb-2">
              <b className="inline font-bold">
                {d.title}
              </b>
            </p>
          </div>
        </div>
      </div>
      <div className="block relative min-w-0 max-w-full text-color-007 text-sm md:text-[0.9375rem] leading-relaxed text-center">
        <div className="block">
          <p className="block">
            {d.description}
          </p>
        </div>
      </div>
    </div>
  );
}
