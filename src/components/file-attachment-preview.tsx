import { X, File, FileCode, FileText, Image } from 'lucide-react';
import type { FileAttachment } from '@/api-types';
import { motion, AnimatePresence } from 'framer-motion';
import { getFileTypeName } from '@/api-types';

export interface FileAttachmentPreviewProps {
	files: FileAttachment[];
	onRemove?: (id: string) => void;
	className?: string;
	compact?: boolean;
}

/**
 * Get appropriate icon for file type
 */
function getFileIcon(file: FileAttachment) {
	const iconClass = 'size-5 shrink-0';

	if (file.type === 'image') {
		return <Image className={iconClass} />;
	}
	if (file.type === 'code') {
		return <FileCode className={iconClass} />;
	}
	if (file.type === 'document') {
		return <FileText className={iconClass} />;
	}
	return <File className={iconClass} />;
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Component to display file attachment previews
 */
export function FileAttachmentPreview({
	files,
	onRemove,
	className = '',
	compact = false,
}: FileAttachmentPreviewProps) {
	if (files.length === 0) return null;

	return (
		<div className={`flex flex-wrap gap-2 ${className}`}>
			<AnimatePresence mode="popLayout">
				{files.map((file) => {
					const isImage = file.type === 'image';

					return (
						<motion.div
							key={file.id}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.2 }}
							className={`relative group ${
								compact ? 'max-w-[160px]' : 'max-w-[200px]'
							} rounded-lg overflow-hidden border border-border-primary bg-bg-3`}
						>
							{isImage ? (
								// Image preview with thumbnail
								<div className={`${compact ? 'w-12 h-12' : 'w-20 h-20'} relative`}>
									<img
										src={`data:${file.mimeType};base64,${file.base64Data}`}
										alt={file.filename}
										className="w-full h-full object-cover"
									/>
									{onRemove && (
										<button
											type="button"
											onClick={() => onRemove(file.id)}
											className="absolute top-1 right-1 p-0.5 rounded-full bg-bg-1/90 hover:bg-bg-1 text-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
											aria-label={`Remove ${file.filename}`}
										>
											<X className="size-3" />
										</button>
									)}
									{!compact && (
										<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg-1/90 to-transparent p-1">
											<p className="text-[10px] text-text-secondary truncate">
												{file.filename}
											</p>
										</div>
									)}
								</div>
							) : (
								// Non-image file preview with icon and details
								<div className="flex items-center gap-2 p-2">
									<div className="text-text-secondary">
										{getFileIcon(file)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs font-medium text-text-primary truncate">
											{file.relativePath || file.filename}
										</p>
										<div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
											<span>{getFileTypeName(file.mimeType)}</span>
											<span>•</span>
											<span>{formatFileSize(file.size)}</span>
										</div>
									</div>
									{onRemove && (
										<button
											type="button"
											onClick={() => onRemove(file.id)}
											className="p-0.5 rounded-full hover:bg-bg-1 text-text-secondary hover:text-text-primary transition-colors"
											aria-label={`Remove ${file.filename}`}
										>
											<X className="size-3.5" />
										</button>
									)}
								</div>
							)}
						</motion.div>
					);
				})}
			</AnimatePresence>
		</div>
	);
}
