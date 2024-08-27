import { checkKeyword } from "@/actions/checkKeyword";
import { getProductByProductId } from "@/actions/getProductByProductId";
import { fetchSuggestionData } from "@/components/Features/api";
import ProductPage from "@/components/ProductPage/ProductPage";
import { RoomsPage } from "@/components/Rooms/RoomsPage";
import Suggestion from "@/components/suggestion/Suggestion";
import { getAggregateRating } from "@/utils/getAggregateRating";
import axios from "axios";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  ProductJsonLd,
  WebPageJsonLd,
} from "next-seo";
import { redirect } from "next/navigation";

export const generateMetadata = async ({ params }) => {
  const productId = params.subtitle;

  if (params.title === "category") {
    return null;
  }

  if (productId?.endsWith(".html") || productId?.endsWith(".svg")) {
    return null;
  }

  const isRoomPage = params.subtitle === "rooms";
  const isInspirationPage = params.subtitle === "inspiration";

  if (isRoomPage) {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getRoommain`,
      {
        params: {
          roomType: params.title.replace(/-/g, " "),
        },
      }
    );

    const roomData = response.data;

    return {
      title: roomData?.metadata?.title || roomData?.roomType || params.roomType,
      description: roomData?.summary || "",
      openGraph: {
        title:
          roomData?.metadata?.title || roomData?.roomType || params.roomType,
        description: roomData?.summary || "",
        images: [
          {
            url: roomData?.mainImage?.imgSrc,
            alt: roomData?.roomType || params.roomType,
          },
        ],
      },
    };
  }

  if (isInspirationPage) {
    const suggestion = await fetchSuggestionData(
      params.title?.replace(/-/g, " ")
    );

    return {
      title: suggestion?.metadata?.title,
      description: suggestion.summary,
      openGraph: {
        title: suggestion?.metadata?.title,
        description: suggestion.summary,
        images: [
          {
            url: suggestion.mainImage.imgSrc,
          },
        ],
      },
    };
  }

  const product =
    isRoomPage || isInspirationPage
      ? null
      : await getProductByProductId(productId);

  if (product?.error) {
    return null;
  }

  if (!product && !isRoomPage && !isInspirationPage) {
    return null;
  }

  return {
    title: product?.productTitle || params.title?.replace(/-/g, " "),
    description: product?.productDescription || "",
    openGraph: {
      title: product?.productTitle || params.title?.replace(/-/g, " "),
      description: product?.productDescription,
      images: product?.images.map((image) => ({
        url: image,
        alt: product?.productTitle || params.title?.replace(/-/g, " "),
      })),
    },
  };
};

const Page = async ({ params }) => {
  const productId = params.subtitle;

  if (productId === "collection") {
    return redirect(`/${params.title}/collection/all`);
  }

  if (productId === "subcollection") {
    const keywordDetails = await checkKeyword(params.title.replace(/-/g, " "));
    const parentCategory = keywordDetails?.parentCategory;

    if (!parentCategory) {
      return redirect("/");
    }

    return redirect(`/${params.title}/subcollection/${parentCategory}`);
  }

  if (productId?.endsWith(".html") || productId?.endsWith(".svg")) {
    return null;
  }

  const isRoomPage = params.subtitle === "rooms";
  const isInspirationPage = params.subtitle === "inspiration";

  const product =
    isRoomPage || isInspirationPage
      ? null
      : await getProductByProductId(productId);

  if (!product && !isRoomPage && !isInspirationPage) {
    return null;
  }

  const productImages = product?.images;

  const ratings = product?.ratings;

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

  if (isRoomPage) {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getRoommain`,
      {
        params: {
          roomType: params.title.replace(/-/g, " "),
        },
      }
    );

    const roomData = response.data;

    return (
      <>
        <WebPageJsonLd
          useAppDir={true}
          name={
            roomData?.metadata?.title || roomData?.roomType || params.roomType
          }
          description={roomData?.summary || ""}
          id={`https://www.ayatrio.com/rooms/${params.roomType}`}
        />
        <RoomsPage params={params.title} />;
      </>
    );
  }

  if (isInspirationPage) {
    const suggestion = await fetchSuggestionData(
      params.title?.replace(/-/g, " ")
    );

    return (
      <>
        <ArticleJsonLd
          useAppDir={true}
          type="BlogPosting"
          title={suggestion.metadata.title}
          description={suggestion.summary}
          images={[suggestion.mainImage, suggestion.suggestionCardImage]}
          datePublished={suggestion.createdAt?.toString()}
          dateModified={suggestion.updatedAt?.toString()}
          authorName={suggestion.author?.name || "Ayatrio"}
        />
        <Suggestion id={params.title.replace(/-/g, " ")} />;
      </>
    );
  }

  return (
    <>
      <ProductJsonLd
        useAppDir={true}
        productName={product?.productTitle}
        images={productImages}
        description={product?.productDescription}
        brand="Ayatrio"
        offers={[
          {
            price: product?.specialprice?.price,
            priceCurrency: "INR",
            priceValidUntil: product?.specialprice?.endDate,
            itemCondition: "https://schema.org/NewCondition",
            availability: "https://schema.org/InStock",
            url: `https://www.ayatrio.com/${params.title?.replace(/-/g, " ")}`,
            seller: {
              name: product?.seller || "Ayatrio",
            },
          },
        ]}
        reviews={!!reviews?.length ? reviews : null}
        aggregateRating={!!reviews?.length ? aggregateRating : null}
      />
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: "Home",
            item: "https://www.ayatrio.com",
          },
          {
            position: 2,
            name: product?.productTitle || params.title?.replace(/-/g, " "),
            item: `https://www.ayatrio.com/${params.title?.replace(/-/g, " ")}`,
          },
        ]}
      />
      <ProductPage
        title={params.title.replace(/-/g, " ")}
        productId={productId}
        initialData={product}
      />
    </>
  );
};

export default Page;
