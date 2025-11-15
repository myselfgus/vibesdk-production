/**
 * Supported file MIME types for upload
 * Organized by category: images, documents, code, data
 */
export const SUPPORTED_FILE_MIME_TYPES = [
	// Images
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/heic',
	'image/heif',
	// Documents
	'application/pdf',
	'text/plain',
	'text/markdown',
	'text/csv',
	// Code files
	'text/javascript',
	'application/javascript',
	'text/typescript',
	'application/typescript',
	'text/html',
	'text/css',
	'application/json',
	'text/x-python',
	'text/x-java',
	'text/x-c',
	'text/x-cpp',
	'text/x-csharp',
	'text/x-go',
	'text/x-rust',
	'text/x-php',
	'text/x-ruby',
	'text/x-swift',
	'text/x-kotlin',
	'application/xml',
	'text/xml',
	'application/x-yaml',
	'text/yaml',
] as const;

export type SupportedFileMimeType = typeof SUPPORTED_FILE_MIME_TYPES[number];

/**
 * File type categories for UI organization
 */
export type FileAttachmentType = 'image' | 'document' | 'code';

/**
 * File attachment for user messages
 * Represents a file that can be sent with text prompts
 */
export interface FileAttachment {
	/** Unique identifier for this attachment */
	id: string;
	/** Original filename */
	filename: string;
	/** MIME type of the file */
	mimeType: string;
	/** Base64-encoded file data (without data URL prefix) */
	base64Data: string;
	/** Size of the original file in bytes */
	size: number;
	/** File type category */
	type: FileAttachmentType;
	/** Optional relative path for folder uploads */
	relativePath?: string;
}

/**
 * Utility to check if a MIME type is supported
 */
export function isSupportedFileType(mimeType: string): mimeType is SupportedFileMimeType {
	return SUPPORTED_FILE_MIME_TYPES.includes(mimeType as SupportedFileMimeType);
}

/**
 * Utility to determine file type category from MIME type
 */
export function getFileTypeCategory(mimeType: string): FileAttachmentType {
	if (mimeType.startsWith('image/')) {
		return 'image';
	}
	if (
		mimeType === 'application/pdf' ||
		mimeType === 'text/plain' ||
		mimeType === 'text/markdown' ||
		mimeType === 'text/csv'
	) {
		return 'document';
	}
	return 'code';
}

/**
 * Utility to get file extension from MIME type
 */
export function getFileExtensionFromMimeType(mimeType: string): string {
	const map: Record<string, string> = {
		// Images
		'image/png': 'png',
		'image/jpeg': 'jpg',
		'image/webp': 'webp',
		'image/heic': 'heic',
		'image/heif': 'heif',
		// Documents
		'application/pdf': 'pdf',
		'text/plain': 'txt',
		'text/markdown': 'md',
		'text/csv': 'csv',
		// Code
		'text/javascript': 'js',
		'application/javascript': 'js',
		'text/typescript': 'ts',
		'application/typescript': 'ts',
		'text/html': 'html',
		'text/css': 'css',
		'application/json': 'json',
		'text/x-python': 'py',
		'text/x-java': 'java',
		'text/x-c': 'c',
		'text/x-cpp': 'cpp',
		'text/x-csharp': 'cs',
		'text/x-go': 'go',
		'text/x-rust': 'rs',
		'text/x-php': 'php',
		'text/x-ruby': 'rb',
		'text/x-swift': 'swift',
		'text/x-kotlin': 'kt',
		'application/xml': 'xml',
		'text/xml': 'xml',
		'application/x-yaml': 'yaml',
		'text/yaml': 'yaml',
	};
	return map[mimeType] || 'txt';
}

/**
 * Utility to get human-readable file type name
 */
export function getFileTypeName(mimeType: string): string {
	if (mimeType.startsWith('image/')) {
		return mimeType.replace('image/', '').toUpperCase();
	}
	if (mimeType === 'application/pdf') return 'PDF';
	if (mimeType === 'text/plain') return 'Text';
	if (mimeType === 'text/markdown') return 'Markdown';
	if (mimeType === 'text/csv') return 'CSV';
	if (mimeType.includes('javascript')) return 'JavaScript';
	if (mimeType.includes('typescript')) return 'TypeScript';
	if (mimeType === 'text/html') return 'HTML';
	if (mimeType === 'text/css') return 'CSS';
	if (mimeType === 'application/json') return 'JSON';
	if (mimeType === 'text/x-python') return 'Python';
	if (mimeType === 'text/x-java') return 'Java';
	if (mimeType === 'text/x-c') return 'C';
	if (mimeType === 'text/x-cpp') return 'C++';
	if (mimeType === 'text/x-csharp') return 'C#';
	if (mimeType === 'text/x-go') return 'Go';
	if (mimeType === 'text/x-rust') return 'Rust';
	if (mimeType === 'text/x-php') return 'PHP';
	if (mimeType === 'text/x-ruby') return 'Ruby';
	if (mimeType === 'text/x-swift') return 'Swift';
	if (mimeType === 'text/x-kotlin') return 'Kotlin';
	if (mimeType.includes('xml')) return 'XML';
	if (mimeType.includes('yaml')) return 'YAML';
	return 'File';
}

/**
 * Maximum file size for uploads (10MB)
 */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Maximum number of files per message
 */
export const MAX_FILES_PER_MESSAGE = 20;
