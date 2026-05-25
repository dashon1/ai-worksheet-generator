import { useState, useCallback } from 'react';
import { Worksheet, WorksheetField, WorksheetType, WorksheetTemplate } from '../types';
import { worksheetTemplates } from '../data/templates';
import { useLocalStorage } from './useLocalStorage';

export function useWorksheet() {
	const [worksheets, setWorksheets] = useLocalStorage<Worksheet[]>('worksheets', []);

	const createWorksheet = useCallback(
		(type: WorksheetType, template?: WorksheetTemplate): Worksheet => {
			const baseTemplate = worksheetTemplates.find((t) => t.type === type);
			if (!baseTemplate && !template) throw new Error(`Template not found for type: ${type}`);

			const fieldsToUse = template || baseTemplate;
			const fields: WorksheetField[] = fieldsToUse.fields.map((field, index) => ({
				...field,
				id: `${type}-field-${Date.now()}-${index}`,
			}));

			const worksheet: Worksheet = {
				id: `${type}-${Date.now()}`,
				type,
				title: template?.title || baseTemplate?.title || `New ${type}`,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				fields,
				responses: {},
				isComplete: false,
			};

			setWorksheets((prev) => [...prev, worksheet]);
			return worksheet;
		},
		[setWorksheets]
	);

	const updateWorksheet = useCallback(
		(id: string, updates: Partial<Worksheet>) => {
			setWorksheets((prev) =>
				prev.map((w) =>
					w.id === id
						? { ...w, ...updates, updatedAt: new Date().toISOString() }
						: w
				)
			);
		},
		[setWorksheets]
	);

	const updateResponse = useCallback(
		(worksheetId: string, fieldId: string, response: string) => {
			setWorksheets((prev) =>
				prev.map((w) => {
					if (w.id !== worksheetId) return w;
					const newResponses = { ...w.responses, [fieldId]: response };
					const isComplete = w.fields.every(
						(field) => field.required && newResponses[field.id]?.trim()
					);
					return {
						...w,
						responses: newResponses,
						isComplete,
						updatedAt: new Date().toISOString(),
					};
				})
			);
		},
		[setWorksheets]
	);

	const deleteWorksheet = useCallback(
		(id: string) => {
			setWorksheets((prev) => prev.filter((w) => w.id !== id));
		},
		[setWorksheets]
	);

	const getWorksheet = useCallback(
		(id: string): Worksheet | undefined => {
			return worksheets.find((w) => w.id === id);
		},
		[worksheets]
	);

	return {
		worksheets,
		createWorksheet,
		updateWorksheet,
		updateResponse,
		deleteWorksheet,
		getWorksheet,
	};
}