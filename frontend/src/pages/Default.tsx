import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Center from '../components/Center';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { capitalizeString, formatPathname, classNames } from '../utils';
import { useDocumentTitle } from '../utils/hooks';
import { DEFAULT_DOCUMENT_TITLE } from '../constants';
import { HOME } from '../constants/paths';
import type { IPolls } from '../@types';

export default function DefaultPage() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [_, setDocumentTitle] = useDocumentTitle();
	const [polls, setPolls] = useState<IPolls | []>([]);

	useEffect(() => {
		if (pathname === '/') navigate(HOME);
		else if (pathname === HOME) setDocumentTitle(DEFAULT_DOCUMENT_TITLE);
		else setDocumentTitle(capitalizeString(formatPathname(pathname.slice(1))) + ' / ' + DEFAULT_DOCUMENT_TITLE);
	}, [pathname]);

	return (
		<div
			className={classNames(
				'flex flex-col mx-auto justify-between min-h-screen', pathname === HOME && 'bg-white'
			)}
		>
			<Navbar />
			<Center className="flex-col w-full px-6 lg:px-8 py-12 max-w-7xl" HtmlTag="main">
				<Outlet context={{ polls, setPolls }} />
			</Center>
			<Footer />
		</div>
	);
}
