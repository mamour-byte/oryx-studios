"use client";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Tagline from "./components/Tagline";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Teams from "./components/Teams";
import StatsAndPartners from "./components/StatsAndPartners";
import Hero from "./components/Hero";
import PhotoSlider from "./components/PhotoSlider";




export default function Home() {

  return (
    <div className="bg-white text-black min-h-screen overflow-x-hidden">
      <Navbar />
      {/* <Hero/> */}
        <PhotoSlider/>
      <Tagline/>
      <Gallery/>
      <Services/>
      <Teams />
      <StatsAndPartners /> 
      <Footer />
    </div>
  );
}
