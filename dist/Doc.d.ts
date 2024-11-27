import Fuse from "fuse.js";
import { DocAllTypes, DocBase } from "./DocBase";
import { DocElementJSON, EmbedOptions } from "./DocElement";
import { APIEmbed } from "./MessageEmbed";
import { DataJSON } from "./InterfacesForDocElements";
type DocJSON = {
    classes: DocElementJSON[];
    typedefs: DocElementJSON[];
    interfaces: DocElementJSON[];
};
type FuceFormatElement = {
    id: string;
    name: string;
};
declare const sources: {
    [key: string]: string;
};
export declare class Doc extends DocBase {
    url: string;
    project: string;
    repo: string;
    branch: string;
    fuse: Fuse<FuceFormatElement>;
    constructor(url: string, docs: DataJSON);
    get repoURL(): string;
    get baseURL(): string | null;
    get baseDocsURL(): string | null;
    get icon(): string | null;
    get color(): number | null;
    get(...terms: string[]): DocAllTypes | null;
    private _getWithExclude;
    search(query: string, { excludePrivateElements, maxResults }?: EmbedOptions): DocAllTypes[] | null;
    resolveEmbed(query: string, options?: EmbedOptions): APIEmbed | null;
    toFuseFormat(): FuceFormatElement[];
    toJSON(): DocJSON;
    baseEmbed(): APIEmbed;
    formatType(types: string[]): string;
    static getRepoURL(id: string): string;
    static sources(): typeof sources;
    static docFetch(sourceName: string, { force }?: {
        force?: boolean;
    }): Promise<Doc>;
}
export {};
