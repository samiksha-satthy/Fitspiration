"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WardrobeItem } from "@/types/wardrobe"

type AddItemDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (item: Omit<WardrobeItem, "id">) => void
}

export function AddItemDialog({ open, onOpenChange, onAddItem }: AddItemDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    color: "",
    style: "",
    season: "",
    imageUrl: "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile){
      alert("please choose an image")
      return 
    }

    const uploadData = new FormData()
    uploadData.append("myFile", selectedFile)
    

    const res = await fetch("http://localhost:5000/upload-item", {
      method: "POST",
      body: uploadData,
      credentials: "include",
    })

    console.log(res);

    const imageUrl =
      formData.imageUrl || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(formData.name)}`

    onAddItem({
      ...formData,
      imageUrl,
    })

    // Reset form
    setFormData({
      name: "",
      type: "",
      color: "",
      style: "",
      season: "",
      imageUrl: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Add Wardrobe Item</DialogTitle>
          <DialogDescription>Add a new item to your digital wardrobe</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              placeholder="e.g., Black Leather Jacket"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Top">Top</SelectItem>
                  <SelectItem value="Bottom">Bottom</SelectItem>
                  <SelectItem value="Dress">Dress</SelectItem>
                  <SelectItem value="Outerwear">Outerwear</SelectItem>
                  <SelectItem value="Shoes">Shoes</SelectItem>
                  <SelectItem value="Accessory">Accessory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Gray">Gray</SelectItem>
                  <SelectItem value="Blue">Blue</SelectItem>
                  <SelectItem value="Red">Red</SelectItem>
                  <SelectItem value="Green">Green</SelectItem>
                  <SelectItem value="Brown">Brown</SelectItem>
                  <SelectItem value="Beige">Beige</SelectItem>
                  <SelectItem value="Navy">Navy</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select
                value={formData.style}
                onValueChange={(value) => setFormData({ ...formData, style: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Sporty">Sporty</SelectItem>
                  <SelectItem value="Bohemian">Bohemian</SelectItem>
                  <SelectItem value="Edgy">Edgy</SelectItem>
                  <SelectItem value="Vintage">Vintage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select
                value={formData.season}
                onValueChange={(value) => setFormData({ ...formData, season: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spring/Summer">Spring/Summer</SelectItem>
                  <SelectItem value="Fall/Winter">Fall/Winter</SelectItem>
                  <SelectItem value="All Season">All Season</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

            
          <div className="space-y-2">
            <Label htmlFor="file">Upload Image (optional)</Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Leave empty to use a placeholder image</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
