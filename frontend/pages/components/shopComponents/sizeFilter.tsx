import Slider from "rc-slider";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";


interface Size{
    id: number;
    name: string; 
    slug: string;
}

export default function SizeFilter() {
    const router = useRouter();
    const { category = "" } = router.query;
    const { Price = "" } = router.query;


    let sizeExist= false;
    const [exist, setExist] = useState<boolean>(false);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [activeSizes, setActiveSizes] = useState<Set<string>>(new Set());



    useEffect(() => {
        if(!router.isReady) return;

        const qs = category ? `?category=${category}` : "";

        let sizeExist =
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/catSizeRange/${qs}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.length > 0) {
                setExist(true);
                setSizes(data);
                console.log(data);
            } else {
                setExist(false);
            }
        })
        .catch((err) => console.error("Error fetching sizes:", err));

        setActiveSizes(new Set());
        

        
    }, [router.isReady, category]);
    

     const updateRouterFilter = (newSet: Set<string>) => {
    // Convert the Set to an array to join the slugs into a comma-separated string.
    const sizesFilter = Array.from(newSet).join(",");
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          sizes: sizesFilter,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleCheckboxChange = (sizeSlug: string) => {
    // Create a new Set as a copy
    const newActiveSizes = new Set(activeSizes);
    if (newActiveSizes.has(sizeSlug)) {
      // Remove it if it already exists
      newActiveSizes.delete(sizeSlug);
    } else {
      // Otherwise, add it
      newActiveSizes.add(sizeSlug);
    }
    setActiveSizes(newActiveSizes);
    updateRouterFilter(newActiveSizes);
  };

    return exist ?(
        <>
        <label htmlFor="">PTESSSSSSSSSSSTER:</label>
        {sizes.map((size) => (
            <div key={size.slug} className="flex items-center">
                <input
                    type="checkbox"
                    id={size.slug}
                    name={size.name}
                    value={size.name}
                    onChange={() => handleCheckboxChange(size.slug)}
                    checked = {activeSizes.has(size.slug)}
                    className="mr-2"
                />
                <span className="text-sm">{size.name}</span>
                {/* <label htmlFor={size}>{size}</label> */}
            </div>
        ))}
        </>
    ): null;
}
