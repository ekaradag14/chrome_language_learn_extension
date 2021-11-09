export type ContactUsMessage = {
	topic: string;
	body: string;
	email: string;
};

export type AuthenticationPayload = {
	uid: string;
};
export type LanguageOptionProps = {
	title: string;
	code: string;
};
export type UserSettingsProps = {
	frequency: number;
	amount: number;
	targetLanguages: LanguageOptionProps[];
	ignoreSpecialCharacters: boolean;
};
