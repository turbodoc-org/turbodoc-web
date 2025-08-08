"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Note } from "@/lib/types";
import { getNote, updateNote, deleteNote } from "@/lib/api";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { ArrowLeft, Trash2, Loader2, Clock, StickyNote } from "lucide-react";

interface NoteEditorProps {
  noteId: string;
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  // Debounced values for auto-save
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);
  const debouncedTags = useDebounce(tags, 1000);

  const loadNote = useCallback(async () => {
    try {
      setLoading(true);
      const noteData = await getNote(noteId);
      setNote(noteData);
      setTitle(noteData.title || "");
      setContent(noteData.content || "");
      setTags(noteData.tags || "");
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to load note:", error);
      console.error("Failed to load note");
      router.push("/notes");
    } finally {
      setLoading(false);
    }
  }, [noteId, router]);

  // Auto-save effect
  useEffect(() => {
    if (!note) return;

    const hasDataChanges =
      debouncedTitle !== (note.title || "") ||
      debouncedContent !== (note.content || "") ||
      debouncedTags !== (note.tags || "");

    if (
      hasDataChanges &&
      (debouncedTitle || debouncedContent || debouncedTags)
    ) {
      const autoSave = async () => {
        try {
          setAutoSaving(true);
          const updated = await updateNote(note.id, {
            title: debouncedTitle || undefined,
            content: debouncedContent || undefined,
            tags: debouncedTags || null,
          });
          setNote(updated);
          setHasChanges(false);
          setLastSaved(new Date());
        } catch (error) {
          console.error("Failed to auto-save note:", error);
        } finally {
          setAutoSaving(false);
        }
      };

      autoSave();
    }
  }, [debouncedTitle, debouncedContent, debouncedTags, note]);

  useEffect(() => {
    loadNote();
  }, [loadNote]);

  const handleDelete = async () => {
    if (!note) return;

    try {
      setDeleting(true);
      await deleteNote(note.id);
      console.log("Note deleted successfully");
      router.push("/notes");
    } catch (error) {
      console.error("Failed to delete note:", error);
      console.error("Failed to delete note");
    } finally {
      setDeleting(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
  };

  const handleContentChange = (value: string) => {
    setContent(value ?? "");
    setHasChanges(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading note...
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Note not found
          </h2>
          <p className="text-muted-foreground mb-4">
            The note you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Button onClick={() => router.push("/notes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="w-full max-w-5xl mx-auto flex justify-between items-center p-3 md:p-4 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/notes")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Notes</span>
            </Button>
            <div className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
                {title || "Untitled Note"}
              </h1>
              {autoSaving ? (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </span>
              ) : hasChanges ? (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  Unsaved changes
                </span>
              ) : lastSaved ? (
                <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-1 rounded">
                  Saved
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Updated {formatDate(note.updated_at)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={deleting}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6">
        <div className="space-y-8 bg-card rounded-lg border border-border shadow-sm my-6 p-6 md:p-8">
          {/* Title Input */}
          <div>
            <Label
              htmlFor="title"
              className="text-sm font-medium text-foreground mb-3 block sr-only"
            >
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter note title..."
              className="text-xl font-semibold border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Content Editor */}
          <div className="flex-1">
            <Label
              htmlFor="content"
              className="text-sm font-medium text-foreground mb-3 block"
            >
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start writing your note..."
              className="min-h-[500px] resize-none border-border/50 focus:border-primary/50 bg-background/50 text-base leading-relaxed"
              spellCheck={true}
            />
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{title || "this note"}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
