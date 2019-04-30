export const getAuthors = (permissions, users, book) => {
    const authors = permissions
        .filter(p => 
            p.bookid === book.id && p.permissionid < 3)
        .sort((a1, a2) => 
            (a1.permissionid > a2.permissionid) ? 1 : ((a2.permissionid > a1.permissionid) ? -1 : 0))
        .map(permission => {
            let author = users.find(user => user.id === permission.userid);
            return {
                id: author.id,
                name: author.displayname
            };
        });

    return authors;
}

export const getRating = (reviews) => {
    let rating = reviews.reduce((total, review) => total += review.rating, 0);
    return Math.round(rating / reviews.length * 100) / 100;
}

export const findUserReview = (reviews, userid, bookid) => {
    return reviews.find(r => {
        return r.userid === userid && r.bookid === bookid;
    });
}