export default async function oneMutation(
	element: Element,
	filter?: (mutations: MutationRecord[]) => boolean,
	options: MutationObserverInit = {
		childList: true,
		subtree: true
	}
): Promise<MutationRecord[]> {
	return new Promise(resolve => {
		new MutationObserver((changes, observer) => {
			if (!filter || filter(changes)) {
				observer.disconnect();
				resolve(changes);
			}
		}).observe(element, options);
	});
}
