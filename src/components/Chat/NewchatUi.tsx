///home/josephhenry/Downloads/project/legal assitant/src/components/Chat/NewchatUi.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { useRouter, useParams } from 'next/navigation';
import { MessageSquarePlus, Send, Bot, User, Pin, Paperclip, Plus, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { useHistorySidebar } from "@/contexts/history-sidebar-context";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { createChat, deleteUploadedFile } from '@/lib/actions/chat';

interface UploadedFile {
  id?: string;
  name: string;
  content: string;
  type: string;
  preview?: string;
  uploading?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  files?: UploadedFile[];
}

const loadingMessages = [
  "Analyzing your request...",
  "Preparing your response...",
  "Applying legal reasoning...",
  "Formulating expert opinion...",
  "Preparing your response...",
];

const suggestions = [
  {
    title: "Case Law Analysis",
    description: "Analyze precedents and case outcomes",
    query: "Help me analyze the precedents set by..."
  },
  {
    title: "Document Review",
    description: "Review and summarize legal documents",
    query: "Can you review this legal document..."
  },
  {
    title: "Legal Research",
    description: "Research specific legal topics",
    query: "Research the legal implications of..."
  },
  {
    title: "Draft Summary",
    description: "Create legal document summaries",
    query: "Create a summary of this case..."
  }
];

export default function NewCustomGPTUI() {
  const router = useRouter();
  const params = useParams();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [pendingFiles, setPendingFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { input, handleInputChange, handleSubmit: handleChatSubmit, isLoading } = useChat({
    id: params?.chatId as string,
    api: '/api/chat',
    body: { 
      pdfContent: uploadedFiles.map(f => f.content).join('\n') 
    },
    onFinish: (message) => {
      const assistantMessage: Message = {
        id: '',
        role: 'assistant',
        content: message.content
      };
      setMessages(prev => [...prev, assistantMessage]);
    }
  });

  const { open: sidebarOpen, isMobile } = useSidebar();
  const { isHistoryOpen } = useHistorySidebar();
  const isNewChat = messages.length === 0;

  const removeFile = async (fileName: string) => {
    // Immediately remove file from UI
    const fileToRemove = pendingFiles.find(file => file.name === fileName);
    if (!fileToRemove) return;

    // Clean up preview URL if it exists
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    // Immediately update UI states
    setPendingFiles(prev => prev.filter(file => file.name !== fileName));
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));

    // Handle database deletion asynchronously
    if (fileToRemove.id) {
      try {
        deleteUploadedFile(fileToRemove.id).catch(error => {
          console.error('Error deleting file from database:', error);
          // Optionally implement retry logic or silent failure
        });
      } catch (error) {
        console.error('Error initiating file deletion:', error);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        let preview = '';
        if (file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file);
        }

        // Add file to pending files with uploading status
        const tempFile: UploadedFile = {
          name: file.name,
          content: '',
          type: file.type,
          preview,
          uploading: true
        };
        setPendingFiles(prev => [...prev, tempFile]);

        const response = await fetch('/api/upload-pdf', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { id, text, type } = await response.json();
          // Update the file with actual content, type, and ID from the server
          setPendingFiles(prev => prev.map(f => 
            f.name === file.name 
              ? { ...f, content: text, type, id, uploading: false }
              : f
          ));
        } else {
          // Remove failed file
          setPendingFiles(prev => prev.filter(f => f.name !== file.name));
          alert(`Error uploading ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: '',
      role: 'user',
      content: input,
      files: pendingFiles
    };

    setMessages(prev => [...prev, userMessage]);
    setUploadedFiles(prev => [...prev, ...pendingFiles]);
    setPendingFiles([]);

    if (!params?.chatId) {
      const newChat = await createChat();
      router.push(`/chat/${newChat.id}`);
    }
    
    handleChatSubmit(e);
  };

  const handleSuggestionClick = (query: string) => {
    const chatId = Math.random().toString(36).substring(2, 15);
    router.push(`/chat/${chatId}`);
  };

  const getContainerStyles = () => {
    let marginLeft = "0px";
    let marginRight = "0px";
    let width = "100%";
    let maxWidth = "100%";
    
    if (!isMobile) {
      if (sidebarOpen) {
        marginLeft = "300px";
      } else {
        marginLeft = "64px";
      }

      if (isHistoryOpen) {
        marginRight = "-300px";
      }

      const totalMargins = parseInt(marginLeft) + parseInt(marginRight);
      width = `calc(100% - ${totalMargins}px)`;
    }

    return {
      marginLeft,
      marginRight,
      width,
      maxWidth,
      transition: 'all 0.3s ease-in-out'
    };
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const containerStyles = getContainerStyles();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col bg-background"
      style={containerStyles}
    >
      <ScrollArea className="flex-1 px-4">
        <div className={cn(
          "mx-auto py-6 space-y-6",
          "w-full max-w-4xl",
          "transition-all duration-300"
        )}>
          {isNewChat ? (
            <div className={cn("space-y-6", isMobile && "mt-4")}>
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome to LexTech AI
                </h1>
                <p className="text-muted-foreground">
                  Your intelligent legal assistant
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion) => (
                  <Card 
                    key={suggestion.title}
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleSuggestionClick(suggestion.query)}
                  >
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{suggestion.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  <Card className={cn(
                    message.role === "assistant" ? "bg-accent" : "bg-background"
                  )}>
                    <CardContent className="p-4 flex gap-4">
                      {message.role === "assistant" ? (
                        <Bot className="w-6 h-6 text-primary" />
                      ) : (
                        <User className="w-6 h-6 text-muted-foreground" />
                      )}
                      <div className="flex-1 prose dark:prose-invert max-w-none">
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {message.files && message.files.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-10">
                      {message.files.map((file) => (
                        <div key={file.name} className="relative">
                          <div className="w-20 h-20 rounded border flex items-center justify-center overflow-hidden">
                            {file.type.startsWith('image/') ? (
                              <img src={file.preview || file.content} alt={file.name} className="object-cover w-full h-full" />
                            ) : (
                              <FileText className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                          <span className="absolute bottom-0 left-0 right-0 text-[10px] truncate text-center bg-black/50 text-white p-1">
                            {file.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <Card className="bg-accent">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Bot className="w-6 h-6 text-primary" />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {pendingFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {pendingFiles.map((file) => (
                <div key={file.name} className="relative group">
                  <div className="w-20 h-20 rounded-md border flex items-center justify-center overflow-hidden">
                    {file.uploading ? (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    ) : null}
                    {file.type.startsWith('image/') ? (
                      <img src={file.preview || file.content} alt={file.name} className="object-cover w-full h-full rounded-md" />
                    ) : (
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100"
                    onClick={() => removeFile(file.name)}
                    disabled={file.uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <span className="absolute bottom-0 left-0 right-0 text-[10px] truncate text-center bg-black/50 text-white p-1">
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="relative">
            <Textarea
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className={cn(
                "resize-none pr-24",
                {
                  "min-h-[200px]": !isMobile && isNewChat && pendingFiles.length === 0,
                  "min-h-[100px]": isMobile || !isNewChat || pendingFiles.length > 0,
                }
              )}
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="hover:bg-accent"
                disabled={isLoading}
              >
                <Paperclip className="w-6 h-6" />
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !input.trim()}
                className="hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}