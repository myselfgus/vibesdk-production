import { useRef, type ChangeEvent } from 'react';
import { FileUp, FolderUp } from 'lucide-react';
import { SUPPORTED_FILE_MIME_TYPES } from '@/api-types';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface FileUploadButtonProps {
	onFilesSelected: (files: File[]) => void;
	disabled?: boolean;
	multiple?: boolean;
	className?: string;
	iconClassName?: string;
	showFolderUpload?: boolean;
}

/**
 * Button component for uploading files with optional folder upload support
 */
export function FileUploadButton({
	onFilesSelected,
	disabled = false,
	multiple = true,
	className = '',
	iconClassName = 'size-4',
	showFolderUpload = true,
}: FileUploadButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const folderInputRef = useRef<HTMLInputElement>(null);

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleFolderClick = () => {
		folderInputRef.current?.click();
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length > 0) {
			onFilesSelected(files);
		}
		// Reset input so the same file can be selected again
		if (e.currentTarget) {
			e.currentTarget.value = '';
		}
	};

	// If folder upload is not enabled, show simple button
	if (!showFolderUpload) {
		return (
			<>
				<input
					ref={fileInputRef}
					type="file"
					accept={SUPPORTED_FILE_MIME_TYPES.join(',')}
					multiple={multiple}
					onChange={handleFileChange}
					className="hidden"
					disabled={disabled}
				/>
				<button
					type="button"
					onClick={handleClick}
					disabled={disabled}
					className={`p-1 rounded-md bg-transparent hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
					aria-label="Upload files"
					title="Upload files (Images, PDF, Code, Documents)"
				>
					<FileUp className={iconClassName} strokeWidth={1.5} />
				</button>
			</>
		);
	}

	// Show dropdown with file and folder options
	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				accept={SUPPORTED_FILE_MIME_TYPES.join(',')}
				multiple={multiple}
				onChange={handleFileChange}
				className="hidden"
				disabled={disabled}
			/>
			<input
				ref={folderInputRef}
				type="file"
				// @ts-expect-error - webkitdirectory is not in standard TypeScript DOM types
				webkitdirectory="true"
				directory="true"
				onChange={handleFileChange}
				className="hidden"
				disabled={disabled}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						disabled={disabled}
						className={`p-1 rounded-md bg-transparent hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
						aria-label="Upload files or folder"
						title="Upload files or folder"
					>
						<FileUp className={iconClassName} strokeWidth={1.5} />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem onClick={handleClick} disabled={disabled}>
						<FileUp className="size-4 mr-2" strokeWidth={1.5} />
						Upload Files
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleFolderClick} disabled={disabled}>
						<FolderUp className="size-4 mr-2" strokeWidth={1.5} />
						Upload Folder
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
