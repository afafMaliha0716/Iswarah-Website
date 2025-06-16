import Slider from "rc-slider";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";



export default function PriceFilter() {
    const router = useRouter();
    const { category = "" } = router.query;

    const [range, setRange] = useState<[number, number]>([1, 25]);
    const [values, setValues] = useState<[number, number]>([1, 25]);

    useEffect(() => {
        if (!router.isReady) return;

        const qs = category ? `?category=${category}` : "";
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/price-range/${qs}`)
        .then((res) => res.json())
        .then(({ min_price, max_price }) => {
            const range: [number, number] = [min_price, max_price];
            setRange(range);
            setValues(range);
        })
        .catch((err) => console.error("Error fetching price range:", err));
    }, [router.isReady, category]);

    const onAfterChange = (v: number | number[]) => {
        const [min, max] = v as [number, number];
        setValues([min, max]);
        router.push(
        {
            pathname: router.pathname,
            query: {
            ...category && { category }, // include category if it exists
            Price: `${min}-${max}`, // update Price only
            ...router.query, // keep other query params intact
            },
        },
        undefined,
        { shallow: true } // client‐side only, no full reload
        );
    };


    return range[0] !== range[1] ?(
        <>
        <label htmlFor="">Price Range:</label>

          <div className="relative">
            <Slider
              range
              min={range[0]}
              max={range[1]}
              step={1}
              pushable={1}
              allowCross={false} // prevents thumbs from swapping
              value={values}
              onChange={(v) => setValues(v as [number, number])}
              styles={{
                track: { backgroundColor: "#000" },
                handle: {
                  backgroundColor: "#000",
                  scale: 0.75,
                  borderColor: "#000",
                },
              }}
              onChangeComplete={(v) => onAfterChange(v as [number, number])}
            />
            <div className="mt-2 text-sm">
              Price: ${values[0]} – ${values[1]}
            </div>
            <div className="flex justify-between mt2">
              {/* <span className="text-sm">{range[0]}</span>
              <span className="text-sm">{range[1]}</span> */}
            </div>
          </div>
        </>
    ): null;
}
