const ITEMS_PER_PAGE = 25;

export const calculatePageSlice = (page, itemsPerPage = ITEMS_PER_PAGE) => {
    const startPage = (page - 1) * itemsPerPage;
    const endPage = page * itemsPerPage;

    return [startPage, endPage];
};

export const calculateLastPage = (items) => {
    return Math.ceil(items / ITEMS_PER_PAGE);
};