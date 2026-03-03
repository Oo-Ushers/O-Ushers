export class ApiFeature {

    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData;
    }
    pagination() {
        let { page, size } = this.queryData
        page = parseInt(page)
        size = parseInt(size)
        if (page <= 0) {
            page = 1;
        }
        if (size <= 0) {
            size = 2;
        }
        const skip = (page - 1) * size;
        this.mongooseQuery.limit(size).skip(skip);
        return this;

    }
    sort() {
        this.mongooseQuery.sort(this.queryData.sort?.replaceAll(',', ' '));
        return this;

    }
    select() {
        this.mongooseQuery.select(this.queryData.select?.replaceAll(',', ' '));
        return this;
    }
    filter() {
        const queryObj = { ...this.queryData };
        const excludedFields = ['page', 'sort', 'select', 'size'];
        excludedFields.forEach(field => delete queryObj[field]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }


}