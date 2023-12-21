export default {
	'@context': [
		'http://www.w3.org/ns/anno.jsonld',
		'http://iiif.io/api/presentation/3/context.json',
	],
	type: 'Manifest',
	id: 'https://example.com/manifest/empty-manifest',
	label: {
		en: ['Beginning Responsibility: Lunchroom Manners'],
	},
	metadata: [],
	items: [],
	thumbnail: [
		{
			id: 'https://example.com/manifest/thumbnail/lunchroom_manners_poster.jpg',
			type: 'Image',
		},
	],
};
