
import React, { useState, useEffect } from "react"
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/admin/queries/useContentCategories"
import { Input } from '@/ui/core/input'
import { Button } from '@/ui/core/button'
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/core/table'
import { slugify } from "@/lib/utils"

const CategoryManagement = () => {
  const [newCategoryName, setNewCategoryName] = useState("")
  const { data: categories, isLoading, isError } = useCategories()
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
  const { toast } = useToast()

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error fetching categories",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    }
  }, [isError, toast])

  const handleCreateCategory = async () => {
    if (newCategoryName.trim() === "") {
      toast({
        title: "Error",
        description: "Category name cannot be empty.",
        variant: "destructive",
      })
      return
    }

    createCategory(
      { 
        name: newCategoryName,
        slug: slugify(newCategoryName)
      }, 
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `${newCategoryName} category created.`,
          })
          setNewCategoryName("") // Reset input after successful creation
        },
        onError: (error: Error) => {
          toast({
            title: "Error",
            description: `Failed to create category: ${error.message}`,
            variant: "destructive",
          })
        },
      }
    )
  }

  if (isLoading) {
    return <div>Loading categories...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      <div className="mb-4 flex items-center space-x-2">
        <Input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleCreateCategory} disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Category"}
        </Button>
      </div>

      {categories && categories.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of your categories.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>
                    {/* Actions will be implemented later */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  )
}

export default CategoryManagement
