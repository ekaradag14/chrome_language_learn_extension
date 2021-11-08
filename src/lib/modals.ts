export type ContactUsMessage = {
	topic: string;
	body: string;
	email: string;
};

export type AuthenticationPayload = {
	uid: string;
};
export type UserSettingsProps = {
	frequency: number;
	amount: number;
	targetLanguages: string[];
	ignoreSpecialCharacters: boolean;
};
