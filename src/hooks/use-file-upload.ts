import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
	type FileAttachment,
	isSupportedFileType,
	getFileTypeCategory,
	getFileTypeName,
	MAX_FILE_SIZE_BYTES,
	MAX_FILES_PER_MESSAGE,
	SUPPORTED_FILE_MIME_TYPES
} from '@/api-types';

export interface UseFileUploadOptions {
	maxFiles?: number;
	maxSizeBytes?: number;
	onError?: (error: string) => void;
}

export interface UseFileUploadReturn {
	files: FileAttachment[];
	addFiles: (files: File[]) => Promise<void>;
	removeFile: (id: string) => void;
	clearFiles: () => void;
	isProcessing: boolean;
}

/**
 * Detects MIME type from file extension if browser doesn't provide it
 */
function detectMimeType(file: File): string {
	if (file.type) return file.type;

	const ext = file.name.split('.').pop()?.toLowerCase();
	const mimeMap: Record<string, string> = {
		// Images
		'png': 'image/png',
		'jpg': 'image/jpeg',
		'jpeg': 'image/jpeg',
		'webp': 'image/webp',
		'heic': 'image/heic',
		'heif': 'image/heif',
		// Documents
		'pdf': 'application/pdf',
		'txt': 'text/plain',
		'md': 'text/markdown',
		'csv': 'text/csv',
		// Code
		'js': 'text/javascript',
		'mjs': 'text/javascript',
		'ts': 'text/typescript',
		'tsx': 'text/typescript',
		'jsx': 'text/javascript',
		'html': 'text/html',
		'css': 'text/css',
		'json': 'application/json',
		'py': 'text/x-python',
		'java': 'text/x-java',
		'c': 'text/x-c',
		'cpp': 'text/x-cpp',
		'cc': 'text/x-cpp',
		'cxx': 'text/x-cpp',
		'cs': 'text/x-csharp',
		'go': 'text/x-go',
		'rs': 'text/x-rust',
		'php': 'text/x-php',
		'rb': 'text/x-ruby',
		'swift': 'text/x-swift',
		'kt': 'text/x-kotlin',
		'xml': 'application/xml',
		'yaml': 'application/x-yaml',
		'yml': 'application/x-yaml',
	};

	return mimeMap[ext || ''] || 'application/octet-stream';
}

/**
 * Hook for handling file uploads
 */
export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
	const {
		maxFiles = MAX_FILES_PER_MESSAGE,
		maxSizeBytes = MAX_FILE_SIZE_BYTES,
		onError,
	} = options;

	const [files, setFiles] = useState<FileAttachment[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);

	const processFile = useCallback(async (file: File, relativePath?: string): Promise<FileAttachment | null> => {
		// Detect MIME type
		const mimeType = detectMimeType(file);

		// Validate MIME type
		if (!isSupportedFileType(mimeType)) {
			const supportedTypes = Array.from(new Set(
				SUPPORTED_FILE_MIME_TYPES.map(t => getFileTypeName(t))
			)).join(', ');
			const errorMsg = `Unsupported file type: ${file.name}. Only ${supportedTypes} are supported.`;
			toast.error(errorMsg);
			onError?.(errorMsg);
			return null;
		}

		// Validate file size
		if (file.size > maxSizeBytes) {
			const errorMsg = `File too large: ${file.name}. Maximum size is ${(maxSizeBytes / 1024 / 1024).toFixed(0)}MB.`;
			toast.error(errorMsg);
			onError?.(errorMsg);
			return null;
		}

		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const result = e.target?.result as string;
					if (!result) {
						reject(new Error('Failed to read file'));
						return;
					}

					// Extract base64 data (remove data URL prefix)
					const base64Data = result.split(',')[1];

					const attachment: FileAttachment = {
						id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
						filename: file.name,
						mimeType,
						base64Data,
						size: file.size,
						type: getFileTypeCategory(mimeType),
						relativePath,
					};

					resolve(attachment);
				} catch (error) {
					reject(error);
				}
			};

			reader.onerror = () => {
				reject(new Error(`Failed to read file: ${file.name}`));
			};

			reader.readAsDataURL(file);
		});
	}, [maxSizeBytes, onError]);

	const addFiles = useCallback(async (newFiles: File[]) => {
		setIsProcessing(true);

		try {
			// Check if adding these files would exceed the limit
			if (files.length + newFiles.length > maxFiles) {
				const errorMsg = `Maximum ${maxFiles} files allowed per message.`;
				toast.error(errorMsg);
				onError?.(errorMsg);
				return;
			}

			// Process all files with their relative paths (for folder uploads)
			const processedFiles = await Promise.all(
				newFiles.map(file => {
					// Extract relative path from webkitRelativePath if available
					const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
					return processFile(file, relativePath);
				})
			);

			// Filter out null results (failed validations)
			const validFiles = processedFiles.filter((file): file is FileAttachment => file !== null);

			if (validFiles.length > 0) {
				setFiles(prev => [...prev, ...validFiles]);
				toast.success(`Added ${validFiles.length} file${validFiles.length > 1 ? 's' : ''}`);
			}
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Failed to process files';
			toast.error(errorMsg);
			onError?.(errorMsg);
		} finally {
			setIsProcessing(false);
		}
	}, [files.length, maxFiles, processFile, onError]);

	const removeFile = useCallback((id: string) => {
		setFiles(prev => prev.filter(file => file.id !== id));
	}, []);

	const clearFiles = useCallback(() => {
		setFiles([]);
	}, []);

	return {
		files,
		addFiles,
		removeFile,
		clearFiles,
		isProcessing,
	};
}
