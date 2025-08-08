import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Within Our Sacred Walls Apps</h1>
          <p className="text-lg text-base-content/70">Welcome to our collection of applications</p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/ideas">
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
                <figure className="px-10 pt-10">
                  <div className="rounded-xl bg-primary/10 p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">Ideas</h2>
                  <p>Browse and share creative ideas across various topics</p>
                  <div className="card-actions">
                    <div className="badge badge-outline">Explore</div>
                    <div className="badge badge-outline">Create</div>
                    <div className="badge badge-outline">Share</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
