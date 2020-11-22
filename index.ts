interface Options extends MutationObserverInit {
	filter?: (mutations: MutationRecord[]) => boolean;
}

export default async function oneMutation(
	element: Element,
	options: Options = {}
): Promise<MutationRecord[]> {
	return new Promise(resolve => {
		const {filter} = options;
		new MutationObserver((changes, observer) => {
			if (!filter || filter(changes)) {
				observer.disconnect();
				resolve(changes);
			}
		}).observe(element, options);
	});
}
