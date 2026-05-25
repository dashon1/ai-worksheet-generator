import { Worksheet, ExportFormat } from '../../types';
import { Download, FileText, Code, FileJson, Printer } from 'lucide-react';

interface ExportPanelProps {
	worksheet: Worksheet;
	onExport: (format: ExportFormat) => void;
	isExporting: boolean;
}

const exportOptions: { format: ExportFormat; label: string; icon: React.ReactNode }[] = [
	{
		format: 'pdf',
		label: 'PDF Document',
		icon: <FileText className="w-5 h-5" />,
	},
	{
		format: 'html',
		label: 'HTML Worksheet',
		icon: <Code className="w-5 h-5" />,
	},
	{
		format: 'markdown',
		label: 'Markdown',
		icon: <FileText className="w-5 h-5" />,
	},
	{
		format: 'json',
		label: 'JSON Data',
		icon: <FileJson className="w-5 h-5" />,
	},
];

export function ExportPanel({ worksheet, onExport, isExporting }: ExportPanelProps) {
	return (
		<div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
			<div className="flex items-center gap-2 mb-4">
				<Download className="w-5 h-5 text-indigo-500" />
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					Export Your Worksheet
				</h3>
			</div>

			<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
				Download your completed worksheet in your preferred format. Each format is optimized
				for different use cases.
			</p>

			<div className="grid grid-cols-2 gap-3">
				{exportOptions.map(({ format, label, icon }) => (
					<button
						key={format}
						onClick={() => onExport(format)}
						disabled={isExporting}
						className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<div className="text-gray-600 dark:text-gray-400">{icon}</div>
						<div className="text-left">
							<div className="text-sm font-medium text-gray-900 dark:text-white">
								{label}
							</div>
							<div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
								.{format}
							</div>
						</div>
					</button>
				))}
			</div>

			<div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
				<button
					onClick={() => window.print()}
					className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
				>
					<Printer className="w-5 h-5" />
					<span className="font-medium">Print Worksheet</span>
				</button>
			</div>
		</div>
	);
}