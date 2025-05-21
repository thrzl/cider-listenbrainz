import { createId } from "@paralleldrive/cuid2";

/**
 * Plugin configuration.
 */
export default {
	ce_prefix: createId(),
	identifier: "xyz.thrzl.cider-listenbrainz",
	name: "ListenBrainz Scrobbler",
	description:
		"A Cider plugin to scrobble to ListenBrainz, including ISRC for reliable matching.",
	version: "0.0.2",
	author: "thrzl",
	repo: "https://github.com/thrzl/new-cider-listenbrainz",
	entry: {
		"plugin.js": {
			type: "main",
		},
	},
};
