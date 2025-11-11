import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Shirt, Menu } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-serif font-semibold">
            <Shirt className="h-6 w-6" />
            StyleSync
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/wardrobe" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Wardrobe
            </Link>
            <Link
              href="/recommendations"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Recommendations
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm mb-8">
            <Sparkles className="h-4 w-4" />
            AI-Powered Fashion Assistant
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-medium mb-6 text-balance leading-tight">
            Optimal organization meets exquisite style
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
            Transform your closet into a functional work of art with StyleSync's custom wardrobe solutions and
            AI-powered outfit recommendations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8">
                Start Organizing
              </Button>
            </Link>
            <Link href="/recommendations">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Explore Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-8 rounded-lg bg-card border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shirt className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-2">Digital Wardrobe</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Organize and categorize every piece in your closet with detailed information and photos
            </p>
          </div>
          <div className="text-center p-8 rounded-lg bg-card border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-2">Smart Suggestions</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get AI-powered outfit recommendations tailored to your events and personal style
            </p>
          </div>
          <div className="text-center p-8 rounded-lg bg-card border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-medium mb-2">Easy Management</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Filter by season, style, color, and occasion to find the perfect piece instantly
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
