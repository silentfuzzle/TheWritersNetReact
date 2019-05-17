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

export const formatTimeStamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: '2-digit' 
        }).format(new Date(Date.parse(timestamp)));
}

export const getProgress = (visitedPages, totalPages) => {
    return visitedPages / totalPages * 100;
}

export const orderBooks = (books, orderby, orderasc) => {
    if (orderby !== '') {
        books = books.sort((a, b) => {
            if (orderby === 'authors') {
                return (a.authors[0].name > b.authors[0].name) ? 1 : ((b.authors[0].name > a.authors[0].name) ? -1 : 0);
            } else {
                return (a[orderby] > b[orderby]) ? 1 : ((b[orderby] > a[orderby]) ? -1 : 0);
            }
        });

        if (!orderasc) {
            books = books.reverse();
        }
    }

    return books;
}

export const trimContent = content => (content.length > 100 ? content.substring(0, 100) + '...' : content);