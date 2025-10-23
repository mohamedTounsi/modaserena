import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />
      <main className="flex-grow">
        {/* First Section: About + Image */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-light text-gray-900">
                  L'Art de la Mode
                </h2>
                <div className="w-16 h-0.5 bg-pink-200/60"></div>
              </div>
              <p className="text-lg leading-relaxed text-gray-600">
                Bienvenue chez{" "}
                <span className="font-semibold text-gray-900">
                  Miro Fashion Clothes
                </span>
                , où le style devient une véritable expérience. Fondée avec une
                passion pour la mode, notre marque propose des vêtements
                exclusifs qui racontent des histoires et reflètent votre
                personnalité. Chaque pièce de notre collection est conçue pour
                vous transporter dans un univers d'élégance et de
                sophistication.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                Notre philosophie repose sur la conviction que chaque tenue est
                plus qu'un simple vêtement : c'est une déclaration personnelle,
                une expression de votre style et un reflet de votre identité.
                Nous mélangeons savoir-faire traditionnel et techniques
                innovantes pour créer des collections à la fois intemporelles et
                contemporaines.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-gray-100/40 rounded-2xl transform rotate-3"></div>
                <img
                  src="/mirologo3.png"
                  alt="Miro Fashion Clothes"
                  className="relative rounded-2xl shadow-lg w-full max-w-md h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
