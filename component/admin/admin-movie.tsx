"use client";

import { useState } from "react";
import { useMovies } from "../../lib/hooks/useMovie";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Card } from "../../component/ui/card";
import { Button } from "../../component/ui/button";
import { Badge } from "../../component/ui/badge";
import { Input } from "../../component/ui/input";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../../component/ui/alert-dialog";
import Image from "next/image";

export function AdminMovies() {
  const { data: movies = [], isLoading } = useMovies();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (movieId: string) => {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete movie");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteMovie = (movieId: string) => {
    deleteMutation.mutate(movieId);
    setDeletingId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Movies Management
            </h1>
            <p className="text-muted-foreground">
              Add, edit, or remove movies from your catalog
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add New Movie
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Movies List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="p-12 text-center border-border">
            <p className="text-muted-foreground">Loading movies...</p>
          </Card>
        ) : filteredMovies.length === 0 ? (
          <Card className="p-12 text-center border-border">
            <p className="text-muted-foreground mb-4">
              No movies found matching your search
            </p>
            <Button>Create First Movie</Button>
          </Card>
        ) : (
          filteredMovies.map((movie, index) => (
            <motion.div
              key={movie._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="p-6 border-border hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Movie Image */}
                  <div className="w-full md:w-32 h-48 md:h-40 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={movie.posterUrl || "/placeholder.svg"}
                      alt={movie.title}
                      width={128}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Movie Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {movie.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {movie.genre.map((g) => (
                            <Badge key={g} variant="secondary">
                              {g}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-accent">
                          {movie.rating}
                        </p>
                        <p className="text-xs text-muted-foreground">/10</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {movie.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Duration
                        </p>
                        <p className="font-semibold text-foreground">
                          {movie.duration} min
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Director
                        </p>
                        <p className="font-semibold text-foreground">
                          {movie.director}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Release</p>
                        <p className="font-semibold text-foreground">
                          {new Date(movie.releaseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cast</p>
                        <p className="font-semibold text-foreground text-sm">
                          {movie.cast.length} actors
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive bg-transparent"
                        onClick={() => setDeletingId(movie._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Movie?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this movie? This action cannot be
            undone.
          </AlertDialogDescription>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDeleteMovie(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Movie
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
