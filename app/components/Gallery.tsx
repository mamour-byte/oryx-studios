

export default function Gallery() {
    return(  

  <section className="mt-20 mb-10 sm:py-0 md:py-0 lg:py-14">
    <div className="max-w-[1200px] mx-auto px-4 sm:px-0">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8 sm:mb-10 md:mb-12 bg-gradient-to-r from-gray-900 via-blue-900 to-blue-600 bg-clip-text text-transparent">
        Galerie
      </h2>

          <div className="gallery-grid">
            <div className="gallery-item large">
              <img src="https://picsum.photos/id/1011/1200/800" alt="Photographie" />
              <div className="caption">
                <span className="tag">PRODUCTIONS</span>
                <h3>Photographie</h3>
                <p>Images haute qualité & direction artistique</p>
              </div>
            </div>

            <div className="gallery-item vertical">
              <img src="https://picsum.photos/id/1027/600/800" alt="Vidéo" />
              <div className="caption">
                <span className="tag">PRODUCTIONS</span>
                <h3>Vidéo créative</h3>
                <p>Storytelling visuel moderne</p>
              </div>
            </div>

            <div className="gallery-item">
              <img src="https://picsum.photos/id/1035/600/500" alt="Graphisme" />
              <div className="caption">
                <span className="tag">PRODUCTIONS</span>
                <h3>Graphisme</h3>
              </div>
            </div>

            <div className="gallery-item wide">
              <img src="https://picsum.photos/id/1045/1200/500" alt="Montage & 3D" />
              <div className="caption">
                <span className="tag">PRODUCTIONS</span>
                <h3>Montage & 3D</h3>
                <p>Rendu fluide et immersif</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 240px;
            gap: 20px;
          }

          .gallery-item {
            position: relative;
            overflow: hidden;
            cursor: pointer;
            border-radius: 8px;
          }

          .gallery-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }

          .gallery-item::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.6),
              rgba(0, 0, 0, 0)
            );
            opacity: 0;
            transition: opacity 0.4s ease;
          }

          .gallery-item:hover::after {
            opacity: 1;
          }

          .gallery-item:hover img {
            transform: scale(1.05);
          }

          .caption {
            position: absolute;
            bottom: 24px;
            left: 24px;
            color: white;
            z-index: 2;
          }

          .caption .tag {
            font-size: 11px;
            letter-spacing: 1px;
            opacity: 0.85;
          }

          .caption h3 {
            font-size: 22px;
            margin: 6px 0;
          }

          .caption p {
            font-size: 14px;
            opacity: 0.85;
          }

          .large {
            grid-column: span 3;
            grid-row: span 2;
          }

          .vertical {
            grid-row: span 2;
          }

          .wide {
            grid-column: span 3;
          }

          @media (max-width: 900px) {
            .gallery-grid {
              grid-template-columns: 1fr 1fr;
              grid-auto-rows: 200px;
            }

            .large,
            .wide,
            .vertical {
              grid-column: span 2;
              grid-row: span 1;
            }
          }

          @media (max-width: 500px) {
            .gallery-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </section>


        );
}