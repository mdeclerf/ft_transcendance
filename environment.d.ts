declare namespace NodeJS {
	export interface ProcessEnv {
		POSTGRES_HOST?: string;
		POSTGRES_PORT?: string;
		POSTGRES_USER?: string;
		POSTGRES_PASSWORD?: string;
		POSTGRES_DATABASE?: string;
		PORT?: string;
		INTRA_CLIENT_ID?: string;
		INTRA_CLIENT_SECRET?: string;
		INTRA_CALLBACK_URL?: string;
	}
}