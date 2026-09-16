import type { MediaTile2Styles } from "../../../_styles";
import { cn } from "../../../../lib/utils";
export type MediaTile2Data = {
  id: string;
  ariacontrols: string;
  text: string;
  id2: string;
  ariacontrols2: string;
  text2: string;
};
/** A media tile. */
export default function MediaTile2({ d, styles }: { d: MediaTile2Data; styles: MediaTile2Styles }) {
  return (
    <div className="w-full flex relative min-w-0 items-start gap-5 max-lg:flex-col max-md:flex-wrap">
      <div className="w-full flex relative min-w-0 flex-col items-start gap-5 max-md:flex-wrap">
        <div className="w-full block relative min-w-0 max-w-full gap-5">
          <div className="block">
            <div className="block" aria-label="Accordion. Open links with Enter or Space, close with Escape, and navigate with Arrow Keys">
              <details className="flex relative flex-col" id={d.id}>
                <summary className="border-b border-solid border-b-color-011 flex pb-2.5 justify-between items-center gap-x-2.5 text-color-003 coursr-pointer 2xl:pb-5" aria-controls={d.ariacontrols} aria-expanded="false">
                  <span className="flex">
                    <div className={cn("block items-center font-medium max-lg:text-[1.1875rem] 2xl:text-[1.875rem]", styles.className)}>
                      {d.text}
                    </div>
                  </span>
                  {" "}
                  <span className="flex relative items-center">
                    {"  "}
                    <span className="flex">
                      <svg className="w-8.5 h-6.5 block overflow-hidden" data-component="icon" height="33.895" viewBox="0 0 33.895 33.895" width="33.895" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <g id="Grupo_288" data-name="Grupo 288" transform="translate(-1817.001 -3614.105)">
                          <g id="Ellipse_136" data-name="Ellipse 136" transform="translate(1850.896 3614.105) rotate(90)" fill="none" style={{ isolation: "isolate" }}>
                            <path d="M0,16.947A16.947,16.947,0,1,1,16.947,33.895,16.947,16.947,0,0,1,0,16.947Z" stroke="none" />
                            <path d="M 16.9473876953125 0.9999961853027344 C 12.68768692016602 0.9999961853027344 8.682937622070312 2.658817291259766 5.670877456665039 5.670877456665039 C 2.658817291259766 8.682937622070312 0.9999961853027344 12.68768692016602 0.9999961853027344 16.9473876953125 C 0.9999961853027344 21.20709800720215 2.658817291259766 25.21184730529785 5.670877456665039 28.22390747070312 C 8.682937622070312 31.2359676361084 12.68767738342285 32.89477920532227 16.9473876953125 32.89477920532227 C 21.20709800720215 32.89477920532227 25.21184730529785 31.2359676361084 28.22390747070312 28.22390747070312 C 31.2359676361084 25.21184730529785 32.89477920532227 21.20709800720215 32.89477920532227 16.9473876953125 C 32.89477920532227 12.68767738342285 31.2359676361084 8.682937622070312 28.22390747070312 5.670877456665039 C 25.21184730529785 2.658817291259766 21.20709800720215 0.9999961853027344 16.9473876953125 0.9999961853027344 M 16.9473876953125 -3.814697265625e-06 C 26.30719757080078 -3.814697265625e-06 33.89477920532227 7.587596893310547 33.89477920532227 16.9473876953125 C 33.89477920532227 26.30719757080078 26.30719757080078 33.89477920532227 16.9473876953125 33.89477920532227 C 7.587596893310547 33.89477920532227 -3.814697265625e-06 26.30719757080078 -3.814697265625e-06 16.9473876953125 C -3.814697265625e-06 7.587596893310547 7.587596893310547 -3.814697265625e-06 16.9473876953125 -3.814697265625e-06 Z" stroke="none" fill="#33145c" />
                          </g>
                          <path id="Icon_ion-ios-arrow-left" data-name="Icon ion-ios-arrow-left" d="M7.7.778,6.872,0,0,6.419l6.872,6.419.83-.774L1.665,6.419Z" transform="translate(1840.367 3627.254) rotate(90)" />
                        </g>
                      </svg>
                    </span>
                    {" "}
                  </span>
                  {" "}
                </summary>
                {"  "}
              </details>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
      <div className="w-full flex relative min-w-0 flex-col items-start gap-5 max-md:flex-wrap">
        <div className="w-full block relative min-w-0 max-w-full gap-5">
          <div className="block">
            <div className="block" aria-label="Accordion. Open links with Enter or Space, close with Escape, and navigate with Arrow Keys">
              <details className="flex relative flex-col" id={d.id2}>
                <summary className="border-b border-solid border-b-color-011 flex pb-2.5 justify-between items-center gap-x-2.5 text-color-003 coursr-pointer 2xl:pb-5" aria-controls={d.ariacontrols2} aria-expanded="false">
                  <span className="flex">
                    <div className={cn("block items-center font-medium max-lg:text-[1.1875rem] 2xl:text-[1.875rem]", styles.className2)}>
                      {d.text2}
                    </div>
                  </span>
                  {" "}
                  <span className="flex relative items-center">
                    {"  "}
                    <span className="flex">
                      <svg className="w-8.5 h-6.5 block overflow-hidden" data-component="icon" height="33.895" viewBox="0 0 33.895 33.895" width="33.895" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <g id="Grupo_288" data-name="Grupo 288" transform="translate(-1817.001 -3614.105)">
                          <g id="Ellipse_136" data-name="Ellipse 136" transform="translate(1850.896 3614.105) rotate(90)" fill="none" style={{ isolation: "isolate" }}>
                            <path d="M0,16.947A16.947,16.947,0,1,1,16.947,33.895,16.947,16.947,0,0,1,0,16.947Z" stroke="none" />
                            <path d="M 16.9473876953125 0.9999961853027344 C 12.68768692016602 0.9999961853027344 8.682937622070312 2.658817291259766 5.670877456665039 5.670877456665039 C 2.658817291259766 8.682937622070312 0.9999961853027344 12.68768692016602 0.9999961853027344 16.9473876953125 C 0.9999961853027344 21.20709800720215 2.658817291259766 25.21184730529785 5.670877456665039 28.22390747070312 C 8.682937622070312 31.2359676361084 12.68767738342285 32.89477920532227 16.9473876953125 32.89477920532227 C 21.20709800720215 32.89477920532227 25.21184730529785 31.2359676361084 28.22390747070312 28.22390747070312 C 31.2359676361084 25.21184730529785 32.89477920532227 21.20709800720215 32.89477920532227 16.9473876953125 C 32.89477920532227 12.68767738342285 31.2359676361084 8.682937622070312 28.22390747070312 5.670877456665039 C 25.21184730529785 2.658817291259766 21.20709800720215 0.9999961853027344 16.9473876953125 0.9999961853027344 M 16.9473876953125 -3.814697265625e-06 C 26.30719757080078 -3.814697265625e-06 33.89477920532227 7.587596893310547 33.89477920532227 16.9473876953125 C 33.89477920532227 26.30719757080078 26.30719757080078 33.89477920532227 16.9473876953125 33.89477920532227 C 7.587596893310547 33.89477920532227 -3.814697265625e-06 26.30719757080078 -3.814697265625e-06 16.9473876953125 C -3.814697265625e-06 7.587596893310547 7.587596893310547 -3.814697265625e-06 16.9473876953125 -3.814697265625e-06 Z" stroke="none" fill="#33145c" />
                          </g>
                          <path id="Icon_ion-ios-arrow-left" data-name="Icon ion-ios-arrow-left" d="M7.7.778,6.872,0,0,6.419l6.872,6.419.83-.774L1.665,6.419Z" transform="translate(1840.367 3627.254) rotate(90)" />
                        </g>
                      </svg>
                    </span>
                    {" "}
                  </span>
                  {" "}
                </summary>
                {"  "}
              </details>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
    </div>
  );
}
