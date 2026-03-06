"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  stacklineSku: string;
  title?: string;
  categoryName?: string;
  subCategoryName?: string;
  imageUrls?: string[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    string | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`/api/subcategories`)
        .then((res) => res.json())
        .then((data) => setSubCategories(data.subCategories));
    } else {
      setSubCategories([]);
      setSelectedSubCategory(undefined);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedSubCategory) params.append("subCategory", selectedSubCategory);
    params.append("limit", pageSize.toString());
    params.append("offset", (page * pageSize).toString());

    fetch(`/api/products?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setTotalProducts(data.total ?? data.products.length);
        setLoading(false);
      });
  }, [search, selectedCategory, selectedSubCategory, page]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold mb-6">StackShop</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedCategory ?? ""}
              onValueChange={(value) => {
                setSelectedCategory(value || undefined);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCategory && subCategories.length > 0 && (
              <Select
                value={selectedSubCategory ?? ""}
                onValueChange={(value) => {
                  setSelectedSubCategory(value || undefined);
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((subCat) => (
                    <SelectItem key={subCat} value={subCat}>
                      {subCat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {(search || selectedCategory || selectedSubCategory) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory(undefined);
                  setSelectedSubCategory(undefined);
                  setPage(0);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                disabled={page === 0 || loading}
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                disabled={(page + 1) * pageSize >= totalProducts || loading}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Showing {page * pageSize + 1}–
              {page * pageSize + products.length} of {totalProducts} products
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <Link
                  key={product.stacklineSku ?? `product-${index}`}
                  href={{
                    pathname: "/product",
                    query: { product: JSON.stringify(product) },
                  }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="p-0">
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
                        {product.imageUrls?.[0] && (
                          <Image
                            src={product.imageUrls[0]}
                            alt={product.title ?? ""}
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardTitle className="text-base line-clamp-2 mb-2">
                        {product.title ?? "Untitled"}
                      </CardTitle>
                      <CardDescription className="flex gap-2 flex-wrap">
                        {product.categoryName != null && product.categoryName !== "" && (
                          <Badge variant="secondary">
                            {product.categoryName}
                          </Badge>
                        )}
                        {product.subCategoryName != null && product.subCategoryName !== "" && (
                          <Badge variant="outline">
                            {product.subCategoryName}
                          </Badge>
                        )}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                disabled={page === 0 || loading}
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              >
                Previous
              </Button>

              <p className="text-sm text-muted-foreground">
                Page {page + 1} of {Math.max(1, Math.ceil(totalProducts / pageSize))}
              </p>

              <Button
                variant="outline"
                disabled={(page + 1) * pageSize >= totalProducts || loading}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
