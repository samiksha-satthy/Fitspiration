"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shirt, Plus, Home, Sparkles, Filter } from "lucide-react"
import { AddItemDialog } from "@/components/wardrobe/add-item-dialog"
import { WardrobeFilters } from "@/components/wardrobe/wardrobe-filters"
import type { WardrobeItem } from "@/types/wardrobe"
import {useRouter} from "next/navigation"

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    type: "",
    color: "",
    season: "",
    style: "",
  })
  const router = useRouter()
  
    useEffect(() => {
      const checkAuth = async () => {
        try{
          const res = await fetch("http://localhost:5000/auth/me", {
            method: "GET",
            credentials: "include", 
          })
  
  
          if (!res.ok){
            router.push("/auth/login")
          }
        }catch{
            router.push("/auth/login")
          }
      }
      checkAuth()
    }, [])

  useEffect(() => {
    // Placeholder API call to fetch wardrobe items
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/wardrobe")
        // Handle response when backend is ready
        console.log("Fetch items response:", response)

        // Mock data for demonstration
        const mockItems: WardrobeItem[] = [
          {
            id: "1",
            name: "Classic White Shirt",
            type: "Top",
            color: "White",
            style: "Formal",
            season: "All Season",
            imageUrl: "/white-formal-shirt.png",
          },
          {
            id: "2",
            name: "Blue Denim Jeans",
            type: "Bottom",
            color: "Blue",
            style: "Casual",
            season: "All Season",
            imageUrl: "/blue-denim-jeans.png",
          },
          {
            id: "3",
            name: "Black Leather Jacket",
            type: "Outerwear",
            color: "Black",
            style: "Edgy",
            season: "Fall/Winter",
            imageUrl: "/black-leather-jacket.png",
          },
        ]
        setItems(mockItems)
      } catch (error) {
        console.error("Error fetching items:", error)
      }
    }

    fetchItems()
  }, [])

  const handleAddItem = (item: Omit<WardrobeItem, "id">) => {
    // Placeholder API call to add item
    const newItem: WardrobeItem = {
      ...item,
      id: Date.now().toString(),
    }
    setItems([...items, newItem])
    setIsAddDialogOpen(false)
  }

  const filteredItems = items.filter((item) => {
    if (filters.type && item.type !== filters.type) return false
    if (filters.color && item.color !== filters.color) return false
    if (filters.season && item.season !== filters.season) return false
    if (filters.style && item.style !== filters.style) return false
    return true
  })

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
            <Link href="/recommendations">
              <Button variant="ghost" size="sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Recommendations
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl font-medium mb-2">My Wardrobe</h1>
            <p className="text-muted-foreground">
              {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {isFilterOpen && <WardrobeFilters filters={filters} onFiltersChange={setFilters} />}

        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Shirt className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground mb-6">
              {items.length === 0
                ? "Start building your digital wardrobe by adding your first item"
                : "Try adjusting your filters"}
            </p>
            {items.length === 0 && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-muted relative">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{item.name}</h3>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 rounded-full bg-muted">{item.type}</span>
                    <span className="px-2 py-1 rounded-full bg-muted">{item.color}</span>
                    <span className="px-2 py-1 rounded-full bg-muted">{item.style}</span>
                    <span className="px-2 py-1 rounded-full bg-muted">{item.season}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AddItemDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddItem={handleAddItem} />
    </div>
  )
}
