"use client";

import { useState, useEffect } from "react";
import { Note } from "@/lib/types";
import { NoteCard } from "./note-card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus, Search, Loader2, Eye, Edit3 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getNotes, createNote } from "@/lib/api";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function NoteGrid() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);

  // Debounce search term with 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    loadNotes();
  }, []);

  // Handle debounced search
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        note.content
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        (note.tags &&
          note.tags.toLowerCase().includes(debouncedSearchTerm.toLowerCase())),
    );
    setFilteredNotes(filtered);
  }, [notes, debouncedSearchTerm]);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    setIsCreating(true);
    try {
      const created = await createNote({
        title: newNote.title || undefined,
        content: newNote.content || undefined,
        tags: newNote.tags || undefined,
      });
      setNotes([created, ...notes]);
      setNewNote({ title: "", content: "", tags: "" });
      setIsCreateDialogOpen(false);
      setIsReadOnlyMode(false); // Reset readonly mode when closing
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateDialogChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setIsReadOnlyMode(false); // Reset readonly mode when closing
    }
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)),
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
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
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/60 backdrop-blur-sm border-border focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={handleCreateDialogChange}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-title">Title (optional)</Label>
                <Input
                  id="new-title"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  placeholder="Enter note title"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="new-content">
                    Content (Markdown supported)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={isReadOnlyMode ? "outline" : "default"}
                      size="sm"
                      onClick={() => setIsReadOnlyMode(false)}
                      className="h-7 px-2"
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant={isReadOnlyMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsReadOnlyMode(true)}
                      className="h-7 px-2"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
                <div
                  className={`grid gap-4 mt-2 ${isReadOnlyMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}
                >
                  {/* Editor */}
                  {!isReadOnlyMode && (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">
                        Editor
                      </div>
                      <Textarea
                        id="new-content"
                        value={newNote.content}
                        onChange={(e) =>
                          setNewNote({ ...newNote, content: e.target.value })
                        }
                        placeholder="Start writing your note... Markdown is supported!"
                        className="min-h-64 font-mono text-sm resize-none"
                      />
                    </div>
                  )}

                  {/* Preview */}
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground font-medium">
                      {isReadOnlyMode ? "Note Content" : "Preview"}
                    </div>
                    <div className="border rounded-md p-3 min-h-64 overflow-y-auto bg-muted/30">
                      {newNote.content ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown
                            components={{
                              h1: ({ children }) => (
                                <h1 className="text-lg font-bold mb-2 text-foreground">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-base font-bold mb-2 text-foreground">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-sm font-bold mb-1 text-foreground">
                                  {children}
                                </h3>
                              ),
                              h4: ({ children }) => (
                                <h4 className="text-sm font-semibold mb-1 text-foreground">
                                  {children}
                                </h4>
                              ),
                              h5: ({ children }) => (
                                <h5 className="text-sm font-semibold mb-1 text-foreground">
                                  {children}
                                </h5>
                              ),
                              h6: ({ children }) => (
                                <h6 className="text-sm font-medium mb-1 text-foreground">
                                  {children}
                                </h6>
                              ),
                              p: ({ children }) => (
                                <p className="text-sm mb-2 text-foreground leading-relaxed">
                                  {children}
                                </p>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-foreground">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic text-foreground">
                                  {children}
                                </em>
                              ),
                              code: ({ children }) => (
                                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground border">
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="bg-muted p-3 rounded text-xs font-mono mb-2 overflow-x-auto border">
                                  {children}
                                </pre>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside mb-2 text-sm space-y-1">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal list-inside mb-2 text-sm space-y-1">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-foreground">{children}</li>
                              ),
                              a: ({ children, href }) => (
                                <a
                                  href={href}
                                  className="text-primary underline hover:text-primary/80"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {children}
                                </a>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-2">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {newNote.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm flex items-center justify-center h-full">
                          Preview will appear as you type...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="new-tags">Tags (pipe-separated)</Label>
                <Input
                  id="new-tags"
                  value={newNote.tags}
                  onChange={(e) =>
                    setNewNote({ ...newNote, tags: e.target.value })
                  }
                  placeholder="work | ideas | personal"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleCreateDialogChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateNote}
                  disabled={isCreating}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Note"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            {searchTerm ? "No notes found" : "No notes yet"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {searchTerm
              ? "Try adjusting your search terms or check the spelling."
              : "Create your first note to get started!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
