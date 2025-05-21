import { defineCustomElement } from "vue";
import { definePluginContext } from "@ciderapp/pluginkit";
import MySettings from "./components/MySettings.vue";
import PluginConfig from "./plugin.config";
import type { ListenBrainzSubmission } from "./types";

/**
 * Custom Elements that will be registered in the app
 */
export const CustomElements = {
	settings: defineCustomElement(MySettings, {
		shadowRoot: false,
	}),
};

/**
 * Defining the plugin context
 */
const { plugin, setupConfig, customElementName, goToPage, useCPlugin } =
	definePluginContext({
		...PluginConfig,
		CustomElements,
		setup() {
			for (const [key, value] of Object.entries(CustomElements)) {
				const _key = key as keyof typeof CustomElements;
				customElements.define(customElementName(_key), value);
			}

			this.SettingsElement = customElementName("settings");

			const media = MusicKit.getInstance();

			let alreadyScrobbled = false;

			media.addEventListener(
				"nowPlayingItemDidChange",
				async ({ item: nowPlayingItem }: { item: MusicKit.MediaItem }) => {
					alreadyScrobbled = false; // whenever the item changes, we didn't scrobble it
					if (!useConfig().listenBrainzToken) {
						console.error("no token specified in settings!");
						return;
					}
					const requestBody: ListenBrainzSubmission = {
						listen_type: "playing_now",
						payload: [
							{
								track_metadata: {
									additional_info: {
										media_player: "Cider",
										submission_client: "thrzl/cider-listenbrainz",
										submission_client_version: "1.0",
										duration_ms: nowPlayingItem.playbackDuration,
										isrc: (
											nowPlayingItem.isrc.match(
												/[A-Z]{2}-?\w{3}-?\d{2}-?\d{5}/,
											) as string[]
										)[0],
										music_service: "music.apple.com",
										tracknumber: nowPlayingItem.trackNumber,
									},
									artist_name: nowPlayingItem.artistName,
									track_name: nowPlayingItem.title.replace(
										/\s*\(feat\. [^)]+\)/i,
										"",
									),
									release_name: nowPlayingItem.albumName.replace(
										/\s*\(feat\. [^)]+\)/i,
										"",
									),
								},
							},
						],
					};
					await fetch("https://api.listenbrainz.org/1/submit-listens", {
						headers: {
							Authorization: `Token ${useConfig().listenBrainzToken}`,
						},
						body: JSON.stringify(requestBody),
						method: "POST",
					});
					console.info(
						`send listenbrainz now playing for ${nowPlayingItem.title} - ${nowPlayingItem.artistName}`,
					);
				},
			);

			media.addEventListener("playbackProgressDidChange", async () => {
				// if (less than halfway through AND we've played less than 4 minutes) OR we already scrobbled
				if (!useConfig().listenBrainzToken) {
					console.error("no token specified in settings!");
					return;
				}
				if (
					(media.currentPlaybackProgress < 0.5 &&
						media.currentPlaybackTime < 4 * 60) ||
					alreadyScrobbled
				) {
					return;
				}
				const nowPlayingItem = media.nowPlayingItem;

				const requestBody: ListenBrainzSubmission = {
					listen_type: "single",
					payload: [
						{
							listened_at: Math.floor(new Date().getTime() / 1000),
							track_metadata: {
								additional_info: {
									media_player: "Cider",
									submission_client: "thrzl/cider-listenbrainz",
									submission_client_version: "1.0",
									duration_ms: nowPlayingItem.playbackDuration,
									isrc: (
										nowPlayingItem.isrc.match(
											/[A-Z]{2}-?\w{3}-?\d{2}-?\d{5}/,
										) as string[]
									)[0],
									music_service: "music.apple.com",
									tracknumber: nowPlayingItem.trackNumber,
								},
								artist_name: nowPlayingItem.artistName,
								track_name: nowPlayingItem.title.replace(
									/\s*\(feat\. [^)]+\)/i,
									"",
								),
								release_name: nowPlayingItem.albumName.replace(
									/\s*\(feat\. [^)]+\)/i,
									"",
								),
							},
						},
					],
				};
				await fetch("https://api.listenbrainz.org/1/submit-listens", {
					headers: {
						Authorization: "Token ab2e9c69-f78c-43bf-8141-7b11fad2cfc9",
					},
					body: JSON.stringify(requestBody),
					method: "POST",
				});
				alreadyScrobbled = true;
				console.info(
					`send listenbrainz scrobble for ${nowPlayingItem.title} - ${nowPlayingItem.artistName}`,
				);
			});
		},
	});

export const cfg = setupConfig({
	listenBrainzServer: <string>"https://api.listenbrainz.org",
	listenBrainzToken: <string>"",
});

export function useConfig() {
	return cfg.value;
}

/**
 * Exporting the plugin and functions
 */
export { setupConfig, customElementName, goToPage, useCPlugin };

/**
 * Exporting the plugin, Cider will use this to load the plugin
 */
export default plugin;
