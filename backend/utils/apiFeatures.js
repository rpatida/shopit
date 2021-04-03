
class APIFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const quryCopy = { ...this.queryStr };

        //Removinf field from the query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(el => delete quryCopy[el]);

        //Advance filterning for rating price,
        let qyeryStr = JSON.stringify(quryCopy);
        qyeryStr = qyeryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(qyeryStr));
        return this;
    }

    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }

}

module.exports = APIFeature;