"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import type { VideoFormat, FormatType } from "@/types/video";

interface FormatSelectorProps {
  formatType: FormatType;
  onFormatTypeChange: (type: FormatType) => void;
  videoFormats: VideoFormat[];
  audioFormats: VideoFormat[];
  selectedFormat: VideoFormat | null;
  onFormatChange: (format: VideoFormat) => void;
}

export function FormatSelector({
  formatType,
  onFormatTypeChange,
  videoFormats,
  audioFormats,
  selectedFormat,
  onFormatChange,
}: FormatSelectorProps) {
  const formats = formatType === "mp4" ? videoFormats : audioFormats;

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1000) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <FieldGroup className="flex-row items-end gap-4">
      <Field className="w-auto">
        <FieldLabel>Format</FieldLabel>
        <Select
          value={formatType}
          onValueChange={(value) => onFormatTypeChange(value as FormatType)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mp4">MP4 (Video)</SelectItem>
            <SelectItem value="mp3">MP3 (Audio)</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field className="flex-1">
        <FieldLabel>{formatType === "mp4" ? "Quality" : "Bitrate"}</FieldLabel>
        <Select
          value={selectedFormat?.formatId || ""}
          onValueChange={(formatId) => {
            const format = formats.find((f) => f.formatId === formatId);
            if (format) {
              onFormatChange(format);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={`Select ${formatType === "mp4" ? "quality" : "bitrate"}`}
            />
          </SelectTrigger>
          <SelectContent>
            {formats.map((format) => (
              <SelectItem key={format.formatId} value={format.formatId}>
                {format.resolution}
                {format.filesize && ` (${formatFileSize(format.filesize)})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
}
