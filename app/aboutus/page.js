import React from "react";

const AboutUs = () => {
    return (
      <div className="bg-gray-100 min-h-screen py-10">
        {/* Hero Section */}
        <section className="bg-green-800 text-white py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-lg">Connecting You to the Nation’s Natural Wonders</p>
          </div>
        </section>
  
        {/* Mission Section */}
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Our Mission</h2>
          <p className="text-gray-600 text-lg text-center max-w-2xl mx-auto">
            Our mission is to provide a seamless reservation experience for those exploring the
            beauty of our national parks. We aim to make nature accessible to all while preserving 
            it for future generations.
          </p>
        </section>
  
        {/* History Section */}
        <section className="bg-white py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Our History</h2>
            <p className="text-gray-600 text-lg text-center max-w-2xl mx-auto">
              Our platform was created to simplify park reservations for campers, 
              hikers, and nature lovers. Since then, we have expanded to cover all major national parks, 
              offering a trusted service to millions of visitors every year.
            </p>
          </div>
        </section>
  
        {/* Values Section */}
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Our Values</h2>
          <ul className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <li className="bg-green-200 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-green-800 mb-2">Preservation</h3>
              <p className="text-gray-600">We prioritize environmental conservation for future generations.</p>
            </li>
            <li className="bg-green-200 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-green-800 mb-2">Accessibility</h3>
              <p className="text-gray-600">We believe nature should be accessible to everyone.</p>
            </li>
            <li className="bg-green-200 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-green-800 mb-2">Innovation</h3>
              <p className="text-gray-600">We use technology to improve park access and experiences.</p>
            </li>
          </ul>
        </section>
  
        {/* Team Section */}
        <section className="bg-white py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Meet Our Team</h2>
            <p className="text-gray-600 text-lg text-center max-w-2xl mx-auto">
              Our passionate team of team members Ebube, Wui, Angelica and Ruth work around the clock to ensure 
              that your park reservation experience is smooth and enjoyable.
            </p>
          </div>
        </section>
  
        {/* Partnerships Section */}
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Our Partners</h2>
          <p className="text-gray-600 text-lg text-center max-w-2xl mx-auto">
            We collaborate with national park services, local communities, and environmental organizations to 
            bring you the most reliable and trustworthy reservation system.
          </p>
        </section>
  
        {/* Contact Section */}
        <section className="bg-green-800 text-white py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
            <p className="text-lg mb-4">
              Have questions? Need assistance? Reach out to us at <a href="mailto:support@discovercoverfulparks.com" className="underline">support@discovercoverfulparks.com</a>
            </p>
            <p className="text-lg">Call us at: (587) 837-0099</p>
          </div>
        </section>
      </div>
    );
  };

export default AboutUs;