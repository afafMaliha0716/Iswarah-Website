import { GetStaticPaths, GetStaticProps } from "next";
import { Product } from "../components/shopComponents/shopGallery"; // Adjust the import path as needed
import Link from "next/link";
import Image from "next/image";

type ProductPageProps = {
  product: Product; // Product details or null if not found
};

type CartItems = {
  slug: string;
  qty: number;
};

export default function ProductPage({ product }: ProductPageProps) {
  //Cart functionality
  const addTOCart = (productSlug: string) => {
    const cart: CartItems[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const index: number = cart.findIndex((item) => item.slug === productSlug);

    if (index !== -1) {
      cart[index].qty += 1;
    } else {
      cart.push({ slug: productSlug, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(localStorage.getItem("cart"));
  };

  const getCart = () => {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  };

  return (
    <>
      <div>
        <h1>Product: {product.name}</h1>
        <p>Description: {product.description}</p>
        <p>Price: ${product.price}</p>
        <p>In Stock: {product.in_stock ? "Yes" : "No"}</p>
        {product.image && (
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`}
            alt={product.name}
            width={256}
            height={256}
            className="w-64 h-64 object-cover"
          />
        )}
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => addTOCart(product.slug)}
      >
        Add to Cart
      </button>


      <div>
        <label htmlFor="sizeSelect">Select Size:</label>
        <select id="sizeSelect" name="size" className="border rounded p-2 w-2xl">
          {product.sizes.map((size) => (
            
            <option key={size.id} value={size.slug}>
              {size.name}
            </option>
          ))}
        </select>
      </div>

      <div className="absolute bottom-4 right-4">
        <Link href="/shop" className="text-blue-500 hover:underline border-4">
          Back to rpidyc
        </Link>
      </div>

    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`);
  const products: Product[] = await res.json();

  return {
    paths: products.map((p) => ({ params: { slug: p.slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<ProductPageProps> = async ({
  params,
}) => {
  const slug = params!.slug as string;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${encodeURIComponent(slug)}/`
  );
  if (res.status === 404) return { notFound: true };

  const product: Product = await res.json();
  return {
    props: { product },
    revalidate: 60,
  };
};
