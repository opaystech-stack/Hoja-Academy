import Icon18 from "../svgs/svg-icon18";
import ListRow from "../components/list-row";
import ListRow5 from "../components/list-row5";
import ListRow6 from "../components/list-row6";
import Icon13 from "../svgs/svg-icon13";
import ListRow7 from "../components/list-row7";
import ListRow8 from "../components/list-row8";
import { ListRow_meta2, ListRow6_meta, ListRow8_meta } from "../ditto-meta";
import { ListRow_styles2, ListRow5_styles, ListRow7_styles, ListRow8_styles } from "../_styles";
import { listRowData2 as listRowData2Content, listRow5Data as listRow5DataContent, listRow6Data as listRow6DataContent, listRow7Data as listRow7DataContent, listRow8Data as listRow8DataContent } from "../content";
/** Site footer. */
export default function Footer({ listRowData2 = listRowData2Content, listRow5Data = listRow5DataContent, listRow6Data = listRow6DataContent, listRow7Data = listRow7DataContent, listRow8Data = listRow8DataContent } = {}) {
  return (
    <footer className="block before:content-[''] before:table before:w-0 before:h-0">
      <footer className="min-h-123.5 text-background flex relative max-w-full px-10 flex-col justify-around gap-5 bg-accent [background-size:93%] [background-position:0%_100%] bg-no-repeat max-md:p-5 max-md:flex-wrap max-lg:gap-y-[3.8125rem] max-lg:gap-x-[initial] md:max-lg:py-10 2xl:[background-size:initial]" style={{ backgroundImage: "url(\"/assets/cloned/images/7ce694e1013a.png\")" }}>
        <div className="flex relative min-w-0 gap-5 max-md:pt-7.5 max-lg:flex-col max-md:flex-wrap max-lg:items-start max-md:gap-y-9 max-lg:gap-x-[initial] md:max-lg:gap-y-14">
          <div className="w-1/3 flex relative min-w-0 pt-2.5 flex-col gap-y-7.5 max-md:w-full max-md:flex-wrap max-lg:items-start md:max-lg:w-[78%] 2xl:pt-0">
            <div className="block relative min-w-0 max-w-full gap-y-7.5" data-ditto-id="interaction-ld-expand-28724-container">
              <div className="flex flex-col">
                <nav className="flex" data-component="nav" aria-label="Menu">
                  <ul className="flex relative z-2 flex-wrap justify-start leading-6 [list-style-type:none] list-outside 2xl:mr-2.5 after:content-[' '] after:block after:w-0 after:h-0 after:text-foreground after:text-[0rem] after:leading-0 after:[overflow:hidden]" id="menu-1-516d334">
                    <li className="flex relative">
                      <a className="flex relative mx-[17.5px] py-4 items-center grow text-background [font-family:Montserrat,_sans-serif] text-sm leading-0 whitespace-nowrap text-nowrap cursor-pointer max-md:mx-[0.5625rem] max-md:text-[0.8125rem] 2xl:mx-[21.5px] 2xl:text-[0.9375rem] hover:underline" href="/formations/expert-ia">Expert IA</a>
                    </li>
                    <li className="flex relative">
                      <a className="flex relative mx-[17.5px] py-4 items-center grow text-background [font-family:Montserrat,_sans-serif] text-sm leading-0 whitespace-nowrap text-nowrap cursor-pointer max-md:mx-[0.5625rem] max-md:text-[0.8125rem] 2xl:mx-[21.5px] 2xl:text-[0.9375rem] hover:underline" href="/formations/automatisation-n8n">Automatisation &amp; n8n</a>
                    </li>
                    <li className="flex relative">
                      <a className="flex relative mx-[17.5px] py-4 items-center grow text-background [font-family:Montserrat,_sans-serif] text-sm leading-0 whitespace-nowrap text-nowrap cursor-pointer max-md:mx-[0.5625rem] max-md:text-[0.8125rem] 2xl:mx-[21.5px] 2xl:text-[0.9375rem] hover:underline" href="/formations/robotique">Robotique</a>
                    </li>
                    <li className="flex relative">
                      <a className="flex relative mx-[17.5px] py-4 items-center grow text-background [font-family:Montserrat,_sans-serif] text-sm leading-0 whitespace-nowrap text-nowrap cursor-pointer max-md:mx-[0.5625rem] max-md:text-[0.8125rem] 2xl:mx-[21.5px] 2xl:text-[0.9375rem] hover:underline" href="/formations/ia-recherche-sciences">IA, Recherche &amp; Sciences</a>
                    </li>
                    {listRow5Data.map((d, i) => <ListRow5 key={i} d={d} styles={ListRow5_styles[i]} />)}
                  </ul>
                  {" "}
                </nav>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div className="w-full flex relative min-w-0 flex-col gap-y-[0.1875rem] max-md:flex-wrap">
              <div className="block relative min-w-0 max-w-full gap-y-[0.1875rem]">
                <div className="block">
                  <div className="flex flex-col" data-ditto-id="style-div-43">
                    <div className="block grow">
                      <h3 className="block mt-2 mb-1.5 text-background [font-family:Montserrat,_sans-serif] text-[0.8125rem] leading-1.5 uppercase" data-ditto-id="style-link-14" data-component="heading">
                        <a className="inline cursor-pointer" data-component="link" href="mailto:info@hoja-academy.com">
                          {" Email "}
                        </a>
                        {" "}
                      </h3>
                      {" "}
                      <p className="block text-background text-[0.875rem]">
                        <a className="inline [font-family:Montserrat,_sans-serif] text-[0.9375rem] font-medium leading-[1.1875rem] cursor-pointer" data-component="link" href="mailto:info@hoja-academy.com">
                          info@hoja-academy.com
                        </a>
                        {" "}
                      </p>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <div className="block relative min-w-0 max-w-full gap-y-[0.1875rem]">
                <div className="h-[1.6875rem] block mb-2 overflow-hidden max-lg:h-[1.1875rem]">
                  <ul className="flex -mx-3 flex-wrap justify-start text-background [list-style-type:none] list-outside">
                    {listRow6Data.map((d, i) => <ListRow6 key={i} d={d} meta={ListRow6_meta[i]} />)}
                  </ul>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <div className="block relative min-w-0 max-w-full gap-y-[0.1875rem]">
                <div className="block">
                  <div className="block" data-ditto-id="interaction-span-6">
                    <a className="w-42 h-11 inline-block min-h-11 py-3 px-6 rounded-[33px] text-color-001 [font-family:Montserrat,_sans-serif] text-[0.9375rem] font-medium leading-[1.1875rem] text-center bg-primary cursor-pointer hover:bg-clr-22 hover:border-clr-23 focus:bg-clr-32 focus:border-primary" data-ditto-id="style-span-33" data-component="link" href="/contact">
                      {" "}
                      <span className="flex flex-row-reverse justify-center gap-[1.9375rem]">
                        {" "}
                        <span className="flex items-center">
                          {" "}
                          <Icon13 dittoId={"style-a-6"} />
                          {" "}
                        </span>
                        {" "}
                        <span className="block">Postuler</span>
                        {" "}
                      </span>
                      {" "}
                    </a>
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
          {" "}
          <div className="w-[30%] flex relative min-w-0 flex-col justify-start items-center gap-5 max-md:w-full max-md:min-h-[2.3125rem] max-md:flex-wrap max-lg:items-start max-lg:order-[-99999] md:max-lg:w-[70%] 2xl:w-[31.5%]">
            <div className="block relative min-w-0 max-w-full gap-5 text-center">
              <div className="block">
                <a className="inline-block text-color-001 [font-family:Montserrat,_sans-serif] text-[0.9375rem] font-medium leading-[1.1875rem] cursor-pointer" data-component="link" href="/">
                  {" "}
                  <img className="w-[22.5625rem] h-[2.3125rem] inline-block max-w-full overflow-clip aspect-[auto_2893/295] align-middle max-md:w-[20.9375rem] max-md:h-8.5 md:max-lg:w-[22.6875rem] 2xl:w-122.5 2xl:h-12.5" data-component="image" alt="" height="295" src="/assets/cloned/images/ca7c98260b3d.png" width="2893" />
                  {" "}
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div className="w-1/3 flex relative min-w-0 pt-2.5 flex-col items-end gap-y-[1.8125rem] max-md:w-full max-md:flex-wrap max-lg:items-start md:max-lg:w-[77%] 2xl:pt-0">
            <div className="w-[70%] block relative min-w-0 max-w-full gap-y-[1.8125rem] text-background text-sm font-light leading-[1.1875rem] text-end max-lg:[text-align:inherit] 2xl:text-[1rem]">
              <div className="block">
                <p className="block mb-[0.9rem]">
                  <strong className="inline font-normal">
                    HOJA ACADEMY
                  </strong>
                  {", branche académique de Hoja Network, forme professionnels, entreprises et chercheurs à utiliser l'IA concrètement : séances en direct, cas réels, automatisations et un système de travail à construire."}
                </p>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div className="block relative min-w-0 max-w-full gap-y-[1.8125rem] text-background text-base font-light leading-[1.1875rem] text-end max-lg:[text-align:inherit]">
              <div className="block whitespace-nowrap">
                {" HOJA ACADEMY © 2026 — Copyright "}
              </div>
              {" "}
            </div>
            {" "}
            <div className="w-full block relative min-w-0 max-w-full gap-y-[1.8125rem] max-md:hidden md:max-lg:w-[85%]">
              <div className="flex flex-col">
                <nav className="flex" data-component="nav" aria-label="Menu">
                  <ul className="flex relative z-2 flex-wrap justify-end leading-6 [list-style-type:none] list-outside after:content-[' '] after:block after:w-0 after:h-0 after:text-foreground after:text-[0rem] after:leading-0 after:[overflow:hidden] max-md:after:w-auto" id="menu-1-390e14f">
                    {listRow7Data.map((d, i) => <ListRow7 key={i} d={d} styles={ListRow7_styles[i]} />)}
                  </ul>
                  {" "}
                </nav>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div className="hidden relative min-w-0 max-w-full gap-y-[1.8125rem] max-md:block" data-ditto-id="style-span-24">
              <div className="flex flex-col">
                <nav className="flex min-w-0" aria-label="Menu">
                  <ul className="flex relative z-2 min-w-0 flex-wrap justify-start leading-6 [list-style-type:none] list-outside after:content-[' '] after:block after:h-0 after:text-foreground after:text-[0rem] after:leading-0 after:[overflow:hidden] max-md:after:w-0" id="menu-1-74a24f8">
                    {listRow8Data.map((d, i) => <ListRow8 key={i} d={d} meta={ListRow8_meta[i]} styles={ListRow8_styles[i]} />)}
                  </ul>
                  {" "}
                </nav>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
        <div className="flex relative min-w-0 gap-5 max-md:flex-wrap">
          <div className="w-[22.825rem] flex relative min-w-0 flex-col justify-center items-start max-lg:hidden 2xl:w-[566.7px]">
            <div className="block relative min-w-0 max-w-full">
              <div className="block">
                <div className="block">
                    
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div className="w-full flex relative min-w-0 flex-col gap-5 max-md:flex-wrap max-lg:items-center">
            <div className="block relative min-w-0 max-w-full gap-5 text-center">
              <div className="block" data-ditto-id="style-link-15">
                <span className="inline-block text-background [font-family:Montserrat,_sans-serif] text-[1.125rem] font-bold tracking-[0.4em] uppercase">LEARN AI</span>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div className="w-[22.825rem] flex relative min-w-0 flex-col max-md:w-[20.9375rem] max-md:flex-wrap md:max-lg:w-[55.1px] 2xl:w-[566.7px]">
          </div>
          {" "}
        </div>
        {" "}
      </footer>
      {" "}
    </footer>
  );
}
