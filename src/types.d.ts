/**
 * slimmed down version of a complete submission. excludes certain info that we just won't have, such as mbids
 */
export type ListenBrainzSubmission = {
	listen_type: "single" | "playing_now" | "import";
	payload: [
		{
			listened_at?: number;
			track_metadata: {
				additional_info: {
					media_player: string;
					submission_client: string;
					submission_client_version: string;
					duration_ms: number;
					isrc: string;
					music_service: string;
					tracknumber: number;
				};
				artist_name: string;
				track_name: string;
				release_name: string;
			};
		},
	];
};
