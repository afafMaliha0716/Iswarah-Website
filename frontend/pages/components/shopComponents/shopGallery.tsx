import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import itemCard from "./itemCard";

export interface Product {
  id: number; // Django’s auto-generated primary key
  name: string; // CharField → string
  slug: string; // SlugField → string (used for URL)
  description: string; // TextField → string
  price: number; // DecimalField → number
  in_stock: boolean; // BooleanField → boolean
  created_at: string; // DateTimeField → ISO date string
  image: string | null; // ImageField → URL (string) or null if blank
  sizes: Size[];
}

interface Size{
  id: number,
  name: string,
  slug: string,
}

interface HomeProps {
  products: Product[];
}

export default function Home({ products }: HomeProps) {
  return (
    <>
      <h1>Product List:</h1>
      <div
        className="grid gap-4 p-8
        grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]"
      >
        {products.map((p) => {
          const src = `${process.env.NEXT_PUBLIC_BACKEND_URL}${p.image}`;
          return (
            <>
              {itemCard(p, src)}
            </>
          )
        })}
      </div>
    </>
  );
}

