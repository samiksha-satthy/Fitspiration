"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shirt, Home, Sparkles, Search } from "lucide-react"

type Outfit = {
  id: string
  name: string
  items: Array<{
    name: string
    type: string
    imageUrl: string
  }>
}

export default function RecommendationsPage() {
  const [event, setEvent] = useState("")
  const [recommendations, setRecommendations] = useState<Outfit[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleGetRecommendations = async () => {
    if (!event.trim()) return

    setIsLoading(true)

    // Placeholder API call
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event }),
      })
      // Handle response when backend is ready
      console.log("Recommendations response:", response)

      // Mock data for demonstration
      const mockRecommendations: Outfit[] = [
        {
          id: "1",
          name: "Professional Formal",
          items: [
            { name: "Navy Blazer", type: "Outerwear", imageUrl: "/navy-blazer.png" },
            { name: "White Dress Shirt", type: "Top", imageUrl: "/white-dress-shirt.jpg" },
            { name: "Gray Trousers", type: "Bottom", imageUrl: "/gray-trousers.jpg" },
            { name: "Black Leather Shoes", type: "Shoes", imageUrl: "/black-dress-shoes.png" },
          ],
        },
        {
          id: "2",
          name: "Modern Business",
          items: [
            { name: "Charcoal Suit", type: "Set", imageUrl: "/charcoal-business-suit.jpg" },
            { name: "Light Blue Shirt", type: "Top", imageUrl: "/light-blue-shirt.png" },
            { name: "Silk Tie", type: "Accessory", imageUrl: "/silk-tie.png" },
            { name: "Brown Leather Shoes", type: "Shoes", imageUrl: "/brown-oxford-shoes.jpg" },
          ],
        },
        {
          id: "3",
          name: "Smart Casual",
          items: [
            { name: "Beige Chinos", type: "Bottom", imageUrl: "/beige-chinos.png" },
            { name: "Polo Shirt", type: "Top", imageUrl: "/navy-polo-shirt.jpg" },
            { name: "Loafers", type: "Shoes", imageUrl: "/brown-leather-loafers.png" },
          ],
        },
      ]

      setRecommendations(mockRecommendations)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-serif font-semibold">
            <Shirt className="h-6 w-6" />
            StyleSync
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/wardrobe">
              <Button variant="ghost" size="sm">
                <Shirt className="h-4 w-4 mr-2" />
                Wardrobe
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm mb-4">
              <Sparkles className="h-4 w-4" />
              AI-Powered Recommendations
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4 text-balance">
              Get personalized outfit suggestions
            </h1>
            <p className="text-lg text-muted-foreground text-balance leading-relaxed">
              Tell us about your event and we'll recommend the perfect outfits from your wardrobe
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-12">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event" className="text-base">
                    What's the occasion?
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="event"
                      type="text"
                      placeholder="e.g., Wedding, Job Interview, Casual Brunch, Date Night..."
                      value={event}
                      onChange={(e) => setEvent(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGetRecommendations()}
                      className="text-base"
                    />
                    <Button onClick={handleGetRecommendations} disabled={isLoading || !event.trim()} className="px-6">
                      {isLoading ? (
                        <>Loading...</>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Get Ideas
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Popular:</span>
                  {["Wedding", "Interview", "Date Night", "Casual Outing"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setEvent(suggestion)}
                      className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-medium mb-2">Recommended Outfits</h2>
                <p className="text-muted-foreground">
                  Based on your event: <span className="font-medium text-foreground">{event}</span>
                </p>
              </div>

              <div className="space-y-6">
                {recommendations.map((outfit) => (
                  <Card key={outfit.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-medium mb-4">{outfit.name}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {outfit.items.map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                              <img
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-sm">
                              <p className="font-medium truncate">{item.name}</p>
                              <p className="text-muted-foreground text-xs">{item.type}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {recommendations.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-xl font-medium mb-2">No recommendations yet</h3>
              <p className="text-muted-foreground">Enter an event above to get personalized outfit suggestions</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
