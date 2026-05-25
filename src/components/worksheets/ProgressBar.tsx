interface ProgressBarProps {
	current: number;
	total: number;
	completedFields: number;
}

export function ProgressBar({ current, total, completedFields }: ProgressBarProps) {
	const progress = total > 0 ? (completedFields / total) * 100 : 0;

	return (
		<div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
					Your Progress
				</span>
				<span className="text-sm text-gray-500 dark:text-gray-400">
					{completedFields} of {total} completed
				</span>
			</div>

			<div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
				<div
					className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
					style={{ width: `${progress}%` }}
				/>
			</div>

			<div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
				<span>Question {current + 1} of {total}</span>
				<span>{Math.round(progress)}%</span>
			</div>
		</div>
	);
}