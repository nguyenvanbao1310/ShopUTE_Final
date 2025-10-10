import { FC, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  desc: string;
  img: string;
  bg: string; // tailwind bg color
}

const slides: Slide[] = [
  {
    title: "Phụ kiện công nghệ mới",
    subtitle: "Hoàn thiện góc làm việc với",
    desc: "Laptop, tai nghe, bàn phím, chuột và nhiều hơn nữa...",
    img: "/img/slide1.jpg",
    bg: "bg-orange-400",
  },
  {
    title: "Bộ sưu tập mùa hè",
    subtitle: "Nâng tầm phong cách với",
    desc: "Các sản phẩm công nghệ mới nhất cho mùa nóng",
    img: "/img/slide2.jpg",
    bg: "bg-purple-400",
  },
];

const HeroSlider: FC = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      className={`relative flex items-center justify-between px-20 py-16 transition-all duration-700 ${slides[current].bg}`}
    >
      {/* Left text */}
      <div className="max-w-md text-white">
        <h3 className="text-lg">{slides[current].subtitle}</h3>
        <h1 className="text-4xl font-bold mt-2">{slides[current].title}</h1>
        <p className="mt-2">{slides[current].desc}</p>
        <button className="mt-4 bg-pink-500 text-white px-5 py-2 rounded-md shadow hover:bg-pink-600">
          Shop Now →
        </button>
      </div>

      {/* Right image */}
      <div className="max-w-md">
        <img
          src={slides[current].img}
          alt="Hero Slide"
          className="rounded-lg w-full h-auto"
        />
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${
              current === idx ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
