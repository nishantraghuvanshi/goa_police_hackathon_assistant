import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-black text-white text-center p-6">
        

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center max-w-2xl">
          <h2 className="text-5xl text-white md:text-6xl font-bold mb-4 drop-shadow-md">
            Your AI-Based Police Assistant
          </h2>
          <p className="text-lg text-white md:text-xl mb-8 drop-shadow-md">
            Get assistance with legal procedures, report issues, and overcome
            language barriers effortlessly.
          </p>
          <Link
            href="/chatbot"
            className="bg-white text-blue-500 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition ease-in-out duration-200"
          >
            Start Chat
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto py-16 px-4">
        <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-600 p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-200">
            <h4 className="text-xl font-semibold mb-4 text-blue-500">
              Multilingual Support
            </h4>
            <p>
              Interact in multiple languages, with both text and speech support
              for smooth communication.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-600 p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-200">
            <h4 className="text-xl font-semibold mb-4 text-blue-500">
              Step-by-Step Guidance
            </h4>
            <p>
              Receive detailed instructions for filing police reports and other
              procedures.
            </p>
            <Link
              href="/procedures"
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Learn More
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-600 p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-200">
            <h4 className="text-xl font-semibold mb-4 text-blue-500">
              Anonymous Tips
            </h4>
            <p>
              Send anonymous tips securely using predefined codes, ensuring
              privacy and safety.
            </p>
            <Link
              href="/report-issue"
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Submit a Tip
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-800 py-16 px-4 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">About This Project</h3>
          <p className="text-lg max-w-2xl mx-auto">
            This AI-based assistant is designed to help visitors at police
            stations by providing basic legal knowledge, guiding them through
            procedures, and overcoming language barriers. Built using modern
            technologies, it ensures accessibility and privacy for all users.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-blue-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Police Assistant Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
