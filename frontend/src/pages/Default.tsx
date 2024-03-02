import { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { useQuery } from '@tanstack/react-query';
import Center from '../components/Center';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { capitalizeString, formatPathname, classNames } from '../utils';
import { useDocumentTitle } from '../utils/hooks';
import { DEFAULT_DOCUMENT_TITLE, POLLS_STALE_TIME } from '../constants';
import { HOME, POLL } from '../constants/paths';
import type { IPolls } from '../@types';

export default function DefaultPage() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [_, setDocumentTitle] = useDocumentTitle();
	const { isLoading, data: polls } = useQuery<IPolls[]>({
		queryKey: ['spreadsheet', 'GET'],
		enabled: true,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
		refetchOnReconnect: 'always',
		refetchInterval: POLLS_STALE_TIME,
		refetchIntervalInBackground: true,
		staleTime: POLLS_STALE_TIME,
	});

	useEffect(() => {
		if (pathname === '/') navigate(HOME);
		else if (pathname === HOME) setDocumentTitle(DEFAULT_DOCUMENT_TITLE);
		else {
			const realPathname = pathname.slice(1).split('/')[0];
			setDocumentTitle(capitalizeString(formatPathname(realPathname)) + ' / ' + DEFAULT_DOCUMENT_TITLE);
		}
	}, [pathname]);

	return (
		<div className={classNames('flex flex-col mx-auto justify-between min-h-screen', pathname === HOME && 'bg-white')}>
			{isLoading ? (
				<Center>
					<Spinner color="info" size="xl" />
				</Center>
			) : (
				<>
					<Navbar />
					<Center
						className={classNames(!pathname.includes(POLL) && 'max-w-7xl', 'flex-col w-full px-6 lg:px-8 py-12')}
						HtmlTag="main"
					>
						<Outlet context={{ polls }} />
					</Center>
				</>
			)}
			<Footer />
		</div>
	);
}
