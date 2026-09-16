import Icon14 from "../svgs/svg-icon14";
import Icon15 from "../svgs/svg-icon15";
import Icon16 from "../svgs/svg-icon16";
import Icon17 from "../svgs/svg-icon17";
export type FeatureGridItemData = {
  variant: string;
  title: string;
  eyebrow?: string;
};
/** feature grid item component. */
export default function FeatureGridItem({ d }: { d: FeatureGridItemData }) {
  switch (d.variant) {
    case "chatbots-gpts-agentes-que-pueden-revolucio":
      return (
        <div className="border-4 border-solid border-primary flex relative min-w-0 pt-5 pr-8.5 pb-[2.9375rem] pl-7.5 rounded-[38px] flex-col justify-center items-start gap-5 max-lg:pb-5 max-lg:px-5 max-md:flex-wrap" data-ditto-id="style-div-26">
          <div className="block relative min-w-0 max-w-full gap-5">
            <div className="block" data-ditto-id="style-div-28">
              <div className="block text-center">
                <div className="inline-block text-color-001 text-[2.1875rem] leading-[2.1875rem]" data-ditto-id="interaction-div-10">
                  {" "}
                  <Icon14 />
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div className="block relative min-w-0 max-w-full gap-5 text-background text-[1.3125rem] leading-8.5 max-lg:text-base max-lg:leading-[1.625rem] 2xl:text-[1.4375rem]" data-ditto-id="interaction-div-11">
            <div className="h-full block">
              <p className="block mb-[0.9rem]">
                {d.title}
              </p>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
      );
    case "clonaci-n-de-voces-y-creaci-n-de-m-sica-de":
      return (
        <div className="border-4 border-solid border-primary flex relative min-w-0 pt-5 pr-8.5 pb-[2.9375rem] pl-7.5 rounded-[38px] flex-col justify-center items-start gap-5 max-lg:pb-5 max-lg:px-5 max-md:flex-wrap">
          <div className="block relative min-w-0 max-w-full gap-5">
            <div className="block">
              <div className="block text-center">
                <div className="inline-block text-color-001 text-[2.1875rem] leading-[2.1875rem]">
                  {" "}
                  <Icon15 />
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div className="block relative min-w-0 max-w-full gap-5 text-background text-[1.3125rem] leading-8.5 max-lg:text-base max-lg:leading-[1.625rem] 2xl:text-[1.4375rem]">
            <div className="block">
              {" CLONAGE DE VOIX ET CRÉATION DE MUSIQUE DU FUTUR. "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
      );
    case "sin-necesidad-de-saber":
      return (
        <div className="border-4 border-solid border-primary flex relative min-w-0 pt-5 pr-8.5 pb-[2.9375rem] pl-7.5 rounded-[38px] flex-col justify-center items-start gap-5 max-lg:pb-5 max-lg:px-5 max-md:flex-wrap">
          <div className="block relative min-w-0 max-w-full gap-5">
            <div className="block">
              <div className="block text-center">
                <div className="inline-block text-color-001 text-[2.1875rem] leading-[2.1875rem]">
                  {" "}
                  <Icon16 dittoId={"style-a-7"} />
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div className="block relative min-w-0 max-w-full gap-5 text-background text-[1.3125rem] leading-8.5 max-lg:text-base max-lg:leading-[1.625rem] 2xl:text-[1.4375rem]" data-ditto-id="style-div-82">
            <div className="block">
              {" APPS"}
              <br className="inline" />
              {" SIN NECESIDAD DE SABER"}
              <br className="inline" />
              {" PROGRAMAR. "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
      );
    case "y-otros-talleres-para-poner-en-pr-ctica-lo":
      return (
        <div className="border-4 border-solid border-primary flex relative min-w-0 pt-5 pr-8.5 pb-[2.9375rem] pl-7.5 rounded-[38px] flex-col justify-center items-start gap-5 max-lg:pb-5 max-lg:px-5 max-md:flex-wrap">
          <div className="block relative min-w-0 max-w-full gap-5" data-ditto-id="style-div-85">
            <div className="block" data-ditto-id="style-div-86">
              <div className="block text-center">
                <div className="inline-block text-color-001 text-[2.1875rem] leading-[2.1875rem]">
                  {" "}
                  <Icon17 />
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div className="block relative min-w-0 max-w-full gap-5 text-background text-[1.3125rem] leading-8.5 max-lg:text-base max-lg:leading-[1.625rem] 2xl:text-[1.4375rem]">
            <div className="block">
              {" ET D'AUTRES ATELIERS POUR METTRE EN PRATIQUE LES CONCEPTS ET PLATEFORMES APPRIS "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
      );
    default:
      return null;
  }
}
