type Options = {
	filter?: (mutations: MutationRecord[]) => boolean;
	signal?: AbortSignal;
} & MutationObserverInit;

export default async function oneMutation(
	element: Element,
	{filter, signal, ...options}: Options = {},
): Promise<MutationRecord[]> {
	if (signal?.aborted) {
		return [];
	}

	return new Promise(resolve => {
		const observer = new MutationObserver((changes) => {
			if (!filter || filter(changes)) {
				observer.disconnect();
				resolve(changes);
			}
		})
		observer.observe(element, options);

		signal?.addEventListener('abort', () => {
			observer.disconnect();
			resolve([]);
		});
	});
}
