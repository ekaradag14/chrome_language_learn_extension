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
	targetLanguages: LanguageOptionProps[];
	ignoreSpecialCharacters: boolean;
	frequency: number;
};

export type LanguageType = {
	code: string;
	id: string;
	title: string;
};

export type ConfigType = {
	baseFrequencySeed: number;
	frequencyLowLimit: number;
	frequencyHightLimit: number;
	numberOfValidTagItems: number;
	maxTagTryCallTimes: number;
	minWordLength: number;
	minWordCount: number;
	minSentenceLength: number;
	furthestWordIndexLimit: number;
};
export type TranslationResultProps = {
	clear?: boolean;
	compareText: string;
	translatedText: string;
	options: {
		de: string;
		en: string;
		es: string;
		fr: string;
		it: string;
		ru: string;
	};
	successfulTranslation: boolean;
};
