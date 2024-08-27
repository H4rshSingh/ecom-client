// import axios from "axios";
import { fetchDisplayData } from "@/actions/fetchDisplayData";
import Image from "next/image";

import TabImage from "../Cards/TabImage";
import Link from "next/link";
import "./styles.css";

const Display = async () => {
  const apiData = await fetchDisplayData();
  return (
    <div>
      {apiData && apiData.length > 0 && apiData[0].grid && apiData[0].grid.length > 0 && (
        <>
          <div className="px-[15px] mt-[20px] lg:mt-0 pt-[30px] mb-[32px]">
            <div>
              <h2 className="mb-[8px] text-2xl font-semibold">
                {apiData[0]?.mainHeading}
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-[14px] lg:w-[70%] line-clamp-2 lg:line-clamp-none font-normal">
                  {apiData[0]?.description}
                </p>
                <div className="border hidden border-black rounded-full lg:flex items-center justify-center h-[40px] cursor-pointer hover:border-gray-700 transition-colors">
                  <Link href={apiData[0]?.link}>
                    <div className="flex items-center px-6 gap-5">
                      <p className="text-[12px] font-semibold">
                        For more floor inspiration
                      </p>
                      <Image
                        loading="lazy"
                        src={"/icons/top_arrow-black.svg"}
                        height={15}
                        width={15}
                        alt="arrow icon"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="px-[15px] flex flex-col  lg:grid lg:grid-cols-2 md:flex-row gap-4  items-center justify-between mx-auto my-8">
            <div className="w-full">
              <>
                <div
                  className={`relative w-full h-[492px] screen  lg:min-h-[730px] max-w-1/2`}
                >
                  <TabImage
                    src={apiData[0].grid[0].room.imgSrc}
                    href={`/${apiData[0].grid[0].room?.productCategory?.replace(
                      / /g,
                      "-"
                    )}/collection/all`}
                    alt={`Image  of Children`}
                    width={1000}
                    height={338}
                    firstData
                    labelData={apiData[0].grid[0].room.children}
                    className="w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 justify-start p-[30px]">
                    <div>
                      <h2 className="text-white text-[12px]">
                        {apiData[0].grid[0].text}
                      </h2>
                      <Link
                        href={`/${apiData[0].grid[0].room?.productCategory?.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                      >
                        <p className="text-blue-500 text-[12px] font-semibold">
                          View More
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            </div>
            <div className="max-w-1/2 w-full">
              <>
                <div
                  className={`relative w-full h-[492px] screen lg:min-h-[730px]  max-w-1/2 `}
                >
                  <TabImage
                    src={apiData[0]?.grid[1].room.imgSrc}
                    href={`/${apiData[0].grid[1].room?.productCategory?.replace(
                      / /g,
                      "-"
                    )}/collection/all`}
                    alt={`Image  of Children`}
                    width={1000}
                    height={338}
                    labelData={apiData[0]?.grid[1].room.children}
                  />
                  <div className="absolute bottom-0 left-0 justify-start p-[30px]">
                    <div>
                      <h2 className="text-white text-[12px]">
                        {apiData[0]?.grid[1].text}
                      </h2>

                      <Link
                        href={`/${apiData[0].room?.productCategory?.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                      >
                        <p className="text-blue-500 text-[12px] font-semibold">
                          View More
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Display;
