import { onSubmitFormHandler } from '../../utils';
import type { FormEvent } from 'react';

export default function Suggestion() {
	// TODO:
	// - Integrar com backend
	// - Adicionar emojis para avaliação
	// - Aumentar tamanho dos textos

	const onSubmitSuggestion = (e: FormEvent<HTMLFormElement>) => {
		onSubmitFormHandler(e);
	};

	const onSubmitFeedback = (e: FormEvent<HTMLFormElement>) => {
		onSubmitFormHandler(e);
	};

	return (
		<div className="isolate px-6 lg:px-8">
			<div
				className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
				aria-hidden="true"
			>
				<div
					className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
					style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
					}}
				/>
			</div>
			<div className="mx-auto max-w-2xl text-center">
				<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Sugestão</h2>
				<p className="mt-2 text-lg leading-8 text-gray-600">
					Sugira enquetes, pesquisas, votações, ou qualquer outro tipo de interação que você gostaria de ver por aqui.
				</p>
			</div>
			<form className="mx-auto my-16 sm:my-20" autoComplete="off" onSubmit={onSubmitSuggestion}>
				<div className="grid grid-cols-1 gap-y-6">
					<div>
						<label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
							Nome
						</label>
						<div className="mt-2.5">
							<input
								type="text"
								name="name"
								id="name"
								className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
					<div>
						<label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
							Mensagem <span className="text-red-600">*</span>
						</label>
						<div className="mt-2.5">
							<textarea
								name="message"
								id="message"
								rows={4}
								className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
								required
							/>
						</div>
					</div>
				</div>
				<div className="mt-10">
					<button
						type="submit"
						className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
					>
						Enviar
					</button>
				</div>
			</form>
			<div className="mx-auto max-w-2xl text-center">
				<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Feedback</h2>
				<p className="mt-2 text-lg leading-8 text-gray-600">
					Conte pra gente o que você tem achado e o que podemos melhorar.
				</p>
			</div>
			<form className="mx-auto my-16 sm:my-20" autoComplete="off" onSubmit={onSubmitFeedback}>
				<div className="grid grid-cols-1 gap-y-6">
					<div>
						<label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
							Nome
						</label>
						<div className="mt-2.5">
							<input
								type="text"
								name="name"
								id="name"
								className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
					<div>
						<label htmlFor="score" className="block text-sm font-semibold leading-6 text-gray-900">
							Avaliação <span className="text-red-600">*</span>
						</label>
						<div className="mt-2.5">
							<input
								type="text"
								name="score"
								id="score"
								disabled
								className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
								required
								value="Aqui na verdade vai ser pra selecionar uns emojis"
							/>
						</div>
					</div>
					<div>
						<label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
							Mensagem
						</label>
						<div className="mt-2.5">
							<textarea
								name="message"
								id="message"
								rows={4}
								className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
				</div>
				<div className="mt-10">
					<button
						type="submit"
						className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
					>
						Enviar
					</button>
				</div>
			</form>
		</div>
	);
}
