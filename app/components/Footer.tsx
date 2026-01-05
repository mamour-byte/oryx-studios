import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaYoutube, FaBehance } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black/90 text-gray-300 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo & About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-32 md:w-40">
            <img 
              src="/images/logo.png" 
              alt="Logo Oryx Studios"
              className="w-full h-auto"
            />
          </div>
          <p className="mt-5 text-sm opacity-70">
            Photographie, production vidéo et créations audiovisuelles — des projets visuels à la hauteur de votre imagination.
          </p>
        </motion.div>

        {/* Liens rapides */}
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-2 text-sm"
        >
          <li>
            <Link href="/" className="hover:text-white transition">
              Accueil
            </Link>
          </li>
          <li>
            <Link href="/services" className="hover:text-white transition">
              Services
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-white transition">
              À propos
            </Link>
          </li>
        </motion.ul>

        {/* Réseaux sociaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex space-x-5 justify-center md:justify-end"
        >
          <a href="#" className="hover:text-pink-500 transition">
            <FaInstagram size={24} />
          </a>
          <a href="#" className="hover:text-blue-500 transition">
            <FaFacebook size={24} />
          </a>
          <a href="#" className="hover:text-red-500 transition">
            <FaYoutube size={24} />
          </a>
          <a href="#" className="hover:text-sky-400 transition">
            <FaBehance size={24} />
          </a>
        </motion.div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Oryx Studios. Tous droits réservés.
      </div>
    </footer>
  );
}
