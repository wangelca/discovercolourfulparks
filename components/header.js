// components/header.js
export default function Header() {
    return (
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <a href="/">Discover Colourful Parks</a>
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="hover:underline">Home</a>
              </li>
              <li>
                <a href="/parks" className="hover:underline">Parks</a>
              </li>
              <li>
                <a href="/users" className="hover:underline">Users</a>
              </li>
              <li>
                <a href="/bookings" className="hover:underline">Bookings</a>
              </li>
              <li>
                <a href="/spots" className="hover:underline">Spots</a>
              </li>
              <li>
                <a href="/events" className="hover:underline">Events</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }
  