import Image from "next/image";
import TabImage from "../Cards/TabImage";
import { fetchGalleryData } from "@/actions/fetchGalleryData";
import Link from "next/link";

const RoomCard = async () => {
  const gallery = await fetchGalleryData();
  console.log(gallery);
  if (!gallery) {
    return;
  }
  return (
    <>
      <div className="px-[15px] mb-[32px]">
        <div>
          <h2 className="mb-[8px] text-2xl font-semibold">
            {gallery.items[0]?.mainHeading}
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-[14px] lg:w-[70%] line-clamp-2 font-normal">
              {gallery.items[0]?.description}
            </p>
            <div className="border hidden border-black rounded-full lg:flex items-center justify-center h-[40px] cursor-pointer hover:border-gray-700 transition-colors">
              <Link
                href={`offers/new/${gallery.items[0].offer
                  .replace(/%/g, "percent")
                  .replace(/ /g, "-")}`}
              >
                <div className="flex items-center gap-5 px-5">
                  <p className="text-[12px] font-semibold">
                    Shop all New lower price
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
      {gallery && (
        <div className="px-[15px] flex justify-between mx-auto mb-[12px] lg:mb-10 ">
          <div className=" w-full flex justify-center  screens ">
            <div className="w-full h-[1000px] md:h-[730px] grid grid-cols-2 lg:grid-cols-12 gap-y-4  gap-x-4 auto-rows-fr">
              {/* 1 */}
              <div
                className="parent col-start-1 col-end-3 row-start-1  lg:mb-0 row-end-6
              lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-12 
            "
                d
              >
                <Link
                  href={`offers/new/${gallery.items[0].offer
                    .replace(/%/g, "percent")
                    .replace(/ /g, "-")}`}
                >
                  <div className="parent relative w-full h-full">
                    <Image
                      loading="eager"
                      className="child object-cover rounded-sm"
                      src={gallery.items[0].img}
                      layout="fill"
                      alt={gallery.items[0].heading}
                    />
                    <div className="absolute bottom-0 left-0 justify-start p-[30px] items-center ">
                      <div className="flex flex-col">
                        <h2 className="text-white  text-[12px]">
                          {gallery.items[0].heading}
                        </h2>
                        <p className="text-[12px] font-semibold text-blue-500">
                          View More
                        </p>
                      </div>
                      {/* <button className="bg-black hover:bg-zinc-300 text-white  py-2 px-10 h-12 rounded-full">
                        {gallery.items[0].buttonText}
                      </button> */}
                    </div>
                  </div>
                </Link>
              </div>
              {/* 2 */}
              <div
                className="parent col-start-1 col-end-2 row-start-6 row-span-2
              lg:col-start-7 lg:col-end-10 lg:row-start-1 lg:row-end-6
            "
              >
                {
                  <>
                    {gallery.mode == "room" && (
                      <TabImage
                        src={gallery?.rooms[0]?.imgSrc}
                        href={`/${gallery?.rooms[0]?.productCategory.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                        alt={`Image  of Children`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[0]?.children}
                        firstData
                      />
                    )}
                  </>
                }
              </div>
              {/* 3 */}
              <div
                className=" parent  col-start-2 col-end-3 row-start-6 row-span-3
            lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-7
            "
              >
                {
                  <>
                    {gallery.mode === "room" && (
                      <TabImage
                        src={gallery?.rooms[1]?.imgSrc}
                        alt={`Image  of Children`}
                        href={`/${gallery?.rooms[1]?.productCategory.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[1]?.children}
                      />
                    )}
                  </>
                }
              </div>
              {/* 4 */}
              <div
                className=" parent col-start-1 col-end-2 row-start-8 row-span-3
              lg:col-start-7 lg:col-end-10 lg:row-start-6 lg:row-end-12
            "
              >
                {
                  <>
                    {gallery.mode === "room" && (
                      <TabImage
                        src={gallery?.rooms[2]?.imgSrc}
                        alt={`Image  of Children`}
                        href={`/${gallery?.rooms[2]?.productCategory.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[2]?.children}
                      />
                    )}
                  </>
                }
              </div>
              {/* 5 */}
              <div
                className=" parent col-start-2 col-end-3 row-start-9 row-span-2
              lg:col-start-10 lg:col-end-13 lg:row-start-7 lg:row-end-12
            "
              >
                {
                  <>
                    {gallery.mode === "room" && (
                      <TabImage
                        src={gallery?.rooms[3]?.imgSrc}
                        href={`/${gallery?.rooms[3]?.productCategory.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                        alt={`Image  of Children`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[3]?.children}
                      />
                    )}
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      )}
      <Link
        href={`heading/offers/${gallery?.items[0].offer.replace(/ /g, "-")}`}
      >
        <div className="flex mb-[20px] h-[60px] border-b px-[15px] items-center justify-between lg:hidden">
          <p className="text-[14px] font-semibold">Shop all New lower price</p>
          <Image
            loading="lazy"
            src={"/icons/downarrow.svg"}
            width={15}
            height={15}
            alt="arrow icon"
          />
        </div>
      </Link>
    </>
  );
};

export default RoomCard;
