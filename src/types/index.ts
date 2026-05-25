export type WorksheetType = 'skill' | 'agent' | 'workflow' | 'mcp';

export interface WorksheetField {
	id: string;
	question: string;
	hint: string;
	explanation: string;
	placeholder: string;
	type: 'text' | 'textarea' | 'select' | 'list';
	options?: string[];
	required: boolean;
}

export interface Worksheet {
	id: string;
	type: WorksheetType;
	title: string;
	createdAt: string;
	updatedAt: string;
	fields: WorksheetField[];
	responses: Record<string, string>;
	isComplete: boolean;
}

export interface AppSettings {
	theme: 'light' | 'dark' | 'system';
	autoSave: boolean;
	showHints: boolean;
	showExplanations: boolean;
}

export interface WorksheetTemplate {
	type: WorksheetType;
	title: string;
	description: string;
	icon: string;
	fields: Omit<WorksheetField, 'id'>[];
}

export interface PrebuiltTemplate {
	id: string;
	type: WorksheetType;
	name: string;
	description: string;
	icon: string;
	category: string;
	fields: Omit<WorksheetField, 'id'>[];
}

export type ExportFormat = 'pdf' | 'html' | 'markdown' | 'json' | 'product';

export interface ToastMessage {
	id: string;
	type: 'success' | 'error' | 'info';
	message: string;
}