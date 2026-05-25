import { WorksheetType } from '../../types';
import { Sparkles, Bot, GitBranch, Plug, ArrowRight } from 'lucide-react';

interface TypeExplainerProps {
	type: WorksheetType;
	onContinue: () => void;
	onBack: () => void;
}

interface SkillExample {
	exampleTitle: string;
	category: string;
	skillName: string;
	primaryFunction: string;
	inputs: string;
	outputs: string;
	bestPractices: string;
	useCases: string;
}

interface AgentExample {
	exampleTitle: string;
	agentName: string;
	role: string;
	responsibilities: string;
	tools: string;
	decisionMaking: string;
	interactions: string;
	successMetrics: string;
}

interface WorkflowExample {
	exampleTitle: string;
	workflowName: string;
	trigger: string;
	steps: string;
	decisions: string;
	errorHandling: string;
	outcomes: string;
}

interface MCPExample {
	exampleTitle: string;
	mcpName: string;
	purpose: string;
	connection: string;
	formats: string;
	auth: string;
	usagePatterns: string;
}

const typeConfig: Record<WorksheetType, {
	title: string;
	icon: typeof Sparkles;
	color: string;
	description: string;
	example: SkillExample | AgentExample | WorkflowExample | MCPExample;
	sections: { name: string; desc: string }[];
}> = {
	skill: {
		title: 'What is a Skill?',
		icon: Sparkles,
		color: 'indigo',
		description: 'A skill is a discrete AI capability that performs a specific task.',
		example: {
			exampleTitle: 'Example: YouTube Health Script Writer',
			category: 'Generation',
			skillName: 'YouTube Health Script Writer',
			primaryFunction: 'This skill automates the creation of engaging, YouTube-optimized health and wellness videos. It processes user-defined topics, scripts, or outlines to generate a complete cinematic video tailored for digital platforms, incorporating native pacing, structured health content, and clear visual storytelling.',
			inputs: '• Core Topic or Concept: (e.g., "Natural healing practices," "morning mobility routines")\n• Target Video Length & Format: (e.g., 60-second Short vs. 10-minute long-form video)\n• Tone & Audience Persona: (e.g., educational, encouraging, fast-paced, senior-focused)\n• Optional: Specific text script, raw research notes, or bullet points to include\n• Optional: Preferred branding details or required medical disclaimers',
			outputs: '• Final Video Asset: Full high-definition, cinematic production-level video file\n• Voiceover / Audio: Synthesized or generated vocal narration track\n• Video Script: Fully structured, timestamped script or transcript of the voiceover\n• Metadata Pack: Optimized YouTube title ideas, a video description draft, and recommended tags/hashtags for SEO\n• Visual Elements: Automated captions/subtitles overlays and transition elements',
			bestPractices: '• Provide a highly specific topic, target audience, and preferred tone (e.g., "5-minute morning stretching routine for seniors, warm and encouraging tone").\n• Include a target video length and preferred pacing (e.g., fast-paced shorts style vs. deep-dive documentary style).\n• Always include a standard medical disclaimer in the prompt input to ensure compliance with medical content guidelines.\n• Avoid overly broad or vague topics like "how to be healthy"—instead, break requests down into specific, actionable health tips or routines.',
			useCases: '• Faceless YouTube Channel Automation: Rapidly creating high-quality, engaging content for health, wellness, and holistic lifestyle niches without needing an on-camera presenter.\n• Repurposing Health Content: Converting existing medical blogs, research notes, or text-based articles into high-retention video assets.\n• Social Media Short-Form Production: Generating quick, educational health tips, daily wellness reminders, or mobility routines tailored for YouTube Shorts.\n• Content Scaling for Health Brands: Enabling wellness coaches, practitioners, or supplement brands to maintain a consistent YouTube upload schedule with professional-grade visuals.',
		} as SkillExample,
		sections: [
			{ name: 'Skill Name', desc: 'A clear, descriptive title for your skill' },
			{ name: 'Category', desc: 'Analysis, Generation, Automation, or Integration' },
			{ name: 'Primary Function', desc: 'What this skill does at its core' },
			{ name: 'Inputs Required', desc: 'What data/parameters the skill needs' },
			{ name: 'Outputs Produced', desc: 'What results the skill delivers' },
			{ name: 'Best Practices', desc: 'Tips for effective use' },
			{ name: 'Common Use Cases', desc: 'Typical scenarios for this skill' },
		],
	},
	agent: {
		title: 'What is an Agent?',
		icon: Bot,
		color: 'emerald',
		description: 'An agent is a production-ready AI entity with full specification for deployment.',
		example: {
			exampleTitle: 'Example: Wellness Video Agent',
			agentName: 'Wellness Video Agent',
			role: 'You are the "Wellness Video Agent," operating as a Senior YouTube Content Director & Health Niche Strategist. Your primary directive is to orchestrate the end-to-end production of highly engaging, platform-compliant video assets for the natural healing and wellness niche.',
			responsibilities: '1. PLATFORM COMPLIANCE: Strictly adhere to YouTube and AI safety guidelines regarding YMYL content. Never generate text promoting unverified medical cures without proper disclaimers.\n2. HOOK RETENTION: Structure all content to capture user attention within the first 3 seconds using proven digital marketing hooks.\n3. SKILL ORCHESTRATION: Format and clean user inputs into structured payloads before invoking downstream generation skills.',
			tools: '- youtube_health_script_writer_skill: Generates the primary script, audio pacing markers, and visual asset prompts\n- web_trend_analysis_tool: Searches for high-performing keywords, search volumes, and trending topics in holistic health\n- seo_metadata_optimizer_api: Generates titles with high CTR potential and SEO-rich descriptions\n- compliance_safety_filter: Pre-screens topics against health policy blacklists',
			decisionMaking: '1. Format user input into structured payload\n2. Validate against safety filter\n3. Select appropriate skill for content type (long-form vs shorts)\n4. Generate content with quality scoring\n5. Apply compliance and formatting checks\n6. Return structured response with confidence scores',
			interactions: '- Always confirm understanding of video goal before generating\n- Ask clarifying questions about target audience and preferred tone\n- Provide multiple title options and pacing alternatives\n- End with refinement prompts ("Would you like me to adjust the hook?")',
			successMetrics: '- Output completeness: All required sections present\n- Content safety: Passes compliance filter 100%\n- Hook strength: Self-assessed 4+/5\n- SEO optimization: Titles under 60 chars, descriptions optimized\n- User satisfaction: 4.5/5 average',
		} as AgentExample,
		sections: [
			{ name: 'Agent Name', desc: 'Official production name for identification' },
			{ name: 'Primary Role & Persona', desc: 'Core identity, expertise level, and tone' },
			{ name: 'Core Mandates', desc: 'Non-negotiable rules and constraints' },
			{ name: 'Available Tools & Skills', desc: 'All capabilities the agent can invoke' },
			{ name: 'Skill Orchestration Rules', desc: 'How to chain and format skill calls' },
			{ name: 'Runtime Examples', desc: 'Sample inputs with expected outputs' },
			{ name: 'Success Metrics', desc: 'Quality gates and performance criteria' },
		],
	},
	workflow: {
		title: 'What is a Workflow?',
		icon: GitBranch,
		color: 'purple',
		description: 'A workflow is a multi-step automated process with triggers, steps, and decision points.',
		example: {
			exampleTitle: 'Example: Code Review Pipeline',
			workflowName: 'Automated Code Review',
			trigger: 'Triggered when:\n• A pull request is opened\n• New commits are pushed to an open PR\n• A PR is marked as "ready for review"',
			steps: '1. Fetch PR details (author, files changed, description)\n2. Run ESLint and Prettier checks on changed files\n3. Execute unit tests for affected modules\n4. Calculate code coverage percentage\n5. Run security scan for vulnerabilities\n6. Generate review summary report\n7. Post automated comments on PR',
			decisions: '• If linting fails → Add "Fix Required" label and comment with specific errors\n• If any test fails → Add "Tests Failing" label, block merge\n• If coverage below 80% → Add "Coverage Review" label requiring manual approval\n• If security issues found → Add "Security Review" label and notify security team',
			errorHandling: '• If API rate limit reached → Wait 60 seconds and retry (max 3 attempts)\n• If external service unavailable → Skip that step, mark workflow as "Partial" and notify admin\n• If timeout after 10 minutes → Fail gracefully, notify team, log error details for review',
			outcomes: '• Automated PR comment with: Summary of changes, Linting results, Test results with pass/fail counts, Coverage percentage, Security scan results, Suggested improvements\n• Labels applied to PR based on results\n• Optional Slack notification to team channel with summary',
		} as WorkflowExample,
		sections: [
			{ name: 'Workflow Name', desc: 'Descriptive name indicating purpose' },
			{ name: 'Trigger Conditions', desc: 'What events start this workflow' },
			{ name: 'Sequential Steps', desc: 'Ordered list of actions' },
			{ name: 'Decision Points', desc: 'Branching logic and conditions' },
			{ name: 'Error Handling', desc: 'How failures are managed' },
			{ name: 'Expected Outcomes', desc: 'What results are produced' },
			{ name: 'Dependencies', desc: 'External services and APIs required' },
		],
	},
	mcp: {
		title: 'What is an MCP?',
		icon: Plug,
		color: 'amber',
		description: 'MCP (Model Context Protocol) is a connection to external data sources or tools.',
		example: {
			exampleTitle: 'Example: GitHub Integration',
			mcpName: 'GitHub Repository Connector',
			purpose: 'Enables reading and writing to GitHub repositories including code files, pull requests, issues, and repository settings. Provides context about codebase structure and recent changes.',
			connection: '• HTTPS REST API to api.github.com using official GitHub REST API v3\n• Webhook support for real-time event notifications\n• Supports both authenticated and unauthenticated requests',
			formats: '• Request: JSON body with owner, repo, and path parameters\n• Response: JSON with file contents as base64-encoded strings\n• Pagination via Link headers with "next", "prev", "first", "last" relations',
			auth: '• Personal Access Token (PAT) with "repo" scope for full access\n• "public_repo" scope for public repository access only\n• Stored as encrypted environment variable\n• Rotate tokens every 90 days',
			usagePatterns: '• Call "getFile" to read code context for AI analysis\n• Use "searchCode" for finding specific implementations\n• Use "createPR" to submit changes from AI suggestions\n• Always check rate limit header before making requests\n• Cache repository metadata for 5 minutes to reduce API calls',
		} as MCPExample,
		sections: [
			{ name: 'MCP Name', desc: 'Clear name for the integration' },
			{ name: 'Purpose', desc: 'What context or capabilities it provides' },
			{ name: 'Connection Method', desc: 'API, SDK, or protocol used' },
			{ name: 'Data Formats', desc: 'Input/output structures and schemas' },
			{ name: 'Authentication', desc: 'Required credentials and security' },
			{ name: 'Usage Patterns', desc: 'Best practices for effective use' },
			{ name: 'Rate Limits', desc: 'Usage quotas and throttling' },
		],
	},
};

const colorClasses = {
	indigo: {
		bg: 'bg-indigo-100 dark:bg-indigo-900/30',
		text: 'text-indigo-600 dark:text-indigo-400',
		border: 'border-indigo-500',
		header: 'bg-indigo-600',
	},
	emerald: {
		bg: 'bg-emerald-100 dark:bg-emerald-900/30',
		text: 'text-emerald-600 dark:text-emerald-400',
		border: 'border-emerald-500',
		header: 'bg-emerald-600',
	},
	purple: {
		bg: 'bg-purple-100 dark:bg-purple-900/30',
		text: 'text-purple-600 dark:text-purple-400',
		border: 'border-purple-500',
		header: 'bg-purple-600',
	},
	amber: {
		bg: 'bg-amber-100 dark:bg-amber-900/30',
		text: 'text-amber-600 dark:text-amber-400',
		border: 'border-amber-500',
		header: 'bg-amber-600',
	},
};

export function TypeExplainer({ type, onContinue, onBack }: TypeExplainerProps) {
	const config = typeConfig[type];
	const Icon = config.icon;
	const colors = colorClasses[config.color as keyof typeof colorClasses];

	// Cast examples to specific types for rendering
	const skillExample = config.example as SkillExample;
	const agentExample = config.example as AgentExample;
	const workflowExample = config.example as WorkflowExample;
	const mcpExample = config.example as MCPExample;

	const renderSection = (title: string, content: string, fullWidth = false) => (
		<div className={`p-4 ${fullWidth ? '' : ''}`}>
			<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
				<span className={`w-2 h-2 rounded-full ${colors.bg.replace('100', '500').replace('/30', '')}`}></span>
				{title}
			</h4>
			<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed pl-4 border-l-2 border-gray-200 dark:border-gray-700">
				{content}
			</p>
		</div>
	);

	return (
		<div className="animate-fade-in max-w-4xl mx-auto">
			{/* Header */}
			<div className="text-center mb-8">
				<div className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} rounded-full mb-4`}>
					<Icon className={`w-8 h-8 ${colors.text}`} />
				</div>
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
					{config.title}
				</h2>
				<p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
					{config.description}
				</p>
			</div>

			{/* Example Document Card */}
			<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-6">
				{/* Document Header */}
				<div className={`px-6 py-4 ${colors.header}`}>
					<h3 className="text-lg font-bold text-white">
						{type === 'skill' && (config.example as SkillExample).exampleTitle}
						{type === 'agent' && (config.example as AgentExample).exampleTitle}
						{type === 'workflow' && (config.example as WorkflowExample).exampleTitle}
						{type === 'mcp' && (config.example as MCPExample).exampleTitle}
					</h3>
				</div>

				<div className="p-6">
					{type === 'skill' && (
						<div className="space-y-1">
							{/* Skill Header */}
							<div className="mb-6">
								<h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
									#{skillExample.skillName}
								</h4>
								<div className="flex items-center gap-2">
									<span className={`px-3 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded-full`}>
										Category: {skillExample.category}
									</span>
								</div>
							</div>

							{/* Primary Function */}
							<div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4">
								<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">## Primary Function</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
									{skillExample.primaryFunction}
								</p>
							</div>

							{/* Inputs & Outputs */}
							<div className="grid md:grid-cols-2 gap-4 mb-4">
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-indigo-500"></span>
										## Inputs Required
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{skillExample.inputs}
									</p>
								</div>
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
										## Outputs Produced
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{skillExample.outputs}
									</p>
								</div>
							</div>

							{/* Best Practices & Use Cases */}
							<div className="grid md:grid-cols-2 gap-4">
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-amber-500"></span>
										## Best Practices
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{skillExample.bestPractices}
									</p>
								</div>
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-purple-500"></span>
										## Common Use Cases
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{skillExample.useCases}
									</p>
								</div>
							</div>
						</div>
					)}

					{type === 'agent' && (
						<div className="space-y-1">
							{/* Agent Header */}
							<div className="mb-6">
								<h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
									{agentExample.agentName}
								</h4>
							</div>

							{/* Role */}
							<div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4">
								<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">## Role & Personality</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
									{agentExample.role}
								</p>
							</div>

							{/* Responsibilities & Tools */}
							<div className="grid md:grid-cols-2 gap-4 mb-4">
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">## Core Responsibilities</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{agentExample.responsibilities}
									</p>
								</div>
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">## Available Tools</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{agentExample.tools}
									</p>
								</div>
							</div>

							{/* Decision Making & Interactions */}
							<div className="grid md:grid-cols-2 gap-4 mb-4">
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">## Decision-Making</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{agentExample.decisionMaking}
									</p>
								</div>
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">## Interaction Patterns</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{agentExample.interactions}
									</p>
								</div>
							</div>

							{/* Success Metrics */}
							<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
								<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">## Success Metrics</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
									{agentExample.successMetrics}
								</p>
							</div>
						</div>
					)}

					{type === 'workflow' && (
						<div className="space-y-1">
							{/* Workflow Header */}
							<div className="mb-6">
								<h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
									{workflowExample.workflowName}
								</h4>
							</div>

							{/* Trigger */}
							<div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4">
								<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">## Trigger Conditions</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
									{workflowExample.trigger}
								</p>
							</div>

							{/* Steps */}
							<div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4">
								<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">## Sequential Steps</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
									{workflowExample.steps}
								</p>
							</div>

							{/* Decisions & Error Handling */}
							<div className="grid md:grid-cols-2 gap-4 mb-4">
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">## Decision Points</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{workflowExample.decisions}
									</p>
								</div>
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">## Error Handling</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{workflowExample.errorHandling}
									</p>
								</div>
							</div>

							{/* Outcomes */}
							<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
								<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">## Expected Outcomes</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
									{workflowExample.outcomes}
								</p>
							</div>
						</div>
					)}

					{type === 'mcp' && (
						<div className="space-y-1">
							{/* MCP Header */}
							<div className="mb-6">
								<h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
									{mcpExample.mcpName}
								</h4>
							</div>

							{/* Purpose */}
							<div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4">
								<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">## Purpose</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
									{mcpExample.purpose}
								</p>
							</div>

							{/* Connection & Formats */}
							<div className="grid md:grid-cols-2 gap-4 mb-4">
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">## Connection Method</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{mcpExample.connection}
									</p>
								</div>
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">## Data Formats</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{mcpExample.formats}
									</p>
								</div>
							</div>

							{/* Auth & Usage Patterns */}
							<div className="grid md:grid-cols-2 gap-4">
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">## Authentication</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{mcpExample.auth}
									</p>
								</div>
								<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">## Usage Patterns</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
										{mcpExample.usagePatterns}
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Sections Preview */}
			<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
					You'll fill out these sections:
				</h3>
				<div className="grid md:grid-cols-2 gap-3">
					{config.sections.map((section, index) => (
						<div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
							<span className={`w-6 h-6 ${colors.bg} ${colors.text} rounded-full flex items-center justify-center text-xs font-medium`}>
								{index + 1}
							</span>
							<div>
								<span className="text-sm font-medium text-gray-900 dark:text-white">
									{section.name}
								</span>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{section.desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Actions */}
			<div className="flex items-center gap-3">
				<button
					onClick={onBack}
					className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
				>
					Back
				</button>
				<button
					onClick={onContinue}
					className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 ${colors.header} text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg`}
				>
					Start Building
					<ArrowRight className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
}