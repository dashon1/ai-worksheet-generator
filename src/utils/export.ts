import { Worksheet, ExportFormat } from '../types';

// Helper function to get field value by partial question match
function getFieldValue(worksheet: Worksheet, partialQuestion: string): string {
	const field = worksheet.fields.find(f =>
		f.question.toLowerCase().includes(partialQuestion.toLowerCase())
	);
	return field ? (worksheet.responses[field.id] || '') : '';
}

// Helper to generate a slug ID from title
function slugify(text: string): string {
	if (!text) return 'unnamed';
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/_+/g, '_')
		.replace(/^_|_$/g, '');
}

// Parse user input/output definitions into JSON Schema properties
// Handles formats like:
// - "topic: description"
// - "video_length: the length of the video in seconds"
// - "- name: The primary topic"
function parseUserFieldsToSchema(userText: string): Record<string, { type: string; description: string }> {
	const properties: Record<string, { type: string; description: string }> = {};
	if (!userText || !userText.trim()) return properties;

	const lines = userText.split('\n').filter(l => l.trim());
	for (const line of lines) {
		// Remove list markers
		let cleanLine = line.replace(/^[-•*]\s*/, '').trim();

		// Try to parse "field_name: description" or "field_name - description"
		const colonMatch = cleanLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*[:\-–]\s*(.+)/);
		if (colonMatch) {
			const fieldName = colonMatch[1].trim().toLowerCase().replace(/\s+/g, '_');
			const description = colonMatch[2].trim().replace(/"/g, "'");
			properties[fieldName] = {
				type: 'string',
				description: description
			};
		} else if (cleanLine.length > 0) {
			// If no colon format, use the whole line as description with generated name
			const wordMatch = cleanLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
			if (wordMatch) {
				const fieldName = wordMatch[1].toLowerCase();
				properties[fieldName] = {
					type: 'string',
					description: cleanLine
				};
			}
		}
	}
	return properties;
}

// Parse user tools list into proper capability mapping
function parseUserToolsToCapabilities(toolsText: string): Array<{ name: string; version: string; description: string; purpose: string }> {
	const capabilities = [];
	if (!toolsText || !toolsText.trim()) {
		return [{ name: 'general_tool', version: '1.0', description: 'General capability', purpose: 'Standard operation' }];
	}

	const lines = toolsText.split('\n').filter(l => l.trim());
	for (const line of lines) {
		let cleanLine = line.replace(/^[-•*]\s*/, '').trim();

		// Parse tool with optional description: "tool_name - description" or "tool_name: description"
		const parts = cleanLine.split(/[:\-–]/);
		const toolName = parts[0].trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
		const description = parts.length > 1 ? parts.slice(1).join('-').trim() : cleanLine;

		capabilities.push({
			name: toolName,
			version: '1.0',
			description: description.substring(0, 150),
			purpose: description.substring(0, 120)
		});
	}
	return capabilities;
}

// Parse workflow steps into structured format
function parseUserStepsToPipeline(stepsText: string): Array<{ stepNumber: string; name: string; execute: string; output: string }> {
	const steps = [];
	if (!stepsText || !stepsText.trim()) {
		return [{ stepNumber: '01', name: 'Initialize', execute: 'Start workflow execution', output: 'workflow_ready' }];
	}

	const lines = stepsText.split('\n').filter(l => l.trim());
	for (let i = 0; i < lines.length; i++) {
		let cleanLine = lines[i].replace(/^[-•*]\s*/, '').trim();

		// Try to parse "Step NAME: description" format
		const stepMatch = cleanLine.match(/^(step\s*)?(\d+)?\s*[:\.\)]?\s*(.+)/i);
		const stepName = stepMatch ? stepMatch[3].trim() : cleanLine;
		const stepNum = String(i + 1).padStart(2, '0');

		// Extract action verbs and create execute statement
		const executeStatement = stepName.length > 80 ? stepName.substring(0, 77) + '...' : stepName;

		steps.push({
			stepNumber: stepNum,
			name: `STEP_${stepNum}`,
			execute: executeStatement,
			output: `step_${stepNum}_output`
		});
	}
	return steps;
}

// Parse triggers into structured format
function parseUserTriggersToDefinitions(triggersText: string): Array<{ triggerType: string; source: string; payloadMapping: string }> {
	const triggers = [];
	if (!triggersText || !triggersText.trim()) {
		return [{ triggerType: 'MANUAL', source: 'user_interface', payloadMapping: 'user_input -> workflow_payload' }];
	}

	const lines = triggersText.split('\n').filter(l => l.trim());
	for (const line of lines) {
		let cleanLine = line.replace(/^[-•*]\s*/, '').trim();

		// Parse trigger type and source
		if (cleanLine.includes(':')) {
			const [type, source] = cleanLine.split(':').map(s => s.trim());
			triggers.push({
				triggerType: type.toUpperCase().replace(/\s+/g, '_'),
				source: source,
				payloadMapping: `${source.toLowerCase().replace(/\s+/g, '_')} -> workflow_input`
			});
		} else {
			triggers.push({
				triggerType: cleanLine.toUpperCase().replace(/\s+/g, '_').substring(0, 30),
				source: cleanLine,
				payloadMapping: 'input -> workflow_payload'
			});
		}
	}
	return triggers;
}

// Parse error handling into structured format
function parseUserErrorsToExceptions(errorsText: string): Array<{ exception: string; strategy: string; maxAttempts: number; fallback: string }> {
	const exceptions = [];
	if (!errorsText || !errorsText.trim()) {
		return [];
	}

	const lines = errorsText.split('\n').filter(l => l.trim());
	for (const line of lines) {
		let cleanLine = line.replace(/^[-•*]\s*/, '').trim();

		// Extract error condition and suggested handling
		if (cleanLine.length > 0) {
			exceptions.push({
				exception: cleanLine.substring(0, 60),
				strategy: 'Retry with exponential backoff',
				maxAttempts: 3,
				fallback: `Log error; alert operator; halt workflow if unrecoverable`
			});
		}
	}
	return exceptions;
}

export function generateMarkdown(worksheet: Worksheet): string {
	const typeLabels: Record<string, string> = {
		skill: 'Skill',
		agent: 'Agent',
		workflow: 'Workflow',
		mcp: 'MCP',
	};

	let markdown = `# ${worksheet.title}\n\n`;
	markdown += `**Type:** ${typeLabels[worksheet.type] || worksheet.type}\n\n`;
	markdown += `**Created:** ${new Date(worksheet.createdAt).toLocaleDateString()}\n\n`;
	markdown += `**Status:** ${worksheet.isComplete ? '✅ Complete' : '📝 In Progress'}\n\n`;
	markdown += `---\n\n`;

	worksheet.fields.forEach((field, index) => {
		const response = worksheet.responses[field.id] || '';
		markdown += `## ${index + 1}. ${field.question}\n\n`;

		if (field.required) {
			markdown += `> **Required**\n\n`;
		}

		if (response) {
			markdown += `${response}\n\n`;
		} else {
			markdown += `_\n\n`;
		}

		if (field.explanation) {
			markdown += `> **Understanding:** ${field.explanation}\n\n`;
		}

		markdown += `---\n\n`;
	});

	markdown += `---\n\n`;
	markdown += `*Generated by AI Worksheet Generator*\n`;

	return markdown;
}

export function generateHTML(worksheet: Worksheet): string {
	const typeLabels: Record<string, string> = {
		skill: 'Skill',
		agent: 'Agent',
		workflow: 'Workflow',
		mcp: 'MCP',
	};

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${worksheet.title}</title>
	<style>
		* { box-sizing: border-box; margin: 0; padding: 0; }
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			line-height: 1.6;
			max-width: 800px;
			margin: 0 auto;
			padding: 2rem;
			color: #1f2937;
			background: #f9fafb;
		}
		.header {
			text-align: center;
			margin-bottom: 2rem;
			padding-bottom: 1rem;
			border-bottom: 2px solid #e5e7eb;
		}
		.header h1 { font-size: 1.75rem; color: #111827; margin-bottom: 0.5rem; }
		.header .meta { color: #6b7280; font-size: 0.875rem; }
		.field {
			background: white;
			border-radius: 0.75rem;
			padding: 1.5rem;
			margin-bottom: 1.5rem;
			border: 1px solid #e5e7eb;
			box-shadow: 0 1px 3px rgba(0,0,0,0.1);
		}
		.field-header {
			display: flex;
			align-items: flex-start;
			gap: 1rem;
			margin-bottom: 1rem;
		}
		.field-number {
			width: 2rem;
			height: 2rem;
			border-radius: 50%;
			background: #6366f1;
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			flex-shrink: 0;
		}
		.field-question {
			font-size: 1.125rem;
			font-weight: 600;
			color: #111827;
		}
		.required { color: #ef4444; }
		.response-box {
			background: #f3f4f6;
			border-radius: 0.5rem;
			padding: 1rem;
			min-height: 4rem;
			font-family: monospace;
			white-space: pre-wrap;
			border: 1px dashed #d1d5db;
		}
		.response-box.empty { color: #9ca3af; font-style: italic; }
		.explanation {
			margin-top: 1rem;
			padding: 1rem;
			background: #eef2ff;
			border-radius: 0.5rem;
			font-size: 0.875rem;
			color: #4338ca;
		}
		.footer {
			text-align: center;
			margin-top: 2rem;
			padding-top: 1rem;
			border-top: 1px solid #e5e7eb;
			color: #6b7280;
			font-size: 0.875rem;
		}
		@media print {
			body { background: white; }
			.field { box-shadow: none; border: 1px solid #d1d5db; }
		}
	</style>
</head>
<body>
	<div class="header">
		<h1>${worksheet.title}</h1>
		<div class="meta">
			<span>Type: ${typeLabels[worksheet.type]}</span> |
			<span>Status: ${worksheet.isComplete ? 'Complete' : 'In Progress'}</span> |
			<span>Created: ${new Date(worksheet.createdAt).toLocaleDateString()}</span>
		</div>
	</div>

	${worksheet.fields
		.map((field, index) => {
			const response = worksheet.responses[field.id] || '';
			return `
		<div class="field">
			<div class="field-header">
				<div class="field-number">${index + 1}</div>
				<div class="field-question">
					${field.question}${field.required ? ' <span class="required">*</span>' : ''}
				</div>
			</div>
			<div class="response-box ${!response ? 'empty' : ''}">${
				response || 'Your response goes here...'
			}</div>
			${
				field.explanation
					? `<div class="explanation"><strong>Understanding:</strong> ${field.explanation}</div>`
					: ''
			}
		</div>
	`;
		})
		.join('')}

	<div class="footer">
		<p>Generated by AI Worksheet Generator</p>
	</div>
</body>
</html>`;
}

export function generateJSON(worksheet: Worksheet): string {
	return JSON.stringify(
		{
			...worksheet,
			fields: worksheet.fields.map(({ id, question, type }) => ({
				id,
				question,
				type,
				response: worksheet.responses[id] || '',
			})),
		},
		null,
		2
	);
}

export async function generatePDF(worksheet: Worksheet): Promise<Blob> {
	// Dynamically import jspdf
	const { jsPDF } = await import('jspdf');

	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();
	const margin = 20;
	const contentWidth = pageWidth - margin * 2;
	let y = 20;

	// Title
	doc.setFontSize(20);
	doc.setTextColor(99, 102, 241);
	doc.text(worksheet.title, margin, y);
	y += 10;

	// Meta info
	doc.setFontSize(10);
	doc.setTextColor(107, 114, 128);
	const typeLabels: Record<string, string> = {
		skill: 'Skill',
		agent: 'Agent',
		workflow: 'Workflow',
		mcp: 'MCP',
	};
	doc.text(
		`Type: ${typeLabels[worksheet.type]} | Status: ${worksheet.isComplete ? 'Complete' : 'In Progress'} | Created: ${new Date(worksheet.createdAt).toLocaleDateString()}`,
		margin,
		y
	);
	y += 15;

	// Divider
	doc.setDrawColor(229, 231, 235);
	doc.line(margin, y, pageWidth - margin, y);
	y += 10;

	// Fields
	worksheet.fields.forEach((field, index) => {
		const response = worksheet.responses[field.id] || '';

		// Check if we need a new page
		if (y > 270) {
			doc.addPage();
			y = 20;
		}

		// Question number
		doc.setFillColor(99, 102, 241);
		doc.circle(margin + 5, y - 2, 5, 'F');
		doc.setTextColor(255, 255, 255);
		doc.setFontSize(10);
		doc.text(String(index + 1), margin + 3.5, y);

		// Question
		doc.setTextColor(31, 41, 55);
		doc.setFontSize(12);
		const questionLines = doc.splitTextToSize(field.question, contentWidth - 20);
		doc.text(questionLines, margin + 15, y);
		y += questionLines.length * 6 + 5;

		// Response
		doc.setFillColor(249, 250, 251);
		doc.roundedRect(margin + 15, y, contentWidth - 15, response ? 20 : 15, 2, 2, 'F');
		doc.setFontSize(10);
		doc.setTextColor(107, 114, 128);
		if (response) {
			doc.setTextColor(31, 41, 55);
			const responseLines = doc.splitTextToSize(response, contentWidth - 25);
			doc.text(responseLines.slice(0, 3), margin + 18, y + 5);
		} else {
			doc.text('Your response...', margin + 18, y + 5);
		}
		y += response ? 30 : 25;

		// Explanation (if any)
		if (field.explanation) {
			doc.setFillColor(238, 242, 255);
			doc.roundedRect(margin + 15, y, contentWidth - 15, 12, 2, 2, 'F');
			doc.setFontSize(9);
			doc.setTextColor(99, 102, 241);
			const expLines = doc.splitTextToSize(`💡 ${field.explanation}`, contentWidth - 25);
			doc.text(expLines.slice(0, 2), margin + 18, y + 5);
			y += expLines.length * 4 + 10;
		}

		y += 5;
	});

	// Footer
	doc.setFontSize(8);
	doc.setTextColor(156, 163, 175);
	doc.text('Generated by AI Worksheet Generator', pageWidth / 2, 290, { align: 'center' });

	return doc.output('blob');
}

// ============================================================
// PRODUCTION-READY REGISTRY GENERATORS
// ============================================================

export function generateAssetDocument(worksheet: Worksheet): string {
	switch (worksheet.type) {
		case 'skill':
			return generateSkillRegistry(worksheet);
		case 'agent':
			return generateAgentIdentity(worksheet);
		case 'workflow':
			return generateWorkflowRegistry(worksheet);
		case 'mcp':
			return generateMCPServerRegistry(worksheet);
		default:
			return generateSkillRegistry(worksheet);
	}
}

function generateSkillRegistry(worksheet: Worksheet): string {
	const skillId = slugify(worksheet.title);
	const name = getFieldValue(worksheet, 'name') || worksheet.title;
	const category = getFieldValue(worksheet, 'category');
	const primaryFunction = getFieldValue(worksheet, 'primary function') || getFieldValue(worksheet, 'function') || getFieldValue(worksheet, 'what does it do');
	const inputs = getFieldValue(worksheet, 'inputs') || getFieldValue(worksheet, 'input fields') || getFieldValue(worksheet, 'input schema');
	const outputs = getFieldValue(worksheet, 'outputs') || getFieldValue(worksheet, 'output fields') || getFieldValue(worksheet, 'output schema');
	const bestPractices = getFieldValue(worksheet, 'best practices') || getFieldValue(worksheet, 'guidelines');
	const useCases = getFieldValue(worksheet, 'use cases') || getFieldValue(worksheet, 'common use cases');

	// Parse user's inputs and outputs into JSON Schema properties
	const inputProperties = parseUserFieldsToSchema(inputs);
	const outputProperties = parseUserFieldsToSchema(outputs);

	// Get all unique property names from user inputs for the required array
	const requiredInputs = Object.keys(inputProperties);

	// Build JSON Schema for inputs
	const inputSchemaObj: Record<string, unknown> = {
		'$schema': 'http://json-schema.org/draft-07/schema#',
		'title': `${name.replace(/[^a-zA-Z0-9]/g, '')}Inputs`,
		'type': 'object',
		'properties': inputProperties,
	};

	if (requiredInputs.length > 0) {
		inputSchemaObj['required'] = requiredInputs;
	}

	// Build JSON Schema for outputs
	const outputSchemaObj = {
		'$schema': 'http://json-schema.org/draft-07/schema#',
		'title': `${name.replace(/[^a-zA-Z0-9]/g, '')}Outputs`,
		'type': 'object',
		'properties': outputProperties
	};

	// Format sections nicely
	const formatUserText = (text: string): string => {
		if (!text) return 'Not specified.';
		return text.split('\n').map(line => {
			const clean = line.replace(/^[-•*]\s*/, '').trim();
			return clean || line;
		}).filter(Boolean).join('\n');
	};

	return `SKILL_REGISTRY:
  ID: "${skillId}"
  Version: "1.0.0"
  Classification: "${category || 'General Purpose'}"
  Runtime_Environment: "Python 3.11 / Node.js 20 compatible"
  Target_Execution_Tiers: "Multi-Agent Networks, Sequential Workflows, Direct API Call"

${JSON.stringify(inputSchemaObj, null, 2)}

${JSON.stringify(outputSchemaObj, null, 2)}

PRIMARY_FUNCTION:
${formatUserText(primaryFunction)}

INPUT_REQUIREMENTS:
${formatUserText(inputs)}

OUTPUT_SPECIFICATIONS:
${formatUserText(outputs)}

BEST_PRACTICES:
${formatUserText(bestPractices)}

COMMON_USE_CASES:
${formatUserText(useCases)}
`;
}

function generateAgentIdentity(worksheet: Worksheet): string {
	const agentId = slugify(worksheet.title);
	const name = getFieldValue(worksheet, 'name') || worksheet.title;
	const role = getFieldValue(worksheet, 'primary role') || getFieldValue(worksheet, 'role') || getFieldValue(worksheet, 'what is its role');
	const voiceTone = getFieldValue(worksheet, 'voice') || getFieldValue(worksheet, 'tone') || 'Professional, helpful, clear';
	const industry = getFieldValue(worksheet, 'industry') || getFieldValue(worksheet, 'target industry') || 'General Purpose';
	const tools = getFieldValue(worksheet, 'tools') || getFieldValue(worksheet, 'available tools') || getFieldValue(worksheet, 'capabilities');
	const responsibilities = getFieldValue(worksheet, 'responsibilities') || getFieldValue(worksheet, 'mandates') || getFieldValue(worksheet, 'core responsibilities');
	const exampleInput = getFieldValue(worksheet, 'example 1') || getFieldValue(worksheet, 'example input');

	// Parse user's tools into capability mapping
	const capabilities = parseUserToolsToCapabilities(tools);

	const capabilityMapping = capabilities.map(cap => {
		return `  - tool: "${cap.name} (v${cap.version})"
    purpose: "${cap.purpose}"`;
	}).join('\n');

	// Format user text sections
	const formatUserText = (text: string): string => {
		if (!text) return 'Not specified.';
		return text.split('\n').map(line => {
			const clean = line.replace(/^[-•*]\s*/, '').trim();
			return clean || line;
		}).filter(Boolean).join('\n');
	};

	return `AGENT_IDENTITY:
  Identifier: "${agentId}"
  Version: "1.0.0"
  Target_Role: "${name}"
  Voice_Tone_Profile: "${voiceTone}"
  Target_Industry: "${industry}"

ROUTING_DEPENDENCIES:
  Primary_Downstream_Skill: "${slugify(name)}_skill"
  System_Data_Bridge: "${slugify(name)}_data_bridge_mcp"


SYSTEM_PROMPT:
${formatUserText(role)}


OPERATIONAL MANDATES & EXECUTION STEP SEQUENCE:

${formatUserText(responsibilities)}


CAPABILITY_MAPPING:
${capabilityMapping}


${exampleInput ? `{
  "agent_state": "Processing Request",
  "internal_decisions": [
    "1. Analyzing user input parameters: ${exampleInput.substring(0, 80)}",
    "2. Selecting appropriate tool for execution.",
    "3. Processing and validating output."
  ],
  "downstream_invocation": {
    "target_skill": "${slugify(name)}_skill",
    "payload": {
      "input_data": "${exampleInput.substring(0, 100)}"
    }
  }
}` : ''}
`;
}

function generateWorkflowRegistry(worksheet: Worksheet): string {
	const workflowId = slugify(worksheet.title);
	const name = getFieldValue(worksheet, 'name') || worksheet.title;
	const triggers = getFieldValue(worksheet, 'triggers') || getFieldValue(worksheet, 'trigger events');
	const steps = getFieldValue(worksheet, 'steps') || getFieldValue(worksheet, 'sequential steps') || getFieldValue(worksheet, 'workflow steps');
	const decisions = getFieldValue(worksheet, 'decision') || getFieldValue(worksheet, 'routing logic');
	const errors = getFieldValue(worksheet, 'error') || getFieldValue(worksheet, 'error handling');
	const outcomes = getFieldValue(worksheet, 'outcomes') || getFieldValue(worksheet, 'expected outcomes');
	const dependencies = getFieldValue(worksheet, 'dependencies');

	// Parse user's content into structured format
	const parsedTriggers = parseUserTriggersToDefinitions(triggers);
	const parsedSteps = parseUserStepsToPipeline(steps);
	const parsedExceptions = parseUserErrorsToExceptions(errors);

	// Format triggers
	const triggerDefinitions = parsedTriggers.map(t => {
		return `  - trigger_type: "${t.triggerType}"
    source: "${t.source}"
    payload_mapping: "${t.payloadMapping}"`;
	}).join('\n');

	// Format pipeline steps
	const pipelineSteps = parsedSteps.map(step => {
		return `  ${step.name}:
    Execute: ${step.execute}
    Output: \`${step.output}\``;
	}).join('\n\n');

	// Format exception handling
	const exceptionHandling = parsedExceptions.length > 0 ? parsedExceptions.map(ex => {
		return `  - exception: "${ex.exception}"
    strategy: "${ex.strategy}"
    max_attempts: ${ex.maxAttempts}
    fallback: "${ex.fallback}"`;
	}).join('\n') : '  - exception: "GENERIC_WORKFLOW_ERROR"\n    strategy: "Retry with backoff"\n    max_attempts: 3\n    fallback: "Log error; alert operator"';

	// Format routing logic from user decisions
	const formatUserText = (text: string): string => {
		if (!text) return '';
		return text.split('\n').map(line => {
			const clean = line.replace(/^[-•*]\s*/, '').trim();
			return clean || line;
		}).filter(Boolean).join('\n');
	};

	return `WORKFLOW_REGISTRY:
  ID: "${workflowId}"
  Version: "1.0.0"
  Execution_Type: "Event-Driven Sequential Pipeline"
  Concurrency_Limit: 5
  Timeout_Threshold: "600s"

TRIGGER_DEFINITIONS:
${triggerDefinitions}

SEQUENCE_PIPELINE:

${pipelineSteps}

${decisions ? `
ROUTING_LOGIC:
{
  "decision_points": {
    ${decisions.split('\n').map(d => {
      const clean = d.trim().replace(/^[-•*\d.]+\s*/, '');
      const parts = clean.split(/[-→:]/);
      if (parts.length >= 2) {
        return `    "${parts[0].trim().substring(0, 40)}": "${parts.slice(1).join('-').trim().substring(0, 60)}"`;
      }
      return `    "${clean.substring(0, 40)}": "default_route"`;
    }).join(',\n    ')}
  }
}` : ''}

EXCEPTION_HANDLING:
${exceptionHandling}

${outcomes ? `
EXPECTED_OUTCOMES:
${formatUserText(outcomes)}` : ''}

${dependencies ? `
DEPENDENCIES:
${formatUserText(dependencies)}` : ''}

{
  "workflow_state": "READY",
  "active_step": "AWAITING_TRIGGER",
  "execution_context": {
    "workflow_id": "${workflowId}",
    "version": "1.0.0"
  }
}
`;
}

function generateMCPServerRegistry(worksheet: Worksheet): string {
	const mcpId = slugify(worksheet.title);
	const name = getFieldValue(worksheet, 'name') || worksheet.title;
	const purpose = getFieldValue(worksheet, 'purpose') || getFieldValue(worksheet, 'what does it do');
	const connection = getFieldValue(worksheet, 'connection') || getFieldValue(worksheet, 'how to connect');
	const tools = getFieldValue(worksheet, 'tools') || getFieldValue(worksheet, 'exposed tools') || getFieldValue(worksheet, 'available tools');
	const auth = getFieldValue(worksheet, 'auth') || getFieldValue(worksheet, 'authentication');
	const usage = getFieldValue(worksheet, 'usage') || getFieldValue(worksheet, 'usage patterns');
	const limits = getFieldValue(worksheet, 'limits') || getFieldValue(worksheet, 'rate limits');

	// Parse user's tools into MCP tool definitions with proper inputSchema
	const capabilities = parseUserToolsToCapabilities(tools);

	const mcpTools = capabilities.map(cap => {
		// Try to extract parameter info from description if present
		const hasParams = cap.description.includes(':') || cap.description.includes('-');
		return `    {
      "name": "${cap.name}",
      "description": "${cap.description}",
      "inputSchema": {
        "type": "object",
        "properties": {},
        "required": []
      }
    }`;
	}).join(',\n');

	// Format user text sections
	const formatUserText = (text: string): string => {
		if (!text) return '';
		return text.split('\n').map(line => {
			const clean = line.replace(/^[-•*]\s*/, '').trim();
			return clean || line;
		}).filter(Boolean).join('\n');
	};

	return `SERVER_REGISTRY:
  Name: "${mcpId}"
  Version: "1.0.0"
  Protocol_Standard: "Model Context Protocol (MCP) v1.0"
  Transport_Layer: "Standard Input/Output (stdio)"
  Runtime_Environment: "Node.js 20+ / TypeScript SDK"
  Execution_Context: "Standard runtime environment"

SECURITY_POLICY:
  Host_Access_Control: "Bound to active user session permissions"
  File_System_Sandbox:
    Enforced_Root_Path: "/workspace/"
    Allowed_Write_Extensions: [".json", ".md", ".txt", ".csv", ".log"]
    Max_Payload_Buffer_Chunk: "10MB"

${purpose ? `PURPOSE:
${formatUserText(purpose)}` : ''}

${connection ? `
CONNECTION_CONFIGURATION:
${formatUserText(connection)}` : ''}

${auth ? `
AUTHENTICATION_REQUIREMENTS:
${formatUserText(auth)}` : ''}

${capabilities.length > 0 ? `
MCP_EXPOSED_TOOLS:
  "mcp_exposed_tools": [
${mcpTools}
  ]` : ''}

${usage ? `
IMPLEMENTATION_PATTERNS:

  - PRE-FLIGHT VALIDATION PATTERN:
    Downstream callers must always validate input schemas before executing tool calls.

  - ANTI-PATTERNS (PROHIBITED EXECUTION):
    Enforce strict blocks against executing unindexed full-drive operations.

  - CACHE ARCHITECTURE:
    Utilize standard local memory caching for schema metadata to minimize overhead.

USAGE_GUIDELINES:
${formatUserText(usage)}` : ''}

${limits ? `
RATE_LIMITS_AND_QUOTAS:
${formatUserText(limits)}` : ''}

{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "params": {},
  "id": 1
}
`;
}

export function downloadFile(content: string | Blob, filename: string) {
	const blob = content instanceof Blob ? content : new Blob([content], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export async function exportWorksheet(
	worksheet: Worksheet,
	format: ExportFormat
): Promise<void> {
	const safeName = worksheet.title
		.replace(/[^a-z0-9]/gi, '-')
		.toLowerCase()
		.substring(0, 50);

	// Determine file extension based on worksheet type
	const getExtension = (): string => {
		switch (worksheet.type) {
			case 'skill':
				return 'skill-registry.md';
			case 'agent':
				return 'agent-identity.md';
			case 'workflow':
				return 'workflow-registry.md';
			case 'mcp':
				return 'mcp-server-registry.md';
			default:
				return 'md';
		}
	};

	switch (format) {
		case 'markdown':
			downloadFile(generateMarkdown(worksheet), `${safeName}.md`);
			break;
		case 'html':
			downloadFile(generateHTML(worksheet), `${safeName}.html`);
			break;
		case 'json':
			downloadFile(generateJSON(worksheet), `${safeName}.json`);
			break;
		case 'pdf':
			const pdfBlob = await generatePDF(worksheet);
			downloadFile(pdfBlob, `${safeName}.pdf`);
			break;
		case 'product':
			// Download the final production-ready registry document
			const productContent = generateAssetDocument(worksheet);
			downloadFile(productContent, `${safeName}.${getExtension()}`);
			break;
	}
}
