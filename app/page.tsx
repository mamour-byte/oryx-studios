"use client";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Tagline from "./components/Tagline";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Teams from "./components/Teams";
import StatsAndPartners from "./components/StatsAndPartners";



export default function Home() {

  return (
    <div className="bg-white text-black min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Tagline/>
      <Gallery/>
      <Services/>
      <Teams />
      <StatsAndPartners /> 
      <Footer />
    </div>
  );
}