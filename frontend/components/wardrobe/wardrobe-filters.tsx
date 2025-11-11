"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

type WardrobeFiltersProps = {
  filters: {
    type: string
    color: string
    season: string
    style: string
  }
  onFiltersChange: (filters: any) => void
}

export function WardrobeFilters({ filters, onFiltersChange }: WardrobeFiltersProps) {
  const clearFilters = () => {
    onFiltersChange({
      type: "",
      color: "",
      season: "",
      style: "",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Filter Items</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filter-type">Type</Label>
            <Select value={filters.type} onValueChange={(value) => onFiltersChange({ ...filters, type: value })}>
              <SelectTrigger id="filter-type">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="dress">Dress</SelectItem>
                <SelectItem value="outerwear">Outerwear</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
                <SelectItem value="accessory">Accessory</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-color">Color</Label>
            <Select value={filters.color} onValueChange={(value) => onFiltersChange({ ...filters, color: value })}>
              <SelectTrigger id="filter-color">
                <SelectValue placeholder="All colors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All colors</SelectItem>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="gray">Gray</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="brown">Brown</SelectItem>
                <SelectItem value="beige">Beige</SelectItem>
                <SelectItem value="navy">Navy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-style">Style</Label>
            <Select value={filters.style} onValueChange={(value) => onFiltersChange({ ...filters, style: value })}>
              <SelectTrigger id="filter-style">
                <SelectValue placeholder="All styles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All styles</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="sporty">Sporty</SelectItem>
                <SelectItem value="bohemian">Bohemian</SelectItem>
                <SelectItem value="edgy">Edgy</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-season">Season</Label>
            <Select value={filters.season} onValueChange={(value) => onFiltersChange({ ...filters, season: value })}>
              <SelectTrigger id="filter-season">
                <SelectValue placeholder="All seasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All seasons</SelectItem>
                <SelectItem value="spring-summer">Spring/Summer</SelectItem>
                <SelectItem value="fall-winter">Fall/Winter</SelectItem>
                <SelectItem value="all-season">All Season</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
