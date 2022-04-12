import { MessageEmbed } from "discord.js";
import Fuse from "fuse.js";

export interface ResolveEmbedOptions {
    excludePrivateElements: boolean;
}

export interface DJSDocsMeta {
    file: string;
    line: number;
    path: string;
}

export interface DocElementReturnType {
    name: string;
    description: string;
    internal_type: DocType;
    props?: string[];
    parent?: string;
    methods?: string[];
    events?: string[];
    params?: string[];
    type?: string;
    examples?: null;
}

export interface DocMethodReturnType extends DocElementReturnType {
    returns: {
        type: string;
        description?: string;
    };
}

export interface DJSClassConstructParams {
    name: string;
    description: string;
    type: string;
}

export interface DJSClassConstruct {
    name: string;
    params: DJSClassConstructParams[];
}

export interface FuseFormat {
    id: string;
    name: string | `${string}#${string}`;
}

export interface BaseEmbedAuthorData {
    name: `${string} (${string})`;
    url: Doc["baseDocsURL"];
    icon_url: Doc["icon"];
}

export interface BaseEmbedData {
    color: Doc["color"];
    author: BaseEmbedAuthorData;
}

export interface DocsSources {
    stable: "https://raw.githubusercontent.com/discordjs/docs/main/discord.js/stable.json";
    main: "https://raw.githubusercontent.com/discordjs/docs/main/discord.js/main.json";
    commando: "https://raw.githubusercontent.com/discordjs/commando/docs/master.json";
    rpc: "https://raw.githubusercontent.com/discordjs/rpc/docs/master.json";
    akairo: "https://raw.githubusercontent.com/discord-akairo/discord-akairo/docs/master.json";
    collection: "https://raw.githubusercontent.com/discordjs/docs/main/collection/main.json";
    builders: "https://raw.githubusercontent.com/discordjs/docs/main/builders/main.json";
    voice: "https://raw.githubusercontent.com/discordjs/docs/main/voice/main.json";
    rest: "https://raw.githubusercontent.com/discordjs/docs/main/rest/main.json";
}

export interface DocFuseOptions {
    shouldSort: true;
    threshold: 0.5;
    location: 0;
    distance: 80;
    maxPatternLength: 32;
    minMatchCharLength: 1;
    keys: ["name", "id"];
    id: "id";
}

export type EmbedPrefix = "c" | "e" | "i" | "m" | "t" | "p";

export type DocTypes = {
    CLASS: "class";
    EVENT: "event";
    INTERFACE: "interface";
    METHOD: "method";
    PARAM: "param";
    PROP: "prop";
    TYPEDEF: "typedef";
};

export type DocType = DocTypes[keyof DocTypes];

export default class Doc extends DocBase {
    public constructor(url: string, docs: Record<string, any>);

    public url: string;
    public fuse: Fuse<Doc["toFuseFormat"], DocFuseOptions>;
    public project: string;
    public repo: string;
    public branch: string;

    get repoURL(): `https://github.com/${string}/${keyof DocsSources}/blob/${string}`;
    get baseURL(): "https://discord.js.org" | "https://discord-akairo.github.io" | null;
    get baseDocsURL(): `${string}/#/docs/${keyof DocsSources}/${string}` | null;
    get icon(): `${string}/favicon.ico` | null;
    get color(): 0x2296f3 | 0x87202f | null;
    get(...terms: any[]): DocElement | null;
    search(query: string, options?: ResolveEmbedOptions): DocElement[] | null;
    resolveEmbed(query: string, options?: ResolveEmbedOptions): MessageEmbed | null;
    toFuseFormat(): FuseFormat[];
    toJSON(): Record<string, any>;
    baseEmbed(): BaseEmbedData;
    formatType(types: string[]): `**${string}**`;
    assignMetaData(): void;
    public static sources(): DocsSources;
    public static fetch(sourceName: keyof DocsSources | string, options?: { force: boolean }): Promise<Doc>;
}

export abstract class DocBase<T = Record<string, any>> {
    public originalJSON: T;
    public children: Map<string, any>;

    constructor(json: T);

    public addChild(child: Record<string, any>[]): void;
    public adoptAll(enumerable: Iterable<Record<string, any>>): void;
    public childrenOfType(type: string): Record<string, any>[] | null;
    public findChild(query: string, exclude: Record<string, any>[]): Record<string, any> | undefined;

    get classes(): Record<string, any>[];
    get typedefs(): Record<string, any>[];
    get interfaces(): Record<string, any>[];
    get props(): Record<string, any>[];
    get methods(): Record<string, any>[];
    get events(): Record<string, any>[];
    get params(): Record<string, any>[];
    static get types(): DocTypes;
}

export abstract class DocElement<Typedef extends boolean = boolean> extends DocBase {
    public constructor(doc: Doc, docType: DocType, data: Record<string, any>, parent: Doc);

    public doc: Doc;
    public docType: DocType;
    public parent: null;

    public name: string;
    public description: string;
    public meta: DJSDocsMeta;

    public returns: null;
    public examples: null;
    public type: Typedef extends true ? string | string[] : null;
    public nullable: null;

    public deprecated: boolean;
    public access: "public" | "private";

    public get embedPrefix(): `:regional_indicator_${EmbedPrefix}:` | null;
    public get anchor(): "s-" | "e-" | null;
    public get url(): string | null;
    public get sourceURL(): string | null;
    public get formattedName(): string;
    public get formattedDescription(): string;
    public get formattedReturn(): string;
    public get formattedType(): string;
    public get formattedExtends(): string;
    public get formattedImplements(): string;
    public get link(): string;
    public get static(): boolean;
    public get typeElement(): DocElement | null;

    public embed(options?: ResolveEmbedOptions): MessageEmbed;
    public formatEmbed(embed: MessageEmbed, options?: ResolveEmbedOptions): MessageEmbed;
    public attachProps(embed: MessageEmbed, options: ResolveEmbedOptions): void;
    public attachMethods(embed: MessageEmbed, options: ResolveEmbedOptions): void;
    public attachEvents(embed: MessageEmbed): void;
    public attachParams(embed: MessageEmbed): void;
    public attachReturn(embed: MessageEmbed): void;
    public attachTypes(embed: MessageEmbed): void;
    public attachExamples(embed: MessageEmbed): void;

    public toJSON(): DocElementReturnType;

    public formatInherits(inherits: any[]): string[];
    public formatText(text: string): string;
    static get types(): DocTypes;
}

export abstract class DocClass extends DocElement {
    public constructor(doc: Doc, data: Record<string, any>);
    public extends: boolean | null;
    public implements: boolean | null;
    public construct: DJSClassConstruct;
}

export abstract class DocEvent extends DocElement {
    public constructor(parent: Doc, data: Record<string, any>);

    public get formattedName(): `${string}#${string}`;
}

export abstract class DocInterface extends DocElement {
    public constructor(doc: Doc, data: Record<string, any>);
}

export abstract class DocMethod extends DocElement {
    public constructor(parent: Doc, data: Record<string, any>);

    public get formattedName(): string;
    public get formattedReturn(): string;

    public toJSON(): DocMethodReturnType;
}

export abstract class DocParam extends DocElement {
    public constructor(parent: Doc, data: Record<string, any>);

    public get formattedName(): `\`[${string}]\`` | `\`${string}\``;
    public get formattedType(): string;
    public get url(): null;
}

export abstract class DocProp extends DocElement {
    public constructor(parent: Doc, data: Record<string, any>);

    public get formattedName(): string;
}

export abstract class DocTypedef extends DocElement {
    public constructor(doc: Doc, data: Record<string, any>);

    public type: string | string[];
}
