import { Worksheet, ExportFormat } from '../../types';
import { Sparkles, Bot, GitBranch, Plug, Download, Edit3, CheckCircle, FileCode, Zap, FileBadge, Package } from 'lucide-react';

interface GeneratedDocumentProps {
	worksheet: Worksheet;
	onExport: (format: ExportFormat) => void;
	onBack: () => void;
}

const typeIcons = {
	skill: Sparkles,
	agent: Bot,
	workflow: GitBranch,
	mcp: Plug,
};

const typeLabels = {
	skill: 'Skill Definition',
	agent: 'Agent Configuration',
	workflow: 'Workflow Blueprint',
	mcp: 'MCP Integration',
};

const productTypeLabels = {
	skill: 'Skill Registry',
	agent: 'Agent Identity',
	workflow: 'Workflow Registry',
	mcp: 'MCP Server Registry',
};

const productTypeDescriptions = {
	skill: 'Production-ready skill specification with input/output schemas',
	agent: 'Complete agent identity document with system prompt and tools',
	workflow: 'Deployable workflow blueprint with triggers and error handling',
	mcp: 'MCP server configuration with tools and security policies',
};

export function GeneratedDocument({ worksheet, onExport, onBack }: GeneratedDocumentProps) {
	const Icon = typeIcons[worksheet.type];
	const typeLabel = typeLabels[worksheet.type];

	const getFieldValue = (fieldId: string): string => {
		return worksheet.responses[fieldId] || '';
	};

	return (
		<div className="animate-fade-in space-y-6">
			{/* Success Header */}
			<div className="text-center mb-8">
				<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mb-4 shadow-lg shadow-emerald-500/30">
					<CheckCircle className="w-10 h-10 text-white" />
				</div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					Worksheet Complete!
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Your {worksheet.title} is ready for production
				</p>
			</div>

			{/* Document Card - Summary of what was filled */}
			<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
				{/* Document Header */}
				<div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
								<Icon className="w-5 h-5 text-white" />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-white">{worksheet.title}</h2>
								<p className="text-sm text-white/80">{typeLabel}</p>
							</div>
						</div>
						<span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
							Complete
						</span>
					</div>
				</div>

				{/* Document Content */}
				<div className="p-6 space-y-4">
					<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
						Your Responses
					</h3>
					{worksheet.fields.map((field, index) => {
						const value = getFieldValue(field.id);
						if (!value) return null;

						return (
							<div key={field.id} className="border-b border-gray-100 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
								<div className="flex items-start gap-3">
									<span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center text-sm font-medium">
										{index + 1}
									</span>
									<div className="flex-1 min-w-0">
										<h4 className="font-medium text-gray-900 dark:text-white mb-1 text-sm">
											{field.question}
										</h4>
										<div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap bg-gray-50 dark:bg-slate-900 rounded-lg p-3 font-mono text-xs">
											{value.length > 200 ? value.substring(0, 200) + '...' : value}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* PRODUCTION READY SECTION - The main attraction */}
			<div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-1 shadow-xl">
				<div className="bg-white dark:bg-slate-900 rounded-xl p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
							<Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white">
								Download Production-Ready Asset
							</h2>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Your completed {typeLabel.toLowerCase()} transformed into a deployable specification
							</p>
						</div>
					</div>

					{/* Main Production Download Button */}
					<button
						onClick={() => onExport('product')}
						className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/30 text-lg"
					>
						<Zap className="w-6 h-6" />
						<div className="text-left">
							<div>Download {productTypeLabels[worksheet.type]}</div>
							<div className="text-xs font-normal opacity-90">{productTypeDescriptions[worksheet.type]}</div>
						</div>
					</button>

					{/* Edit button */}
					<button
						onClick={onBack}
						className="w-full mt-3 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
					>
						<Edit3 className="w-5 h-5" />
						Edit Worksheet
					</button>
				</div>
			</div>

			{/* Secondary Export Options - Worksheet Formats */}
			<div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
				<div className="flex items-center gap-3 mb-4">
					<FileBadge className="w-5 h-5 text-gray-500 dark:text-gray-400" />
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Or Download as Worksheet Format
					</h3>
				</div>
				<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
					Keep the questionnaire format for reference or printing
				</p>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					<button
						onClick={() => onExport('pdf')}
						className="flex flex-col items-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
					>
						<Download className="w-5 h-5 text-red-500" />
						<span className="text-sm font-medium">PDF</span>
					</button>
					<button
						onClick={() => onExport('html')}
						className="flex flex-col items-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
					>
						<Download className="w-5 h-5 text-orange-500" />
						<span className="text-sm font-medium">HTML</span>
					</button>
					<button
						onClick={() => onExport('markdown')}
						className="flex flex-col items-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
					>
						<FileCode className="w-5 h-5 text-blue-500" />
						<span className="text-sm font-medium">Markdown</span>
					</button>
					<button
						onClick={() => onExport('json')}
						className="flex flex-col items-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
					>
						<FileCode className="w-5 h-5 text-green-500" />
						<span className="text-sm font-medium">JSON</span>
					</button>
				</div>
			</div>

		</div>
	);
}