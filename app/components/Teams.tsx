// import React, { useState } from "react";

// const teamMembers = [
//   {
//     name: "Daouda Tine",
//     role: "CEO & Founder",
//     image: "/assets/dave.jpg",
//   },
//   {
//     name: "Mor Diaw",
//     role: "Photographe & Cadreur",
//     image: "/assets/mordiaw.jpg",
//   },
//   {
//     name: "Marie Laurent",
//     role: "Chef Monteuse",
//     image: "/assets/mordiaw.jpg",
//   },
//   {
//     name: "Lucas Bernard",
//     role: "Ingénieur Son",
//     image: "/assets/mordiaw.jpg",
//   },
//   {
//     name: "Mamour Fall",
//     role: "Dev Web & Marketing Communication",
//     image: "/assets/Mamour.png",
//   },
//   {
//     name: "André Dubois",
//     role: "Directeur de la Photographie",
//     image: "/assets/mordiaw.jpg",
//   },
//   {
//     name: "Samuel Petit",
//     role: "Stagiaire Production",
//     image: "/assets/mordiaw.jpg",
//   },
//   {
//     name: "Lucas Bernard",
//     role: "Ingénieur Son",
//     image: "/assets/mordiaw.jpg",
//   }
// ];

// const Team = () => {
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

//   return (
//     <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-10">
//           <h2 className="text-4xl font-bold text-gray-900 mb-2">
//             {"L'Équipe"}
//           </h2>
//           <div className="w-16 h-0.5 bg-blue-600 mx-auto"></div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {teamMembers.map((member, index) => {
//             const isHovered = hoveredIndex === index;

//             return (
//               <div
//                 key={`${member.name}-${index}`}
//                 className="relative group cursor-pointer"
//                 onMouseEnter={() => setHoveredIndex(index)}
//                 onMouseLeave={() => setHoveredIndex(null)}
//               >
//                 <div className="relative overflow-hidden aspect-[3/4]">
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
//                   />

//                   <div
//                     className={`absolute inset-0 bg-blue-600 transition-opacity duration-500 ${
//                       isHovered ? "opacity-90" : "opacity-0"
//                     }`}
//                   ></div>

//                   <div
//                     className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-white transition-all duration-500 ${
//                       isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//                     }`}
//                   >
//                     <h3 className="text-xl font-bold mb-2 text-center">
//                       {member.name}
//                     </h3>
//                     <div className="w-12 h-0.5 bg-white mb-3"></div>
//                     <p className="text-sm font-light text-center">
//                       {member.role}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Team;




import React from "react";

/**
 * TeamSection
 * Reproduction du composant "Notre équipe" (grille photo + barres de compétences)
 * adaptée à la palette de couleurs du site.
 *
 * Aucune dépendance externe (pas de Tailwind requis) : les styles sont injectés
 * localement via une balise <style>, donc le composant est autonome et peut être
 * déposé tel quel dans n'importe quel projet React (Next.js, Vite, CRA...).
 */

const DEFAULT_TEAM = [
  { name: "Daouda Tine", img: "/assets/daouda.jpg" },
  { name: "Mor Diaw", img: "/assets/mordiaw.jpg" },
  { name: "Mamour Fall", img: "/assets/Mamour.jpg" },
  { name: "Ousmane Sy", img: "/assets/ousmane.jpg" },
  { name: "Lucas Bernard", img: "/assets/lucas_bernard.jpg" },
  { name: "André Dubois", img: "/assets/andre_dubois.jpg" },
  { name: "Samuel Petit", img: "/assets/samuel_petit.jpg" },
  { name: "Aissatou Ndiaye", img: "/assets/aissatou_ndiaye.jpg" },
  { name: "Fatou Diop", img: "/assets/fatou_diop.jpg" },
];

const DEFAULT_SKILLS = [
  { label: "Directing", value: 93 },
  { label: "Graphic Design", value: 96 },
  { label: "Copywriting", value: 94 },
  { label: "Motion Design", value: 90 },
  { label: "Retouching", value: 95 },
];

export default function Team({
  eyebrow = "Notre équipe",
  heading = "Nous vous aidons à créer des stratégies visuelles.",
  team = DEFAULT_TEAM,
  skills = DEFAULT_SKILLS,
}) {
  const topRow = team.slice(0, 4);
  const bottomRow = team.slice(4, 9);

  return (
    <section className="ts-section">
      <style>{`
        .ts-section {
          --ts-background: #ffffff;
          --ts-foreground: #171717;
          --ts-surface: #f8fafc;
          --ts-muted: #64748b;
          --ts-primary: #1d4ed8;
          --ts-primary-strong: #2563eb;
          --ts-accent: #d6ad60;
          --ts-border: rgba(15, 23, 42, 0.08);

          background: var(--ts-background);
          color: var(--ts-foreground);
          padding: 96px 5vw;
          font-family: inherit;
        }

        .ts-grid {
          display: grid;
          grid-template-columns: 1.1fr repeat(4, 1fr) 1.3fr;
          grid-template-rows: auto auto;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* --- Texte / intro --- */
        .ts-intro {
          grid-column: 1 / 2;
          grid-row: 1 / 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .ts-eyebrow {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          padding: 6px 16px;
          margin-bottom: 28px;
          border-radius: 999px;
          background: var(--ts-primary);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .ts-heading {
          font-size: clamp(18px, 2.5vw, 28px);
          line-height: 1.15;
          font-weight: 600;
          color: var(--ts-foreground);
          margin: 0;
        }

        /* --- Photos --- */
        .ts-photo {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: var(--ts-surface);
          border: 1px solid var(--ts-border);
          aspect-ratio: 3 / 4;
        }

        .ts-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: grayscale(8%);
          transition: transform 0.4s ease, filter 0.4s ease;
        }

        .ts-photo:hover img {
          transform: scale(1.04);
          filter: grayscale(0%);
        }

        .ts-photo::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 60%,
            rgba(23, 23, 23, 0.35) 100%
          );
          pointer-events: none;
        }

        .ts-top-photo-1 { grid-column: 2 / 3; grid-row: 1 / 2; }
        .ts-top-photo-2 { grid-column: 3 / 4; grid-row: 1 / 2; }
        .ts-top-photo-3 { grid-column: 4 / 5; grid-row: 1 / 2; }
        .ts-top-photo-4 { grid-column: 5 / 6; grid-row: 1 / 2; }

        .ts-bottom-photos {
          grid-column: 1 / 6;
          grid-row: 2 / 3;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }

        /* --- Panneau compétences --- */
        .ts-skills {
          grid-column: 6 / 7;
          grid-row: 1 / 3;
          background: var(--ts-surface);
          border: 1px solid var(--ts-border);
          border-radius: 16px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 22px;
        }

        .ts-skill-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ts-skill-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ts-skill-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ts-foreground);
        }

        .ts-skill-value {
          font-size: 12px;
          font-weight: 700;
          color: var(--ts-foreground);
          background: var(--ts-background);
          border: 1px solid var(--ts-border);
          border-radius: 999px;
          padding: 2px 9px;
        }

        .ts-skill-track {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: var(--ts-border);
          overflow: hidden;
        }

        .ts-skill-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            var(--ts-primary) 0%,
            var(--ts-accent) 100%
          );
        }

        /* --- Responsive --- */
        @media (max-width: 1100px) {
          .ts-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto auto auto auto;
          }
          .ts-intro { grid-column: 1 / 3; grid-row: 1; }
          .ts-top-photo-1 { grid-column: 1 / 2; grid-row: 2; }
          .ts-top-photo-2 { grid-column: 2 / 3; grid-row: 2; }
          .ts-top-photo-3 { grid-column: 1 / 2; grid-row: 3; }
          .ts-top-photo-4 { grid-column: 2 / 3; grid-row: 3; }
          .ts-bottom-photos {
            grid-column: 1 / 3;
            grid-row: 4;
            grid-template-columns: repeat(3, 1fr);
          }
          .ts-skills { grid-column: 1 / 3; grid-row: 5; }
        }

        @media (max-width: 640px) {
          .ts-section { padding: 56px 6vw; }
          .ts-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .ts-bottom-photos { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="ts-grid">
        {/* Bloc texte */}
        <div className="ts-intro">
          <span className="ts-eyebrow">{eyebrow}</span>
          <h2 className="ts-heading">{heading}</h2>
        </div>

        {/* Rangée du haut : 4 photos */}
        {topRow.map((member, i) => (
          <div className={`ts-photo ts-top-photo-${i + 1}`} key={member.name + i}>
            <img src={member.img} alt={member.name} loading="lazy" />
          </div>
        ))}

        {/* Rangée du bas : 5 photos */}
        <div className="ts-bottom-photos">
          {bottomRow.map((member, i) => (
            <div className="ts-photo" key={member.name + i}>
              <img src={member.img} alt={member.name} loading="lazy" />
            </div>
          ))}
        </div>

        {/* Panneau de compétences */}
        <div className="ts-skills">
          {skills.map((skill) => (
            <div className="ts-skill-row" key={skill.label}>
              <div className="ts-skill-top">
                <span className="ts-skill-label">{skill.label}</span>
                <span className="ts-skill-value">{skill.value}%</span>
              </div>
              <div className="ts-skill-track">
                <div
                  className="ts-skill-fill"
                  style={{ width: `${skill.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
