
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroCarousel = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 to-purple-600">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative text-center text-white px-4 z-10">
        <h1 className="text-5xl md:text-6xl font-cursive font-bold mb-4 text-primary animate-fade-in">
          We are Sassy!
        </h1>
        <p className="text-xl md:text-2xl animate-fade-in">
          Exceptionally trained and award winning stylists. Unparalleled service.
        </p>
        <p className="text-xl md:text-2xl animate-fade-in mt-2">
          Every time
        </p>
      </div>
    </section>
  );
};

export default HeroCarousel;
