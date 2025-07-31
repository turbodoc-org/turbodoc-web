"use client";

import { useState } from "react";
import { Note } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Trash2,
  Edit,
  MoreVertical,
  Clock,
  StickyNote,
  Loader2,
  Eye,
  Edit3,
} from "lucide-react";
import { deleteNote, updateNote } from "@/lib/api";
import ReactMarkdown from "react-markdown";

interface NoteCardProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [editTags, setEditTags] = useState(note.tags || "");
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);

  const tags = note.tags
    ? note.tags
        .split("|")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteNote(note.id);
      onDelete(note.id);
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateNote(note.id, {
        title: editTitle,
        content: editContent,
        tags: editTags || null,
      });
      onUpdate(updated);
      setIsEditing(false);
      setIsReadOnlyMode(false); // Reset readonly mode when closing
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleEditingChange = (open: boolean) => {
    setIsEditing(open);
    if (!open) {
      setIsReadOnlyMode(false); // Reset readonly mode when closing
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="group h-80 hover:shadow-lg transition-all duration-200 border border-border hover:border-primary/20 shadow-sm bg-card overflow-hidden dark:border-gray-400 flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Header with icon and action menu */}
        <div className="relative p-3 sm:p-4 border-b border-border bg-muted/30 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-primary flex-shrink-0" />
            <h3 className="font-semibold text-sm leading-tight text-foreground flex-1 min-w-0">
              {note.title ? truncateText(note.title, 30) : "Untitled Note"}
            </h3>
          </div>

          {/* Action Menu */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background/90"
                >
                  <MoreVertical className="h-3 w-3 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit note
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 p-3 sm:p-4 overflow-hidden">
          <div className="h-full overflow-hidden">
            {note.content ? (
              <div className="text-xs text-muted-foreground line-clamp-6 overflow-hidden">
                <ReactMarkdown
                  components={{
                    // Customize markdown rendering for card preview
                    h1: ({ children }) => (
                      <div className="font-semibold text-foreground mb-1 text-xs">
                        {children}
                      </div>
                    ),
                    h2: ({ children }) => (
                      <div className="font-semibold text-foreground mb-1 text-xs">
                        {children}
                      </div>
                    ),
                    h3: ({ children }) => (
                      <div className="font-medium text-foreground mb-1 text-xs">
                        {children}
                      </div>
                    ),
                    h4: ({ children }) => (
                      <div className="font-medium text-foreground mb-1 text-xs">
                        {children}
                      </div>
                    ),
                    h5: ({ children }) => (
                      <div className="font-medium text-foreground mb-1 text-xs">
                        {children}
                      </div>
                    ),
                    h6: ({ children }) => (
                      <div className="font-medium text-foreground mb-1 text-xs">
                        {children}
                      </div>
                    ),
                    p: ({ children }) => (
                      <div className="mb-1 text-xs leading-relaxed text-muted-foreground">
                        {children}
                      </div>
                    ),
                    strong: ({ children }) => (
                      <span className="font-semibold text-foreground">
                        {children}
                      </span>
                    ),
                    em: ({ children }) => (
                      <span className="italic">{children}</span>
                    ),
                    code: ({ children }) => (
                      <span className="bg-muted px-1 rounded text-xs font-mono border">
                        {children}
                      </span>
                    ),
                    pre: ({ children }) => (
                      <div className="bg-muted p-2 rounded text-xs font-mono mb-1 border">
                        {children}
                      </div>
                    ),
                    ul: ({ children }) => (
                      <div className="mb-1 space-y-0.5">{children}</div>
                    ),
                    ol: ({ children }) => (
                      <div className="mb-1 space-y-0.5">{children}</div>
                    ),
                    li: ({ children }) => (
                      <div className="mb-0.5 text-xs">• {children}</div>
                    ),
                    a: ({ children }) => (
                      <span className="text-primary underline">{children}</span>
                    ),
                    blockquote: ({ children }) => (
                      <div className="border-l-2 border-primary pl-2 italic text-muted-foreground mb-1">
                        {children}
                      </div>
                    ),
                  }}
                >
                  {truncateText(note.content, 200)}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                Empty note
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="px-3 sm:px-4 pb-3">
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-warning/10 text-warning-foreground border-warning/20 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                >
                  {truncateText(tag, 12)}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 border-border text-muted-foreground dark:border-gray-500 dark:text-gray-400"
                >
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-3 sm:px-4 py-2 bg-muted/30 border-t border-border dark:border-gray-500 dark:bg-gray-800">
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatDate(note.updated_at)}</span>
          </div>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={handleEditingChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Note title (optional)"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="edit-content">
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
                      id="edit-content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Write your note content here... Markdown is supported!"
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
                    {editContent ? (
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
                          {editContent}
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
              <Label htmlFor="edit-tags">Tags (pipe-separated)</Label>
              <Input
                id="edit-tags"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="work | ideas | personal"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleEditingChange(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
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
    </Card>
  );
}
