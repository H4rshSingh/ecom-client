"use client";

import React, { useEffect, useState } from "react";
import "./styles.css";
import { useSelector, useDispatch } from "react-redux";
import { selectTrendingData } from "../Features/Slices/trendingSlice";
import { selecteddbItems } from "../Features/Slices/cartSlice";
import dynamic from "next/dynamic";
const TrendingSlider = dynamic(() => import("./TrendingSlider"))

const Trending = () => {
  const [newTrendingData, setNewTrendingData] = useState([]);
  // const [cartData, setCartData] = useState([]);
  const trendingData = useSelector(selectTrendingData);
  const dispatch = useDispatch();
  const cartData = useSelector(selecteddbItems);
  // const [TrendingData, setTrendingData] = useState([]);

  useEffect(() => {
    dispatch({ type: "FETCH_TRENDING_DATA", payload: "trending" });
  }, []);

  useEffect(() => {
    if (trendingData.length === 0) {
      dispatch({ type: "FETCH_TRENDING_DATA", payload: "trending" });
    }
    if (trendingData) {
      setNewTrendingData(trendingData);
    }
  }, [trendingData]);

  // useEffect(() => {
  //   const trendindData = newTrendingData.filter(
  //     (item) => item.subcategory !== "Accessories"
  //   );
  //   console.log(trendindData);
  //   if (trendindData.length > 0) {
  //     setTrendingData(trendindData);
  //   }
  // }, [newTrendingData]);


  const isProductInCart = (productId) => {
    console.log("Checking product ID:", productId);
    return cartData?.items?.some((cartItem) => {
      console.log(
        "Comparing with cart item product ID:",
        cartItem?.productId?._id
      );
      return cartItem?.productId?._id === productId;
    });
  };

  return (
    <div>
      <div className="mb-20 bg-white px-[15px]">
        <div className="mb-2 w-full flex justify-between items-center">
          <h2 className="Blinds font-semibold text-2xl pb-[20px] lg:pt-[30px]">
            {newTrendingData && newTrendingData.length === 0
              ? "Most Family Choice(Empty)"
              : "Most Family Choice"}
          </h2>
        </div>
        <TrendingSlider
          trendingData={newTrendingData}
          isProductInCart={isProductInCart}
        />
        <div className="swiper-scrollbar-custom h-[2px]"></div>
      </div>
    </div>
  );
};

export default Trending;
