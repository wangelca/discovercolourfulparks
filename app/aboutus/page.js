import React from "react";

const AboutUs = () => {
    return (
      <div className="bg-gray-100 min-h-screen py-10">
        {/* Hero Section */}
        <section className="bg-green-800 text-white py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About Us</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Welcome to Discover Colourful Parks! We are passionate about connecting people to the beauty of nature by providing a seamless reservation experience for exploring the nation's natural wonders. Whether you’re an experienced adventurer or a first-time visitor, our mission is to make these breathtaking landscapes accessible to everyone.
            </p>
          </div>
        </section>
  
        {/* Mission Section */}
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Our Mission</h2>
          <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto leading-relaxed">
            Our mission is to provide a seamless reservation experience for those exploring the beauty of our national parks. We strive to make nature accessible to all while preserving these incredible places for future generations to enjoy. By making the reservation process easy and efficient, we hope to encourage more people to connect with the natural world.
          </p>
        </section>
  
        {/* History Section */}
        <section className="bg-white py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Our History</h2>
            <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto leading-relaxed">
              Discover Colourful Parks was created to simplify the way people book and experience national parks. We started with a simple idea: make nature accessible to all, without the hassle. Since our beginning, we've grown to partner with all major national parks, offering trusted reservation services to millions of visitors each year. Our commitment to accessibility, conservation, and community has remained strong throughout our journey.
            </p>
          </div>
        </section>
  
        {/* Values Section */}
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Our Values</h2>
          <ul className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8">
            <li className="bg-green-100 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-green-900 mb-4">Preservation</h3>
              <p className="text-gray-700">We prioritize environmental conservation to ensure these natural wonders remain unspoiled for future generations.</p>
            </li>
            <li className="bg-green-100 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-green-900 mb-4">Accessibility</h3>
              <p className="text-gray-700">We believe everyone should have the opportunity to experience the beauty of nature, regardless of ability or background.</p>
            </li>
            <li className="bg-green-100 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-green-900 mb-4">Innovation</h3>
              <p className="text-gray-700">We leverage technology to improve the park-going experience, making it easier for everyone to explore and enjoy the outdoors.</p>
            </li>
          </ul>
        </section>
  
        {/* Team Section */}
        <section className="bg-white py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Meet Our Team</h2>
            <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto leading-relaxed mb-8">
              Our passionate team is dedicated to making your park reservation experience as smooth as possible. From our developers to our customer service team, we all share a love for nature and a commitment to making it accessible for everyone.
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8">
              {/* Team Member Cards */}
              <div className="bg-green-100 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <img src="/team/ebube.jpg" alt="Ebube" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-900">Ebube</h3>
                <p className="text-gray-700">Lead Developer</p>
              </div>
              <div className="bg-green-100 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <img src="/team/wui.jpg" alt="Wui" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-900">Wui</h3>
                <p className="text-gray-700">Customer Support Specialist</p>
              </div>
              <div className="bg-green-100 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <img src="/team/angelica.jpg" alt="Angelica" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-900">Angelica</h3>
                <p className="text-gray-700">Community Outreach</p>
              </div>
              <div className="bg-green-100 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <img src="/team/ruth.jpg" alt="Ruth" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-900">Ruth</h3>
                <p className="text-gray-700">Marketing Specialist</p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Partnerships Section */}
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Our Partners</h2>
          <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto leading-relaxed">
            We are proud to collaborate with national park services, local communities, and leading environmental organizations to ensure a safe, enjoyable, and sustainable experience for all. Together, we are committed to maintaining the beauty and accessibility of our nation's parks.
          </p>
        </section>
  
        {/* Contact Section */}
        <section className="bg-green-800 text-white py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-semibold mb-8">Contact Us</h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-6">
              Have questions or need assistance? We're here to help. You can reach out to us at any time at <a href="mailto:support@discovercolourfulparks.com" className="underline">support@discovercolourfulparks.com</a> or give us a call at: (587) 837-0099. We look forward to hearing from you!
            </p>
          </div>
        </section>
      </div>
    );
  };

export default AboutUs;
