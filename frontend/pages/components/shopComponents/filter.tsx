import React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import "rc-slider/assets/index.css";
import PriceFilter from "./priceFilter";  
import { GetStaticProps } from "next";

interface Category { name: string; slug: string; }

export default function Filter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const { category = "" } = router.query as { category?: string };

  const handleCategoryClick = (slug: string) => {
    router.push({ query: { category: slug } }, undefined, { shallow: true });
  };

  return (
    <div className="p-4 w-4/5">
      <h1>Filter Component</h1>
      <ul>
        <li
          onClick={() => handleCategoryClick("")}
          className={!category ? "font-bold" : ""}
          style={{ cursor: "pointer" }}
        >
          All Products
        </li>
        {categories.map(cat => (
          <li
            key={cat.slug}
            onClick={() => handleCategoryClick(cat.slug)}
            className={category === cat.slug ? "font-bold" : ""}
            style={{ cursor: "pointer" }}
          >
            {cat.name}
          </li>
        ))}
      </ul>
      {<PriceFilter />}
    </div>
  );
}









