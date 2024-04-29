type File = {
    name: string;
    size: number;
};

type Directory = {
    name: string;
    children: (File | Directory)[];
};

export type RootStorage = (File | Directory)[];
