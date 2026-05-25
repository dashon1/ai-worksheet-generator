import { WorksheetType } from '../../types';

interface WorksheetTypeCardProps {
	type: WorksheetType;
	title: string;
	description: string;
	icon: React.ReactNode;
	isSelected: boolean;
	onClick: () => void;
}

export function WorksheetTypeCard({
	type,
	title,
	description,
	icon,
	isSelected,
	onClick,
}: WorksheetTypeCardProps) {
	return (
		<button
			onClick={onClick}
			className={`
				relative w-full p-6 rounded-xl border-2 text-left transition-all duration-200
				${
					isSelected
						? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500/20'
						: 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10'
				}
			`}
		>
			{isSelected && (
				<div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
					<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				</div>
			)}

			<div
				className={`
				w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors
				${
					isSelected
						? 'bg-indigo-500 text-white'
						: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
				}
			`}
			>
				{icon}
			</div>

			<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>

			<div className="mt-4 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
				<span>Click to select</span>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</div>
		</button>
	);
}