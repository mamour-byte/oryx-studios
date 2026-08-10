import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
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
              src="/images/logo.PNG" 
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
          className="flex flex-wrap gap-4 justify-center md:justify-end"
        >
          <a
            href="https://www.linkedin.com/company/oryx-studios/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://www.facebook.com/share/1965zxRFYV/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://www.tiktok.com/@oryx_studios1?_r=1&_d=ejk39elk635g2h&sec_uid=MS4wLjABAAAAwVX2ihe84TtE47ZANqjmcKAY6ZFn_yqYDim_CNKa6fFPx83NmhLI8qXfwYO6eQ_1&share_author_id=7140741886888854533&sharer_language=fr&source=h5_m&u_code=e3j971adjmeggg&item_author_type=1&utm_source=copy&tt_from=copy&enable_checksum=1&utm_medium=ios&share_link_id=C5D0ABE1-77EA-487B-88ED-1EF2C31B2DE7&user_id=7140741886888854533&sec_user_id=MS4wLjABAAAAwVX2ihe84TtE47ZANqjmcKAY6ZFn_yqYDim_CNKa6fFPx83NmhLI8qXfwYO6eQ_1&social_share_type=4&ug_btm=b8727,b0&utm_campaign=client_share&share_app_id=1233"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition"
          >
            <SiTiktok size={24} />
          </a>
          <a
            href="https://www.instagram.com/oryx_studios1?igsh=MWFtczA2OGRpa3M2NQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://wa.me/+221755202623"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 transition"
          >
            <FaWhatsapp size={24} />
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
