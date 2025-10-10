// src/pages/Home.tsx
import { FC, useState, useEffect } from "react";
import Layout from "../layouts/MainLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroSlider from "../components/home/HeroSlider";
import CategoryList from "../components/home/CategoryList";
import FeaturedProducts from "../components/home/NewProducts";
import BestSellProducts from "../components/home/BestSellProducts";
import MostViewedProducts from "../components/home/MostViewedProducts";
import TopDiscountProducts from "../components/home/TopDiscountProducts";
import Navbar from "../components/Navbar";

const slides = [
  {
    id: 1,
    title: "New Men's Accessories",
    subtitle: "Complete your look with",
    desc: "Hats & Caps, Sunglasses, Bags & much more...",
    img: "https://i.ibb.co/Jx0c8rx/model.png",
    bg: "bg-orange-300",
  },
  {
    id: 2,
    title: "Trendy Women's Fashion",
    subtitle: "Discover the latest",
    desc: "Dresses, Shoes, Bags & more...",
    img: "https://i.ibb.co/zV3rB6F/woman.png",
    bg: "bg-pink-300",
  },
  {
    id: 3,
    title: "Smart Gadgets Collection",
    subtitle: "Upgrade your lifestyle with",
    desc: "Smartwatches, Earbuds, Speakers & more...",
    img: "https://i.ibb.co/9Wf3cXv/gadgets.png",
    bg: "bg-blue-300",
  },
];

const Home: FC = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <Layout>
      <HeroSlider />
      <CategoryList />
      <FeaturedProducts />
      <BestSellProducts />
      <MostViewedProducts />
      <TopDiscountProducts />
    </Layout>
  );
};

export default Home;
