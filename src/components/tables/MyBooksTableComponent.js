const mapStateToProps = state => {
    let books = state.books.books.map(book => {
        return {
            id: book.id,
            title: book.title,
            authorship: ''
        }
    })
}