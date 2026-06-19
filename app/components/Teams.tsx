import React, { useState } from "react";

const teamMembers = [
  {
    name: "Daouda Tine",
    role: "CEO & Founder",
    image: "assets/dave.jpg",
  },
  {
    name: "Mor Diaw",
    role: "Photographe & Cadreur",
    image: "assets/mordiaw.jpg",
  },
  {
    name: "Marie Laurent",
    role: "Chef Monteuse",
    image: "assets/mordiaw.jpg",
  },
  {
    name: "Lucas Bernard",
    role: "Ingénieur Son",
    image: "assets/mordiaw.jpg",
  },
  {
    name: "Mamour Fall",
    role: "Dev Web & Marketing Communication",
    image: "assets/mordiaw.jpg",
  },
  {
    name: "André Dubois",
    role: "Directeur de la Photographie",
    image: "assets/mordiaw.jpg",
  },
  {
    name: "Samuel Petit",
    role: "Stagiaire Production",
    image: "assets/mordiaw.jpg",
  },
  {
    name: "Lucas Bernard",
    role: "Ingénieur Son",
    image: "assets/mordiaw.jpg",
  }
];

const Team = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {"L'Équipe"}
          </h2>
          <div className="w-16 h-0.5 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={`${member.name}-${index}`}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative overflow-hidden aspect-[2/3]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div
                    className={`absolute inset-0 bg-blue-600 transition-opacity duration-500 ${
                      isHovered ? "opacity-90" : "opacity-0"
                    }`}
                  ></div>

                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-white transition-all duration-500 ${
                      isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-2 text-center">
                      {member.name}
                    </h3>
                    <div className="w-12 h-0.5 bg-white mb-3"></div>
                    <p className="text-sm font-light text-center">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Team;
