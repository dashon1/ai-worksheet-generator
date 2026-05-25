import { Lightbulb, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useState } from 'react';
import { WorksheetField } from '../../types';

interface QuestionCardProps {
	field: WorksheetField;
	index: number;
	response: string;
	showHints: boolean;
	showExplanations: boolean;
	onResponseChange: (value: string) => void;
	isActive: boolean;
}

export function QuestionCard({
	field,
	index,
	response,
	showHints,
	showExplanations,
	onResponseChange,
	isActive,
}: QuestionCardProps) {
	const [showHint, setShowHint] = useState(false);
	const [showExplanation, setShowExplanation] = useState(false);
	const isFilled = response && response.trim().length > 0;

	return (
		<div
			className={`
				rounded-xl border-2 transition-all duration-300 overflow-hidden
				${
					isActive
						? 'border-indigo-500 bg-white dark:bg-slate-800 shadow-lg shadow-indigo-500/10'
						: isFilled
						? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10'
						: 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
				}
			`}
		>
			<div className="p-6">
				<div className="flex items-start gap-4 mb-4">
					<div
						className={`
							w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
							${
								isFilled
									? 'bg-emerald-500 text-white'
									: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
							}
						`}
					>
						{isFilled ? <Check className="w-4 h-4" /> : index + 1}
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
							{field.question}
							{field.required && <span className="text-red-500 ml-1">*</span>}
						</h3>

						{showHints && field.hint && (
							<button
								onClick={() => setShowHint(!showHint)}
								className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
							>
								<Lightbulb className="w-4 h-4" />
								<span>{showHint ? 'Hide hint' : 'Show hint'}</span>
								{showHint ? (
									<ChevronUp className="w-4 h-4" />
								) : (
									<ChevronDown className="w-4 h-4" />
								)}
							</button>
						)}

						{showHint && field.hint && (
							<div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
								<p className="text-sm text-amber-800 dark:text-amber-200">{field.hint}</p>
							</div>
						)}
					</div>
				</div>

				<div className="ml-12">
					{field.type === 'select' ? (
						<select
							value={response}
							onChange={(e) => onResponseChange(e.target.value)}
							className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
						>
							<option value="">{field.placeholder}</option>
							{field.options?.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					) : field.type === 'textarea' ? (
						<textarea
							value={response}
							onChange={(e) => onResponseChange(e.target.value)}
							placeholder={field.placeholder}
							rows={5}
							className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
						/>
					) : (
						<input
							type="text"
							value={response}
							onChange={(e) => onResponseChange(e.target.value)}
							placeholder={field.placeholder}
							className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
						/>
					)}
				</div>
			</div>

			{showExplanations && field.explanation && (
				<div className="border-t border-gray-200 dark:border-slate-700">
					<button
						onClick={() => setShowExplanation(!showExplanation)}
						className="w-full px-6 py-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
					>
						<span>Understanding</span>
						{showExplanation ? (
							<ChevronUp className="w-4 h-4" />
						) : (
							<ChevronDown className="w-4 h-4" />
						)}
					</button>

					{showExplanation && (
						<div className="px-6 pb-4">
							<div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
								<p className="text-sm text-indigo-900 dark:text-indigo-100">
									{field.explanation}
								</p>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}