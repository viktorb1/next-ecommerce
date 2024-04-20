import React from "react";
import Image from "next/image";
import { SearchParamTypes } from "@/app/types/SearchParamTypes";
import { formatPrice } from "@/util/priceFormat";
import AddCart from "./AddCart";

const Product = ({ searchParams }: SearchParamTypes) => {
  return (
    <div className="flex xl:flex-row flex-col justify-around gap-24 text-gray-700">
      <Image src={searchParams.image} alt={searchParams.name} width={600} height={600} />
      <div className="font-medium text-gray-700">
        <h1 className="text-2xl font-medium py-2">{searchParams.name}</h1>
        <p className="py-2">{searchParams.description}</p>
        <p className="py-2">{searchParams.features}</p>
        <div className="flex gap-2">
          <p className="font-bold text-teal-700">{searchParams.unit_amount && formatPrice(searchParams.unit_amount)}</p>
        </div>
        <AddCart {...searchParams} />
      </div>
    </div>
  );
};

export default Product;
