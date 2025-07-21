"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "@/lib/types";
import { BookmarkCard } from "./bookmark-card";
import { DragDropZone } from "./drag-drop-zone";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus, Search, Loader2 } from "lucide-react";
import { getBookmarks, createBookmark } from "@/lib/api";

export function BookmarkGrid() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBookmark, setNewBookmark] = useState({
    title: "",
    url: "",
    tags: "",
  });

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredBookmarks(bookmarks);
    } else {
      const filtered = bookmarks.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (bookmark.tags &&
            bookmark.tags.toLowerCase().includes(searchTerm.toLowerCase())),
      );
      setFilteredBookmarks(filtered);
    }
  }, [bookmarks, searchTerm]);

  const loadBookmarks = async () => {
    try {
      const data = await getBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBookmark = async () => {
    if (!newBookmark.title || !newBookmark.url) {
      return;
    }

    setIsCreating(true);
    try {
      const created = await createBookmark({
        title: newBookmark.title,
        url: newBookmark.url,
        tags: newBookmark.tags || undefined,
      });
      setBookmarks([created, ...bookmarks]);
      setNewBookmark({ title: "", url: "", tags: "" });
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create bookmark:", error);
      setIsCreating(false);
    }
  };

  const handleDragDropBookmark = (bookmark: Bookmark) => {
    setBookmarks([bookmark, ...bookmarks]);
  };

  const handleUpdateBookmark = (updatedBookmark: Bookmark) => {
    setBookmarks(
      bookmarks.map((bookmark) =>
        bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark,
      ),
    );
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/60 backdrop-blur-sm border-border focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Bookmark
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Bookmark</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-title">Title</Label>
                <Input
                  id="new-title"
                  value={newBookmark.title}
                  onChange={(e) =>
                    setNewBookmark({ ...newBookmark, title: e.target.value })
                  }
                  placeholder="Enter bookmark title"
                />
              </div>
              <div>
                <Label htmlFor="new-url">URL</Label>
                <Input
                  id="new-url"
                  value={newBookmark.url}
                  onChange={(e) =>
                    setNewBookmark({ ...newBookmark, url: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="new-tags">Tags (pipe-separated)</Label>
                <Input
                  id="new-tags"
                  value={newBookmark.tags}
                  onChange={(e) =>
                    setNewBookmark({ ...newBookmark, tags: e.target.value })
                  }
                  placeholder="work | important | read-later"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={handleCreateBookmark}
                  disabled={
                    !newBookmark.title || !newBookmark.url || isCreating
                  }
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Bookmark"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Drag and Drop Zone */}
      <DragDropZone onBookmarkCreated={handleDragDropBookmark} />

      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            {searchTerm ? "No bookmarks found" : "No bookmarks yet"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {searchTerm
              ? "Try adjusting your search terms or check the spelling."
              : "Create your first bookmark to get started organizing your links!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onUpdate={handleUpdateBookmark}
              onDelete={handleDeleteBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}
