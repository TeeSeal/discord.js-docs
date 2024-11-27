export type SplitNameWithAnyType = Array<string[] | "*">;
export type JSDocAbstract = boolean;
export type JSDocVirtual = boolean;
export type JSDocAccess = "package" | "private" | "protected" | "public";
export type JSDocAsync = boolean;
export type JSDocExtends = Array<string> | Array<Array<string>>;
export type JSDocDefault = boolean | string | number | null;
export type JSDocDeprecated = boolean | string;
export type JSDocExamples = string[];
export type JSDocEmits = string[];
export type JSDocImplements = Array<string> | Array<Array<string>>;
export type JSDocGenerator = boolean;
export type JSDocReadonly = boolean;
export type JSDocReturns = SplitNameWithAnyType[] | {
    types: SplitNameWithAnyType;
    description?: string;
    nullable?: true;
};
export type JSDocReturn = SplitNameWithAnyType[] | {
    types: SplitNameWithAnyType;
    description?: string;
    nullable?: true;
};
export type JSDocThrows = SplitNameWithAnyType[] | {
    types: SplitNameWithAnyType;
    description?: string;
    nullable?: true;
};
export type JSDocSee = Array<string>;
export type JSDocType = SplitNameWithAnyType[];
export type JSDocScope = "static";
