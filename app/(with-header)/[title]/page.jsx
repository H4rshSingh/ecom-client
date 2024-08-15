import { checkKeyword } from "@/actions/checkKeyword";
import { redirect } from "next/navigation";

const Page = async ({ params }) => {
  const title = params.title.replace(/-/g, " ");

  const keywordDetails = await checkKeyword(title);

  const type = keywordDetails?.type;
  const parentCategory = keywordDetails?.parentCategory;

  if (!keywordDetails || !type) {
    return redirect("/");
  }

  switch (type) {
    case "category":
      return redirect(`/${params.title}/collection/all`);

    case "subcategory":
      return redirect(`/${params.title}/subcollection/${parentCategory}`);

    default:
      break;
  }

  // return redirect(`/${params.title}/collection/all`);
};

export default Page;
