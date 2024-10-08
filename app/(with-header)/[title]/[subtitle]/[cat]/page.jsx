import React from "react";
import ProductPage from "../Meta";
import { BreadcrumbJsonLd, ProductJsonLd, WebPageJsonLd } from "next-seo";
import {
  createApiEndpoint,
  getCategoryByName,
} from "@/components/Features/api";
import { BASE_URL } from "@/constants/base-url";
import { getAggregateRating } from "@/utils/getAggregateRating";
import axios from "axios";
import { getOffer } from "@/actions/getOffer";

export async function generateMetadata({ params }) {
  const isCategoryPage = params.title !== "offers" && params.cat === "all";
  const isOfferPage = params.title === "offers";

  const isSubcategoryPage =
    !isCategoryPage && !isOfferPage && params.subtitle === "subcollection";

  const categoryName = isSubcategoryPage
    ? params.cat.replace(/-/g, " ")
    : params.title.replace(/-/g, " ");

  const subCategory = params.title.replace(/-/g, " ");

  const category = await getCategoryByName(categoryName);

  const subcategories = category?.subcategories;

  if (isCategoryPage) {
    return {
      title: category?.metadata?.title || category?.name || params.title,
      description: category?.description || "",
      openGraph: {
        title: category?.metadata?.title || category?.name || params.title,
        description: category?.description || "",
        images: [
          {
            url: category?.image,
            alt: category?.name || params.title,
          },
        ],
      },
    };
  }

  if (isOfferPage) {
    const offerType = params.cat?.replace(/-/g, " ").replace("percent", "%");

    const offer = await getOffer(offerType);

    return {
      title: offer.metadata?.title || offerType,
      description: offer.description || "",
      openGraph: {
        title: offer.metadata?.title || offerType,
        description: offer.description || "",
        images: [
          {
            url: "/ayatrio-room.jpg",
            width: 600,
            height: 600,
            alt: "Ayatrio India-Affordable Home Furnishing & Decor designs & ideas",
          },
        ],
      },
    };
  }

  const currentSubcategory = subcategories?.find(
    (subcategory) => subcategory.name === subCategory
  );

  return {
    title:
      currentSubcategory?.metadata?.title ||
      currentSubcategory?.name ||
      params.cat,
    description: currentSubcategory?.description || "",
    openGraph: {
      title:
        currentSubcategory?.metadata?.title ||
        currentSubcategory?.name ||
        params.cat,
      description: currentSubcategory?.description || "",
      images: [
        {
          url: currentSubcategory?.img,
          alt: currentSubcategory?.name || params.cat,
        },
      ],
    },
  };
}

const page = async ({ params }) => {
  if (params.title === "offers") {
    return <ProductPage params={params} isSubcategoryPage={false} />;
  }

  const isCategoryPage = params.title !== "offers" && params.cat === "all";
  const isOfferPage = params.title === "offers";

  const isSubcategoryPage =
    !isCategoryPage && !isOfferPage && params.subtitle === "subcollection";

  const categoryName = isSubcategoryPage
    ? params.cat.replace(/-/g, " ")
    : params.title.replace(/-/g, " ");

  const subCategory = params.title.replace(/-/g, " ");

  const category = await getCategoryByName(categoryName);

  const subcategories = category?.subcategories;

  const currentSubcategory = subcategories?.find((subcategory) => {
    if (isSubcategoryPage)
      return subcategory.name === params.title.replace(/-/g, " ");

    return subcategory.name === params.cat.replace(/-/g, " ");
  });

  const subcategoriesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: subcategories?.map((subcategory, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: subcategory?.name,
      description: subcategory?.description || "",
    })),
  };

  const categoryProductsResponse = await axios.get(
    createApiEndpoint(`fetchProductsByCategory/${categoryName}`)
  );

  const categoryProducts = categoryProductsResponse?.data;

  const subcategoryProducts = categoryProducts?.filter?.((product) => {
    if (isSubcategoryPage)
      return product.subcategory === params.title.replace(/-/g, " ");

    return product.subcategory === params.cat.replace(/-/g, " ");
  });

  return (
    <>
      {isCategoryPage ? (
        <script
          defer
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(subcategoriesJsonLd),
          }}
        />
      ) : null}
      <WebPageJsonLd
        useAppDir={true}
        name={
          isCategoryPage
            ? category?.metadata?.title ||
              category?.name ||
              params.parentCategory
            : currentSubcategory?.metadata?.title || currentSubcategory?.name
        }
        description={
          isCategoryPage
            ? category?.description || ""
            : currentSubcategory?.description || ""
        }
        id={`https://www.ayatrio.com/${params.title}/${params.subtitle}/${params.cat}`}
      />
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: "Home",
            item: "https://www.ayatrio.com/",
          },
          {
            position: 2,
            name: decodeURIComponent(params.title),
            item: "https://www.ayatrio.com/" + params.title,
          },
          {
            position: 3,
            name: decodeURIComponent(params.subtitle),
            item:
              "https://www.ayatrio.com/" + params.title + "/" + params.subtitle,
          },
          {
            position: 4,
            name: decodeURIComponent(params.cat),
            item:
              "https://www.ayatrio.com/" +
              params.title +
              "/" +
              params.subtitle +
              "/" +
              params.cat,
          },
        ]}
      />
      {isCategoryPage &&
        categoryProducts?.map((product) => {
          const ratings = product.ratings;

          const reviews = ratings?.map((review) => {
            return {
              author: review.name,
              name: review.comment,
              reviewBody: review.comment,
              reviewRating: {
                ratingValue: `${review.rating}`,
              },
            };
          });

          const aggregateRating = getAggregateRating(ratings);

          const images = [];

          product.productImages.forEach((imageObject) => {
            imageObject.images.forEach((image) => images.push(image));
          });

          return (
            <ProductJsonLd
              key={product._id}
              useAppDir={true}
              productName={product.productTitle}
              description={product.productDescription}
              images={images}
              brand={product.brand || "Ayatrio"}
              offers={[
                {
                  price: product.specialprice?.price,
                  priceCurrency: "INR",
                  priceValidUntil: product.specialprice?.endDate,
                  itemCondition: "https://schema.org/NewCondition",
                  availability: "https://schema.org/InStock",
                  url: `${BASE_URL}/${product.productTitle}/${product.productId}`,
                  seller: {
                    name: "Ayatrio",
                  },
                },
              ]}
              reviews={!!reviews?.length ? reviews : null}
              aggregateRating={!!reviews?.length ? aggregateRating : null}
            />
          );
        })}
      {!isCategoryPage &&
        !isOfferPage &&
        subcategoryProducts?.map((product) => {
          const ratings = product.ratings;

          const reviews = ratings?.map((review) => {
            return {
              author: review.name,
              name: review.comment,
              reviewBody: review.comment,
              reviewRating: {
                ratingValue: `${review.rating}`,
              },
            };
          });

          const aggregateRating = getAggregateRating(ratings);

          const images = [];

          product.productImages.forEach((imageObject) => {
            imageObject.images.forEach((image) => images.push(image));
          });

          return (
            <ProductJsonLd
              key={product._id}
              useAppDir={true}
              productName={product.productTitle}
              description={product.productDescription}
              images={images}
              brand={product.brand || "Ayatrio"}
              offers={[
                {
                  price: product.specialprice?.price,
                  priceCurrency: "INR",
                  priceValidUntil: product.specialprice?.endDate,
                  itemCondition: "https://schema.org/NewCondition",
                  availability: "https://schema.org/InStock",
                  url: `${BASE_URL}/${product.productTitle}/${product.productId}`,
                  seller: {
                    name: "Ayatrio",
                  },
                },
              ]}
              reviews={!!reviews?.length ? reviews : null}
              aggregateRating={!!reviews?.length ? aggregateRating : null}
            />
          );
        })}
      <ProductPage
        params={params}
        isSubcategoryPage={isSubcategoryPage}
        initialParentCategory={
          isSubcategoryPage
            ? params.cat.replace(/-/g, " ")
            : params.title.replace(/-/g, " ")
        }
        initialSubcategory={
          isSubcategoryPage
            ? subCategory
            : params.cat.replace(/-/g, " ").replace(/percent/g, "%")
        }
      />
    </>
  );
};

export default page;
