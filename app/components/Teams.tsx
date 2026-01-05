import React, { useState } from 'react';

const Team = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


  const teamMembers = [
    {
      name: "Sophie Martin",
      role: "Directrice Créative",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
      name: "Thomas Dubois",
      role: "Réalisateur",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      name: "Marie Laurent",
      role: "Chef Monteuse",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    },
    {
      name: "Lucas Bernard",
      role: "Ingénieur Son",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      name: "Mamour Fall",
      role: "Marketing Communication",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      name: "André Dubois",
      role: "Directeur de la Photographie",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      name: "Samuel Petit",
      role: "Stagiaire Production",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      name: "Lucas Bernard",
      role: "Ingénieur Son",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className=" text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            L'Équipe
          </h2>
          <div className="w-16 h-0.5 bg-blue-600 mx-auto"></div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={index}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-blue-600 transition-opacity duration-500 ${
                    isHovered ? 'opacity-90' : 'opacity-0'
                  }`}></div>

                  {/* Info */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-white transition-all duration-500 ${
                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
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