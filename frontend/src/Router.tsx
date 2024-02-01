import { redirect, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import DefaultPage from './pages/Default';
import Home from './pages/Home';
import Map from './pages/Map';
import Suggestion from './pages/Suggestion';
import * as urlPaths from './constants/paths';

const router = createBrowserRouter([
	{
		path: urlPaths.DEFAULT,
		element: <DefaultPage />,
		children: [
			{ path: urlPaths.HOME, element: <Home /> },
			{ path: urlPaths.MAP, element: <Map /> },
			{ path: urlPaths.SUGGESTION, element: <Suggestion /> },
		],
	},
	{ path: '*', loader: () => redirect(urlPaths.DEFAULT) },
]);

export default function Router() {
	return <RouterProvider router={router} fallbackElement={<Spinner className="h-6 w-6" aria-hidden="true" />} />;
}
