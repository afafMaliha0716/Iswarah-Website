import { GetStaticProps } from "next";
import Home from "../components/shopComponents/shopGallery";
import Filter from "../components/shopComponents/filter";
import { getProducts } from "../api/backendAPI";
import { Product } from "../components/shopComponents/shopGallery";
import {useRouter} from "next/router";
import { useEffect, useState } from "react";

interface ShopProps {
  products: Product[];
  categories: Category[];
}

interface Category {
   name: string;
    slug: string;
  }
export default function Shop({ products: initial, categories }: ShopProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initial);

  useEffect(() => {
    // wait until router has parsed the URL
    if (!router.isReady) return;

    const { category, Price, sizes } = router.query;
    const filters: Record<string, string | number> = {};
    if (category) filters.category = category as string;
    if (Price) filters.Price = Price as string;
    if(sizes) filters.sizes = sizes as string;

    getProducts(filters)
    .then(setProducts)
    .catch(console.error);
  }, [router.isReady, router.query.category, router.query.Price, router.query.sizes]);


  return (
    <>
      <div className="w-1/5 h-screen fixed left-0 bg-gray-100 p-4">
        <Filter categories={categories}/>
      </div>
      <div className="w-4/5 ml-auto p-8 align-left">
        <Home products={products} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const products: Product[] = await getProducts();
    const cat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`);
    const categories: Category[] = await cat.json();
    return {
      props: {
        products,
        categories
      },
      revalidate: 60, // revalidate every 60 seconds
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        products: [],
        categories: [],
      },
      revalidate: 60,
    };
  }
};
