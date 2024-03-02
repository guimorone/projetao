import { useState, Fragment, type FC } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { RiSurveyFill } from 'react-icons/ri';
import { Dialog } from '@headlessui/react';
import { MapIcon, HomeIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { classNames } from '../../utils';
import * as paths from '../../constants/paths';
import logo from '../../assets/logo.png';
import type { INavbarProps } from './types';

const navigation = [
	{ name: 'Início', href: paths.HOME, Icon: HomeIcon, useLink: true },
	{ name: 'Mapa', href: paths.MAP, Icon: MapIcon, useLink: true },
	{ name: 'Sugestões & Feedbacks', href: paths.SUGGESTION, Icon: RiSurveyFill, useLink: true },
];

const Navbar: FC<INavbarProps> = ({ show = true }) => {
	const { pathname } = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

	const handleOpenMobileMenu = (): void => setMobileMenuOpen(true);
	const handleCloseMobileMenu = (): void => setMobileMenuOpen(false);

	return (
		<header
			className={classNames(
				show ? 'visible transition-all duration-500' : 'invisible transition-all duration-500 -translate-y-full',
				'sticky inset-x-0 top-0 z-40 w-fit ml-auto md:mx-auto'
			)}
		>
			{pathname.includes(paths.POLL) ? (
				<Link to={paths.HOME}>
					<img
						src={logo}
						className="text-white bg-gradient-to-b from-orange-600 to-orange-400 w-11/12 sm:w-1/4 mx-auto rounded-lg p-8 m-4"
					/>
				</Link>
			) : (
				<>
					<nav className="md:mt-4" aria-label="Global">
						<div className="max-w-7xl mx-auto w-fit md:bg-gray-900 rounded-full md:shadow-md h-auto max-h-20 px-8 py-6 gap-x-2">
							<div className="block md:hidden">
								<button
									type="button"
									className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-900"
									onClick={handleOpenMobileMenu}
								>
									<span className="sr-only">Open menu</span>
									<Bars3Icon className="h-8 w-auto sm:h-10" aria-hidden="true" />
								</button>
							</div>
							<div className="hidden md:flex md:gap-x-12">
								{navigation.map((item, index) => {
									const isCurrent = item.useLink && pathname === item.href;

									return (
										<Fragment key={`navbar_item_${item.name}_${index}`}>
											{!item.useLink && <hr className="-mx-6 w-[1.5px] h-auto border-t-0 bg-gray-700" />}
											{item.useLink ? (
												<Link
													to={item.href}
													className={classNames(
														isCurrent
															? 'text-teal-400 hover:cursor-default relative'
															: 'text-gray-100 hover:underline hover:underline-offset-2 hover:cursor-pointer',
														'flex gap-x-1.5 items-center text-lg font-semibold leading-6'
													)}
												>
													<item.Icon className="w-5 h-5" />
													<span>{item.name}</span>
													{isCurrent && (
														<span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-400/0 via-teal-400/40 to-teal-400/0"></span>
													)}
												</Link>
											) : (
												<a
													href={item.href}
													className="flex gap-x-1.5 items-center text-sm font-semibold leading-6 text-zinc-100 hover:underline hover:underline-offset-2"
												>
													<item.Icon className="w-4 h-4" />
													<span>{item.name}</span>
												</a>
											)}
										</Fragment>
									);
								})}
							</div>
						</div>
					</nav>
					<Dialog as="div" className="md:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
						<div className="fixed inset-0 z-50" />
						<Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-200 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
							<div className="flex items-center justify-between">
								<button
									type="button"
									className="-m-2.5 rounded-md p-2.5 text-gray-900 hover:text-gray-800"
									onClick={handleCloseMobileMenu}
								>
									<span className="sr-only">Close menu</span>
									<XMarkIcon className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<div className="mt-6 flow-root">
								<div className="-my-6">
									<div className="space-y-2 py-6">
										{navigation.map((item, index) => {
											const isCurrent = item.useLink && pathname === item.href;

											return (
												<Fragment key={`navbar_item_${item.name}_${index}`}>
													{item.useLink ? (
														<Link
															to={item.href}
															onClick={handleCloseMobileMenu}
															className={classNames(
																isCurrent
																	? 'bg-gray-700 hover:cursor-default text-gray-100'
																	: 'hover:bg-gray-700 hover:cursor-pointer text-gray-700 hover:text-gray-100',
																'-mx-3 flex items-center gap-x-1.5 rounded-lg px-3 py-2 text-2xl font-semibold leading-7'
															)}
														>
															<item.Icon className="w-4 h-4" />
															<span>{item.name}</span>
														</Link>
													) : (
														<>
															<hr className="hidden md:block -mx-6 h-px w-auto border-t-0 bg-gray-700" />
															<a
																href={item.href}
																onClick={handleCloseMobileMenu}
																className="hidden -mx-3 md:flex items-center gap-x-1.5 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-zinc-100 hover:bg-zinc-800"
															>
																<item.Icon className="w-4 h-4" />
																<span>{item.name}</span>
															</a>
														</>
													)}
												</Fragment>
											);
										})}
									</div>
								</div>
							</div>
						</Dialog.Panel>
					</Dialog>
				</>
			)}
		</header>
	);
};

export default Navbar;
