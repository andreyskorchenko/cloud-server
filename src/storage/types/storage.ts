export type FileStorage = {
    name: string;
    size: number;
};

export type DirectoryStorage = {
    name: string;
    children: (FileStorage | DirectoryStorage)[];
};
