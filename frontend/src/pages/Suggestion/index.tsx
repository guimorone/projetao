import { useState, useEffect, type FormEvent } from 'react';
import {
	BsEmojiAngryFill,
	BsEmojiFrownFill,
	BsEmojiNeutralFill,
	BsEmojiSmileFill,
	BsEmojiGrinFill,
} from 'react-icons/bs';
import { useQueries } from '@tanstack/react-query';
import { onSubmitFormHandler, checkIfObjectIsEmpty, classNames, showSuccessToast, showErrorToast } from '../../utils';
import type { ISuggestion, IFeedbacks } from '../../@types';

export default function Suggestion() {
	const suggestionFormDataInitialState = { message: '' };
	const feedbackFormDataInitialState = { score: null };

	const [suggestionFormClicked, setSuggestionFormClicked] = useState<boolean>(false);
	const [feedbackFormClicked, setFeedbackFormClicked] = useState<boolean>(false);
	const [suggestionFormData, setSuggestionFormData] = useState<ISuggestion>(suggestionFormDataInitialState);
	const [feedbackFormData, setFeedbackFormData] = useState<IFeedbacks>(feedbackFormDataInitialState);

	const onSubmitSuggestion = (e: FormEvent<HTMLFormElement>): void => {
		const newSuggestionFormData = onSubmitFormHandler(e);
		if (
			checkIfObjectIsEmpty(newSuggestionFormData) ||
			!('message' in newSuggestionFormData) ||
			!newSuggestionFormData.message
		)
			return;

		setSuggestionFormData(newSuggestionFormData as ISuggestion);
		setSuggestionFormClicked(true);
	};

	const onSubmitFeedback = (e: FormEvent<HTMLFormElement>): void => {
		const newFeedbackFormData = onSubmitFormHandler(e);
		if (checkIfObjectIsEmpty(feedbackFormData) || !('score' in feedbackFormData) || !feedbackFormData.score) return;

		setFeedbackFormData(prev => ({ score: prev.score, ...newFeedbackFormData }));
		setFeedbackFormClicked(true);
	};

	const [
		{
			isFetching: isFetchingSuggestion,
			isFetched: isFetchedSuggestion,
			isError: isErrorSuggestion,
			isSuccess: isSuccessSuggestion,
		},
		{
			isFetching: isFetchingFeedback,
			isFetched: isFetchedFeedback,
			isError: isErrorFeedback,
			isSuccess: isSuccessFeedback,
		},
	] = useQueries({
		queries: [
			{
				queryKey: ['suggestion', 'POST', { data: suggestionFormData }],
				enabled:
					!checkIfObjectIsEmpty(suggestionFormData) &&
					'message' in suggestionFormData &&
					suggestionFormData.message !== '' &&
					suggestionFormClicked === true,
			},
			{
				queryKey: ['feedback', 'POST', { data: feedbackFormData }],
				enabled:
					!checkIfObjectIsEmpty(feedbackFormData) &&
					'score' in feedbackFormData &&
					feedbackFormData.score !== null &&
					feedbackFormClicked === true,
			},
		],
	});

	useEffect(() => {
		if (isFetchedSuggestion) {
			setSuggestionFormData(suggestionFormDataInitialState);
			setSuggestionFormClicked(false);
		}
	}, [isFetchedSuggestion]);

	useEffect(() => {
		if (isSuccessSuggestion) showSuccessToast('Sugestão enviada com sucesso!');
		else if (isErrorSuggestion) showErrorToast('Erro ao enviar sugestão!');
	}, [isErrorSuggestion, isSuccessSuggestion]);

	useEffect(() => {
		if (isFetchedFeedback) {
			setFeedbackFormData(feedbackFormDataInitialState);
			setFeedbackFormClicked(false);
		}
	}, [isFetchedFeedback]);

	useEffect(() => {
		if (isSuccessFeedback) showSuccessToast('Feedback enviado com sucesso!');
		else if (isErrorFeedback) showErrorToast('Erro ao enviar feedback!');
	}, [isErrorFeedback, isSuccessFeedback]);

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
			<div className="mx-auto max-w-3xl text-center">
				<h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Sugestão</h2>
				<p className="mt-4 text-xl md:text-2xl leading-8 text-gray-600">
					Sugira enquetes, pesquisas, votações, ou qualquer outro tipo de interação que você gostaria de ver por aqui.
				</p>
			</div>
			<form className="mx-auto my-16 sm:my-20" autoComplete="off" onSubmit={onSubmitSuggestion}>
				<div className="grid grid-cols-1 gap-y-6">
					<div>
						<label htmlFor="nameS" className="block text-lg font-semibold leading-6 text-gray-900">
							Nome
						</label>
						<div className="mt-2.5">
							<input
								disabled={isFetchingSuggestion}
								type="text"
								name="name"
								id="nameS"
								className="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-lg sm:leading-6 disabled:bg-gray-100"
							/>
						</div>
					</div>
					<div>
						<label htmlFor="messageS" className="block text-lg font-semibold leading-6 text-gray-900">
							Mensagem <span className="text-red-600">*</span>
						</label>
						<div className="mt-2.5">
							<textarea
								disabled={isFetchingSuggestion}
								name="message"
								id="messageS"
								rows={6}
								className="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-lg sm:leading-6 disabled:bg-gray-100"
								required
							/>
						</div>
					</div>
				</div>
				<div className="mt-10">
					<button
						disabled={isFetchingSuggestion}
						type="submit"
						className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-lg md:text-xl font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-700 disabled:hover:cursor-wait"
					>
						{isFetchingSuggestion ? 'Enviando...' : 'Enviar'}
					</button>
				</div>
			</form>
			<div className="mx-auto max-w-3xl text-center">
				<h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Feedback</h2>
				<p className="mt-4 text-xl md:text-2xl leading-8 text-gray-600">
					Conte pra gente o que você tem achado e o que podemos melhorar.
				</p>
			</div>
			<form className="mx-auto my-16 sm:my-20" autoComplete="off" onSubmit={onSubmitFeedback}>
				<div className="grid grid-cols-1 gap-y-6">
					<div>
						<label htmlFor="nameF" className="block text-lg font-semibold leading-6 text-gray-900">
							Nome
						</label>
						<div className="mt-2.5">
							<input
								disabled={isFetchingFeedback}
								type="text"
								name="name"
								id="nameF"
								className="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-lg sm:leading-6 disabled:bg-gray-100"
							/>
						</div>
					</div>
					<div>
						<label htmlFor="messageF" className="block text-lg font-semibold leading-6 text-gray-900">
							Mensagem
						</label>
						<div className="mt-2.5">
							<textarea
								disabled={isFetchingFeedback}
								name="message"
								id="messageF"
								rows={6}
								className="block w-full rounded-md border-0 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-lg sm:leading-6 disabled:bg-gray-100"
							/>
						</div>
					</div>
					<div className="text-center my-4">
						<label htmlFor="message" className="block text-lg font-black leading-6 text-gray-900">
							Como você avalia nosso produto? <span className="text-red-600">*</span>
						</label>
						<div className="mt-4 flex items-center font-bold w-full justify-between text-lg">
							<span>Muito ruim</span>
							<button
								type="button"
								disabled={isFetchingFeedback}
								onClick={() =>
									setFeedbackFormData(prev => ({ ...prev, score: prev.score === 'veryBad' ? null : 'veryBad' }))
								}
							>
								<BsEmojiAngryFill
									className={classNames(
										feedbackFormData.score === 'veryBad'
											? 'ring-4 ring-offset-8 ring-red-600 rounded-full'
											: feedbackFormData.score !== null && 'opacity-20',
										'text-red-600 hover:text-red-500 w-auto h-16'
									)}
									aria-hidden="true"
								/>
							</button>
							<button
								type="button"
								disabled={isFetchingFeedback}
								onClick={() => setFeedbackFormData(prev => ({ ...prev, score: prev.score === 'bad' ? null : 'bad' }))}
							>
								<BsEmojiFrownFill
									className={classNames(
										feedbackFormData.score === 'bad'
											? 'ring-4 ring-offset-8 ring-orange-500 rounded-full'
											: feedbackFormData.score !== null && 'opacity-20',
										'text-orange-500 hover:text-orange-400 w-auto h-16'
									)}
									aria-hidden="true"
								/>
							</button>
							<button
								type="button"
								disabled={isFetchingFeedback}
								onClick={() =>
									setFeedbackFormData(prev => ({ ...prev, score: prev.score === 'neutral' ? null : 'neutral' }))
								}
							>
								<BsEmojiNeutralFill
									className={classNames(
										feedbackFormData.score === 'neutral'
											? 'ring-4 ring-offset-8 ring-yellow-400 rounded-full'
											: feedbackFormData.score !== null && 'opacity-20',
										'text-yellow-400 hover:text-yellow-300 w-auto h-16'
									)}
									aria-hidden="true"
								/>
							</button>
							<button
								type="button"
								disabled={isFetchingFeedback}
								onClick={() => setFeedbackFormData(prev => ({ ...prev, score: prev.score === 'good' ? null : 'good' }))}
							>
								<BsEmojiSmileFill
									className={classNames(
										feedbackFormData.score === 'good'
											? 'ring-4 ring-offset-8 ring-lime-600 rounded-full'
											: feedbackFormData.score !== null && 'opacity-20',
										'text-lime-600 hover:text-lime-500 w-auto h-16'
									)}
									aria-hidden="true"
								/>
							</button>
							<button
								type="button"
								disabled={isFetchingFeedback}
								onClick={() =>
									setFeedbackFormData(prev => ({ ...prev, score: prev.score === 'veryGood' ? null : 'veryGood' }))
								}
							>
								<BsEmojiGrinFill
									className={classNames(
										feedbackFormData.score === 'veryGood'
											? 'ring-4 ring-offset-8 ring-emerald-500 rounded-full'
											: feedbackFormData.score !== null && 'opacity-20',
										'text-emerald-500 hover:text-emerald-400 w-auto h-16'
									)}
									aria-hidden="true"
								/>
							</button>
							<span>Muito bom</span>
						</div>
					</div>
				</div>
				<div className="mt-10">
					<button
						disabled={isFetchingFeedback}
						type="submit"
						className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-lg md:text-xl font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-700 disabled:hover:cursor-wait"
					>
						{isFetchingFeedback ? 'Enviando...' : 'Enviar'}
					</button>
				</div>
			</form>
		</div>
	);
}
