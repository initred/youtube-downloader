"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UrlInputProps {
  onSearch: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onSearch, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSearch(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="url"
        placeholder="Enter YouTube URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !url.trim()}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
