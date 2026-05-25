import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useState } from 'react';

type ViewMode = 'home' | 'templates' | 'editor';

interface HeaderProps {
	onNavigate?: (view: ViewMode) => void;
}

export function Header({ onNavigate }: HeaderProps) {
	const { theme, toggleTheme } = useTheme();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const handleNavClick = (view: ViewMode) => {
		if (onNavigate) {
			onNavigate(view);
		}
		setMobileMenuOpen(false);
	};

	return (
		<header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
							<svg
								className="w-6 h-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<div>
							<h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
								AI Worksheet Generator
							</h1>
							<p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
								Build Skills, Agents, Workflows & MCPs
							</p>
						</div>
					</div>

					<nav className="hidden md:flex items-center gap-6">
						<button
							onClick={() => handleNavClick('home')}
							className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
						>
							Home
						</button>
						<button
							onClick={() => handleNavClick('home')}
							className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
						>
							My Worksheets
						</button>
						<button
							onClick={() => handleNavClick('home')}
							className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
						>
							Help
						</button>
					</nav>

					<div className="flex items-center gap-3">
						<button
							onClick={toggleTheme}
							className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200"
							aria-label="Toggle theme"
						>
							{theme === 'dark' ? (
								<Sun className="w-5 h-5 text-amber-400" />
							) : (
								<Moon className="w-5 h-5 text-slate-600" />
							)}
						</button>

						<button
							className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-slate-800"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
							) : (
								<Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
							)}
						</button>
					</div>
				</div>

				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-gray-200 dark:border-slate-700">
						<nav className="flex flex-col gap-2">
							<button
								onClick={() => handleNavClick('home')}
								className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
							>
								Home
							</button>
							<button
								onClick={() => handleNavClick('home')}
								className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
							>
								My Worksheets
							</button>
							<button
								onClick={() => handleNavClick('home')}
								className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
							>
								Help
							</button>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}