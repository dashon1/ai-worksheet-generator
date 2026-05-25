import { useState } from 'react';
import { Sparkles, Bot, GitBranch, Plug, LayoutTemplate, Library, X, Edit2, ArrowRight } from 'lucide-react';
import { Header } from './components/layout/Header';
import { WorksheetTypeCard } from './components/worksheets/WorksheetTypeCard';
import { QuestionCard } from './components/worksheets/QuestionCard';
import { ProgressBar } from './components/worksheets/ProgressBar';
import { ExportPanel } from './components/worksheets/ExportPanel';
import { GeneratedDocument } from './components/worksheets/GeneratedDocument';
import { TypeExplainer } from './components/worksheets/TypeExplainer';
import { useWorksheet } from './hooks/useWorksheet';
import { useTheme } from './hooks/useTheme';
import { WorksheetType, Worksheet, ExportFormat, PrebuiltTemplate, WorksheetTemplate } from './types';
import { worksheetTemplates, prebuiltTemplates, getPrebuiltTemplatesByType } from './data/templates';
import { exportWorksheet } from './utils/export';

type ViewMode = 'home' | 'templates' | 'editor' | 'complete' | 'name-input' | 'explainer';

function App() {
	const {
		theme
	} = useTheme();
	const {
		worksheets,
		createWorksheet,
		updateWorksheet,
		updateResponse,
		deleteWorksheet,
		getWorksheet,
	} = useWorksheet();

	const [selectedType, setSelectedType] = useState<WorksheetType | null>(null);
	const [currentWorksheet, setCurrentWorksheet] = useState<Worksheet | null>(null);
	const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
	const [showHints, setShowHints] = useState(true);
	const [showExplanations, setShowExplanations] = useState(true);
	const [isExporting, setIsExporting] = useState(false);
	const [view, setView] = useState<ViewMode>('home');
	const [selectedTemplate, setSelectedTemplate] = useState<PrebuiltTemplate | null>(null);
	const [worksheetName, setWorksheetName] = useState('');
	const [nameError, setNameError] = useState('');
	const [explainerType, setExplainerType] = useState<WorksheetType | null>(null);

	const handleCreateWorksheet = (useTemplate: boolean = false) => {
		if (selectedType) {
			// Show the explainer first
			setExplainerType(selectedType);
			setView('explainer');
		}
	};

	const handleExplainerContinue = () => {
		if (explainerType) {
			// For prebuilt templates, we already have a name
			if (selectedTemplate) {
				const worksheet = createWorksheet(explainerType);
				worksheet.title = selectedTemplate.name;
				setCurrentWorksheet(worksheet);
				setCurrentFieldIndex(0);
				setView('editor');
				setSelectedTemplate(null);
				setSelectedType(null);
				setExplainerType(null);
			} else {
				// For blank worksheets, prompt for a name
				setWorksheetName('');
				setNameError('');
				setView('name-input');
			}
		}
	};

	const handleExplainerBack = () => {
		setExplainerType(null);
		setView('home');
	};

	const handleConfirmName = () => {
		if (!worksheetName.trim()) {
			setNameError('Please enter a name for your worksheet');
			return;
		}

		const typeToUse = selectedType || explainerType;
		if (typeToUse) {
			const worksheet = createWorksheet(typeToUse);
			worksheet.title = worksheetName.trim();
			setCurrentWorksheet(worksheet);
			setCurrentFieldIndex(0);
			setView('editor');
			setSelectedType(null);
			setSelectedTemplate(null);
			setExplainerType(null);
		}
	};

	const handleCreateFromPrebuiltTemplate = (template: PrebuiltTemplate) => {
		// Convert PrebuiltTemplate to a format compatible with createWorksheet
		const worksheetTemplate: WorksheetTemplate = {
			type: template.type,
			title: template.name,
			description: template.description,
			icon: template.icon,
			fields: template.fields,
		};

		// Create worksheet directly using the template's fields
		const worksheet = createWorksheet(template.type, worksheetTemplate);

		setCurrentWorksheet(worksheet);
		setCurrentFieldIndex(0);
		setView('editor');
	};

	const handleExport = async (format: ExportFormat) => {
		if (currentWorksheet) {
			setIsExporting(true);
			try {
				await exportWorksheet(currentWorksheet, format);
			} catch (error) {
				console.error('Export failed:', error);
			}
			setIsExporting(false);
		}
	};

	const handleResponseChange = (fieldId: string, value: string) => {
		if (currentWorksheet) {
			// Update local state immediately for responsive UI
			const updatedWorksheet = {
				...currentWorksheet,
				responses: {
					...currentWorksheet.responses,
					[fieldId]: value,
				},
			};
			setCurrentWorksheet(updatedWorksheet);

			// Also persist to localStorage
			updateResponse(currentWorksheet.id, fieldId, value);
		}
	};

	const completedFields = currentWorksheet
		? currentWorksheet.fields.filter(
				(f) => currentWorksheet.responses[f.id]?.trim()
			).length
		: 0;

	const getIcon = (iconName: string) => {
		switch (iconName) {
			case 'Sparkles':
				return <Sparkles className="w-6 h-6" />;
			case 'Bot':
				return <Bot className="w-6 h-6" />;
			case 'GitBranch':
				return <GitBranch className="w-6 h-6" />;
			case 'Plug':
				return <Plug className="w-6 h-6" />;
			default:
				return <Sparkles className="w-6 h-6" />;
		}
	};

	const getNamePlaceholder = (type: WorksheetType | null): string => {
		switch (type) {
			case 'skill':
				return 'e.g., YouTube Script Writer, Code Review Assistant';
			case 'agent':
				return 'e.g., Customer Support Bot, Research Analyst';
			case 'workflow':
				return 'e.g., Content Creation Pipeline, Code Review Workflow';
			case 'mcp':
				return 'e.g., GitHub Integration, Database Connector';
			default:
				return 'Enter a descriptive name';
		}
	};

	const templateTypes = [
		{ type: 'skill', title: 'Skills', icon: <Sparkles className="w-5 h-5" /> },
		{ type: 'agent', title: 'Agents', icon: <Bot className="w-5 h-5" /> },
		{ type: 'workflow', title: 'Workflows', icon: <GitBranch className="w-5 h-5" /> },
		{ type: 'mcp', title: 'MCPs', icon: <Plug className="w-5 h-5" /> },
	];

	return (
		<div className={`min-h-screen transition-colors duration-300 ${
			theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
		}`}>
			<Header onNavigate={setView} />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Home View */}
				{view === 'home' && (
					<div className="animate-fade-in">
						<div className="text-center mb-12">
							<h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
								Create Your AI Learning Worksheet
							</h2>
							<p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
								Build comprehensive documentation for Skills, Agents, Workflows, and MCPs.
								Our fill-in-the-blank worksheets guide you through every detail with
								helpful explanations.
							</p>
						</div>

						<div className="flex items-center justify-center gap-4 mb-8">
							<button
								onClick={() => setView('home')}
								className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
									view === 'home'
										? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
										: 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
								}`}
							>
								<LayoutTemplate className="w-5 h-5" />
								Start Blank
							</button>
							<button
								onClick={() => setView('templates')}
								className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
									(view as string) === 'templates'
										? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
										: 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
								}`}
							>
								<Library className="w-5 h-5" />
								Template Library
							</button>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
							{worksheetTemplates.map((template) => (
								<WorksheetTypeCard
									key={template.type}
									type={template.type}
									title={template.title}
									description={template.description}
									icon={getIcon(template.icon)}
									isSelected={selectedType === template.type}
									onClick={() => setSelectedType(template.type)}
								/>
							))}
						</div>

						{selectedType && (
							<div className="text-center animate-scale-in">
								<button
									onClick={() => handleCreateWorksheet(false)}
									className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
								>
									Create {worksheetTemplates.find((t) => t.type === selectedType)?.title} Worksheet
								</button>
							</div>
						)}

						{worksheets.length > 0 && (
							<div className="mt-16">
								<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
									Your Worksheets
								</h3>
								<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
									{worksheets.map((ws) => (
										<div
											key={ws.id}
											className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
										>
											<div className="flex items-start justify-between mb-2">
												<div>
													<h4 className="font-semibold text-gray-900 dark:text-white">
														{ws.title}
													</h4>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														{ws.type.charAt(0).toUpperCase() + ws.type.slice(1)}
													</p>
												</div>
												{ws.isComplete && (
													<span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
														Complete
													</span>
												)}
											</div>
											<div className="flex items-center gap-2 mt-4">
												<button
													onClick={() => {
														setCurrentWorksheet(ws);
														setCurrentFieldIndex(0);
														setView('editor');
													}}
													className="flex-1 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
												>
													Continue
												</button>
												<button
													onClick={() => deleteWorksheet(ws.id)}
													className="px-3 py-2 text-gray-400 hover:text-red-500 transition-colors"
												>
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
													</svg>
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Explainer View */}
				{view === 'explainer' && explainerType && (
					<TypeExplainer
						type={explainerType}
						onContinue={handleExplainerContinue}
						onBack={handleExplainerBack}
					/>
				)}

				{/* Name Input View */}
				{view === 'name-input' && (selectedType || explainerType) && (
					<div className="animate-fade-in max-w-xl mx-auto">
						<div className="text-center mb-8">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
								{getIcon(worksheetTemplates.find(t => t.type === (selectedType || explainerType))?.icon || 'Sparkles')}
							</div>
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
								Name Your {worksheetTemplates.find(t => t.type === (selectedType || explainerType))?.title}
							</h2>
							<p className="text-gray-600 dark:text-gray-400">
								Give your {worksheetTemplates.find(t => t.type === (selectedType || explainerType))?.title.toLowerCase()} a descriptive name
							</p>
						</div>

						<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								{worksheetTemplates.find(t => t.type === (selectedType || explainerType))?.title} Name
							</label>
							<input
								type="text"
								value={worksheetName}
								onChange={(e) => {
									setWorksheetName(e.target.value);
									setNameError('');
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleConfirmName();
									}
								}}
								placeholder={getNamePlaceholder(selectedType || explainerType)}
								className={`w-full px-4 py-3 rounded-xl border ${
									nameError
										? 'border-red-500 focus:ring-red-500'
										: 'border-gray-300 dark:border-slate-600 focus:ring-indigo-500'
								} bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
								autoFocus
							/>
							{nameError && (
								<p className="mt-2 text-sm text-red-500">{nameError}</p>
							)}

							<div className="flex items-center gap-3 mt-6">
								<button
									onClick={() => {
										setView('home');
										setSelectedType(null);
										setExplainerType(null);
									}}
									className="flex-1 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={handleConfirmName}
									className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
								>
									Create Worksheet
								</button>
							</div>
						</div>

						<div className="mt-6 text-center">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Tip: Choose a name that describes what this {worksheetTemplates.find(t => t.type === (selectedType || explainerType))?.title.toLowerCase()} does
							</p>
						</div>
					</div>
				)}

				{/* Template Library View */}
				{(view as string) === 'templates' && (
					<div className="animate-fade-in">
						<div className="flex items-center justify-between mb-8">
							<div>
								<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
									Template Library
								</h2>
								<p className="text-gray-600 dark:text-gray-400">
									Pre-built templates to help you get started quickly
								</p>
							</div>
							<button
								onClick={() => setView('home')}
								className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
							>
								<X className="w-4 h-4" />
								Close
							</button>
						</div>

						{templateTypes.map(({ type, title, icon }) => {
							const templates = getPrebuiltTemplatesByType(type);
							return (
								<div key={type} className="mb-10">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
											{icon}
										</div>
										<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
											{title}
										</h3>
										<span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
											{templates.length} templates
										</span>
									</div>

									<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 ml-0 md:ml-13">
										{templates.map((template) => (
											<div
												key={template.id}
												className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group"
												onClick={() => handleCreateFromPrebuiltTemplate(template)}
											>
												<div className="flex items-start justify-between mb-3">
													<span className="text-2xl">{template.icon}</span>
													<span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
														{template.category}
													</span>
												</div>
												<h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
													{template.name}
												</h4>
												<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
													{template.description}
												</p>
												<button className="w-full px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
													Use Template
												</button>
											</div>
										))}
									</div>
								</div>
							);
						})}
					</div>
				)}

				{/* Editor View */}
				{view === 'editor' && currentWorksheet && (
					<div className="animate-fade-in">
						<div className="mb-6">
							<button
								onClick={() => {
									setView('home');
									setCurrentWorksheet(null);
									setSelectedType(null);
								}}
								className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
								Back to Home
							</button>
						</div>

						<div className="grid lg:grid-cols-3 gap-8">
							<div className="lg:col-span-2 space-y-4">
								<div className="flex items-center justify-between mb-6">
									<div>
										<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
											{currentWorksheet.title}
										</h2>
										<p className="text-gray-500 dark:text-gray-400">
											{currentWorksheet.fields.length} questions
										</p>
									</div>
								</div>

								<div className="flex flex-wrap gap-3 mb-6">
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											checked={showHints}
											onChange={(e) => setShowHints(e.target.checked)}
											className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
										/>
										<span className="text-sm text-gray-700 dark:text-gray-300">Show Hints</span>
									</label>
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											checked={showExplanations}
											onChange={(e) => setShowExplanations(e.target.checked)}
											className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
										/>
										<span className="text-sm text-gray-700 dark:text-gray-300">Show Explanations</span>
									</label>
								</div>

								{currentWorksheet.fields.map((field, index) => (
									<div
										key={field.id}
										onClick={() => setCurrentFieldIndex(index)}
										className="cursor-pointer"
									>
										<QuestionCard
											field={field}
											index={index}
											response={currentWorksheet.responses[field.id] || ''}
											showHints={showHints}
											showExplanations={showExplanations}
											onResponseChange={(value) => handleResponseChange(field.id, value)}
											isActive={currentFieldIndex === index}
										/>
									</div>
								))}
							</div>

							<div className="lg:col-span-1 space-y-6">
								<ProgressBar
									current={currentFieldIndex}
									total={currentWorksheet.fields.length}
									completedFields={completedFields}
								/>

								<div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
									<h3 className="font-semibold text-gray-900 dark:text-white mb-3">
										Quick Navigation
									</h3>
									<div className="grid grid-cols-5 gap-2">
										{currentWorksheet.fields.map((field, index) => {
											const isFilled = currentWorksheet.responses[field.id]?.trim();
											return (
												<button
													key={field.id}
													onClick={() => setCurrentFieldIndex(index)}
													className={`
														w-10 h-10 rounded-lg font-medium text-sm transition-colors
														${
															currentFieldIndex === index
																? 'bg-indigo-500 text-white'
																: isFilled
																? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400'
																: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
														}
													`}
												>
													{index + 1}
												</button>
											);
										})}
									</div>
								</div>

								<ExportPanel
									worksheet={currentWorksheet}
									onExport={handleExport}
									isExporting={isExporting}
								/>

								{completedFields === currentWorksheet.fields.length && (
									<button
										onClick={() => setView('complete')}
										className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/25"
									>
										Complete Worksheet
									</button>
								)}

								<div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
									<h3 className="font-semibold mb-2">Tip</h3>
									<p className="text-sm text-indigo-100">
										Your progress is automatically saved as you type. You can close this
										worksheet and come back later!
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Completion View */}
				{view === 'complete' && currentWorksheet && (
					<div className="animate-fade-in">
						<GeneratedDocument
							worksheet={currentWorksheet}
							onExport={handleExport}
							onBack={() => setView('editor')}
						/>
					</div>
				)}
			</main>

			<footer className="border-t border-gray-200 dark:border-slate-700 mt-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<p className="text-center text-sm text-gray-500 dark:text-gray-400">
						AI Worksheet Generator — Build better AI assets with interactive learning
					</p>
				</div>
			</footer>
		</div>
	);
}

export default App;